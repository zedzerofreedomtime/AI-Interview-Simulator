package ai

import (
	"archive/zip"
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"html"
	"io"
	"mime"
	"net/http"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"github.com/methasit/intervue-ai/backend/internal/models"
)

const defaultGeminiModel = "gemini-2.5-flash"
const fallbackGeminiModel = "gemini-2.5-flash-lite"

type GeminiProvider struct {
	apiKey     string
	model      string
	httpClient *http.Client
	fallback   *MockProvider
}

func NewGeminiProvider(apiKey string) *GeminiProvider {
	return &GeminiProvider{
		apiKey: strings.TrimSpace(apiKey),
		model:  defaultGeminiModel,
		httpClient: &http.Client{
			Timeout: 180 * time.Second,
		},
		fallback: NewMockProvider(),
	}
}

func (provider *GeminiProvider) AnalyzeResume(
	ctx context.Context,
	fileName string,
	content []byte,
	language string,
) (models.CandidateProfile, error) {
	if provider.apiKey == "" {
		return provider.fallback.AnalyzeResume(ctx, fileName, content, language)
	}

	prompt := buildResumeAnalysisPrompt(fileName, language)
	responseText, err := provider.generateJSON(ctx, prompt, fileName, content)
	if err != nil {
		if !isGeminiRetryable(err) || provider.model == fallbackGeminiModel {
			return models.CandidateProfile{}, err
		}
		responseText, err = provider.generateJSONWithModel(
			ctx,
			fallbackGeminiModel,
			prompt,
			fileName,
			content,
		)
		if err != nil {
			return models.CandidateProfile{}, err
		}
	}

	var profile models.CandidateProfile
	if err := json.Unmarshal([]byte(cleanJSON(responseText)), &profile); err != nil {
		return models.CandidateProfile{}, fmt.Errorf("decode gemini resume analysis: %w", err)
	}
	normalizeProfile(&profile)
	return profile, nil
}

func (provider *GeminiProvider) GenerateQuestions(
	ctx context.Context,
	targetRole string,
	skills []string,
	count int,
	language string,
) ([]models.InterviewQuestion, error) {
	if provider.apiKey == "" {
		return provider.fallback.GenerateQuestions(ctx, targetRole, skills, count, language)
	}
	if count <= 0 {
		count = 4
	}
	prompt := fmt.Sprintf(`Create %d technical interview questions for a %s candidate.
Candidate skills: %s
Output language: %s

Return valid JSON only:
{"questions":[{"id":"q1","text":"...","category":"...","difficulty":"Easy|Medium|Hard"}]}

Make questions practical, role-relevant, non-duplicative, and progressively challenging.
Write every question and category in the requested output language. Keep code, API names, programming languages, and technical terms in their standard form.
Difficulty must remain exactly Easy, Medium, or Hard.`,
		count,
		targetRole,
		strings.Join(skills, ", "),
		languageName(language),
	)
	responseText, err := provider.generatePromptJSON(ctx, prompt)
	if err != nil {
		return nil, err
	}
	var result struct {
		Questions []models.InterviewQuestion `json:"questions"`
	}
	if err := json.Unmarshal([]byte(cleanJSON(responseText)), &result); err != nil {
		return nil, fmt.Errorf("decode gemini interview questions: %w", err)
	}
	if len(result.Questions) == 0 {
		return nil, errors.New("gemini returned no interview questions")
	}
	for index := range result.Questions {
		if result.Questions[index].ID == "" {
			result.Questions[index].ID = fmt.Sprintf("q%d", index+1)
		}
	}
	return result.Questions, nil
}

func (provider *GeminiProvider) EvaluateAnswer(
	ctx context.Context,
	question models.InterviewQuestion,
	answer string,
	language string,
) (models.AnswerEvaluation, error) {
	if provider.apiKey == "" {
		return provider.fallback.EvaluateAnswer(ctx, question, answer, language)
	}
	prompt := fmt.Sprintf(`Evaluate this interview answer honestly and constructively.

Question: %s
Difficulty: %s
Candidate answer: %s
Output language: %s

Return valid JSON only:
{
  "score": 0,
  "accuracy": 0,
  "technicalDepth": 0,
  "communication": 0,
  "problemSolving": 0,
  "completeness": 0,
  "feedback": "Specific strengths, missing points, and how to improve"
}

All scores must be integers from 0 to 100. Write the entire feedback in the requested output language, regardless of the language used in the candidate answer.`,
		question.Text,
		question.Difficulty,
		answer,
		languageName(language),
	)
	responseText, err := provider.generatePromptJSON(ctx, prompt)
	if err != nil {
		return models.AnswerEvaluation{}, err
	}
	var evaluation models.AnswerEvaluation
	if err := json.Unmarshal([]byte(cleanJSON(responseText)), &evaluation); err != nil {
		return models.AnswerEvaluation{}, fmt.Errorf("decode gemini answer evaluation: %w", err)
	}
	return evaluation, nil
}

func (provider *GeminiProvider) generatePromptJSON(
	ctx context.Context,
	prompt string,
) (string, error) {
	parts := []geminiPart{{Text: prompt}}
	responseText, err := provider.generateJSONFromPartsWithModel(ctx, provider.model, parts)
	if err == nil || !isGeminiRetryable(err) || provider.model == fallbackGeminiModel {
		return responseText, err
	}
	return provider.generateJSONFromPartsWithModel(ctx, fallbackGeminiModel, parts)
}

func (provider *GeminiProvider) generateJSON(
	ctx context.Context,
	prompt string,
	fileName string,
	content []byte,
) (string, error) {
	return provider.generateJSONWithModel(ctx, provider.model, prompt, fileName, content)
}

func (provider *GeminiProvider) generateJSONWithModel(
	ctx context.Context,
	model string,
	prompt string,
	fileName string,
	content []byte,
) (string, error) {
	parts, err := resumeParts(prompt, fileName, content)
	if err != nil {
		return "", err
	}
	return provider.generateJSONFromPartsWithModel(ctx, model, parts)
}

func (provider *GeminiProvider) generateJSONFromPartsWithModel(
	ctx context.Context,
	model string,
	parts []geminiPart,
) (string, error) {
	requestBody := geminiGenerateRequest{
		SystemInstruction: geminiContent{
			Parts: []geminiPart{{
				Text: "You are an expert technical recruiter, software engineering interviewer, ATS reviewer, and career coach. Be accurate, practical, and honest. Return only valid JSON.",
			}},
		},
		Contents: []geminiContent{{
			Role:  "user",
			Parts: parts,
		}},
		GenerationConfig: geminiGenerationConfig{
			Temperature:      0.25,
			ResponseMimeType: "application/json",
		},
	}

	body, err := json.Marshal(requestBody)
	if err != nil {
		return "", fmt.Errorf("encode gemini request: %w", err)
	}

	endpoint := fmt.Sprintf(
		"https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent",
		model,
	)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, bytes.NewReader(body))
	if err != nil {
		return "", fmt.Errorf("create gemini request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-goog-api-key", provider.apiKey)

	resp, err := provider.httpClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("call gemini: %w", err)
	}
	defer resp.Body.Close()

	responseBody, err := io.ReadAll(io.LimitReader(resp.Body, 4<<20))
	if err != nil {
		return "", fmt.Errorf("read gemini response: %w", err)
	}
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return "", fmt.Errorf("gemini returned %s: %s", resp.Status, string(responseBody))
	}

	var geminiResp geminiGenerateResponse
	if err := json.Unmarshal(responseBody, &geminiResp); err != nil {
		return "", fmt.Errorf("decode gemini response: %w", err)
	}
	for _, candidate := range geminiResp.Candidates {
		for _, part := range candidate.Content.Parts {
			if strings.TrimSpace(part.Text) != "" {
				return part.Text, nil
			}
		}
	}
	return "", errors.New("gemini returned no text")
}

func isGeminiRetryable(err error) bool {
	message := strings.ToLower(err.Error())
	return strings.Contains(message, "503") ||
		strings.Contains(message, "service unavailable") ||
		strings.Contains(message, "unavailable") ||
		strings.Contains(message, "high demand") ||
		strings.Contains(message, "timeout") ||
		strings.Contains(message, "deadline exceeded")
}

func buildResumeAnalysisPrompt(fileName string, language string) string {
	return fmt.Sprintf(`Analyze the attached resume file named %q.
Output language: %s

Return a rich, open-ended JSON object matching this TypeScript shape exactly:
{
  "name": "string",
  "career": "string",
  "experienceLevel": "string",
  "skills": ["string"],
  "missingSkills": ["string"],
  "analysisSummary": "string",
  "analysisSections": [
    {
      "title": "string",
      "description": "string",
      "score": 0,
      "items": [
        {
          "label": "string",
          "insight": "string",
          "evidence": ["string"],
          "impact": "string",
          "recommendation": "string"
        }
      ],
      "metadata": {"key": "value"}
    }
  ]
}

Do not limit the analysis to a small fixed checklist. Create as many useful analysisSections as the resume deserves.
Write every human-readable analysis field in the requested output language. Keep names, programming languages, technologies, product names, and code in their standard form.

Include sections when relevant:
- candidate positioning and target roles
- ATS and recruiter readability
- technical skills by category
- project credibility and evidence strength
- architecture, backend, frontend, database, cloud, DevOps, testing, security, performance
- experience gaps, risk areas, unclear claims, and missing proof
- resume rewrite suggestions with concrete bullet examples
- interview strategy and likely questions
- learning roadmap
- job-market fit and next role recommendations
- red flags or inconsistencies, if any

Rules:
- Return valid JSON only.
- Keep name/career/experienceLevel/skills/missingSkills populated even if inferred.
- Every section must include at least one item.
- Scores are optional, but when used they must be 0-100.
- Evidence must quote or summarize specific resume signals, not invent facts.
- Be honest about uncertainty.`, fileName, languageName(language))
}

func languageName(language string) string {
	if strings.EqualFold(strings.TrimSpace(language), "th") {
		return "Thai"
	}
	return "English"
}

func resumeParts(prompt string, fileName string, content []byte) ([]geminiPart, error) {
	mimeType := inferMimeType(fileName)
	switch mimeType {
	case "text/plain":
		return []geminiPart{{
			Text: prompt + "\n\nResume text:\n" + string(content),
		}}, nil
	case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
		text, err := extractDOCXText(content)
		if err != nil {
			return nil, fmt.Errorf("extract docx text: %w", err)
		}
		return []geminiPart{{
			Text: prompt + "\n\nExtracted DOCX resume text:\n" + text,
		}}, nil
	case "application/pdf":
		return []geminiPart{
			{Text: prompt},
			{
				InlineData: &geminiInlineData{
					MimeType: mimeType,
					Data:     base64.StdEncoding.EncodeToString(content),
				},
			},
		}, nil
	default:
		return nil, fmt.Errorf("unsupported resume MIME type %q", mimeType)
	}
}

func extractDOCXText(content []byte) (string, error) {
	reader, err := zip.NewReader(bytes.NewReader(content), int64(len(content)))
	if err != nil {
		return "", err
	}
	for _, file := range reader.File {
		if file.Name != "word/document.xml" {
			continue
		}
		rc, err := file.Open()
		if err != nil {
			return "", err
		}
		defer rc.Close()

		xmlBytes, err := io.ReadAll(io.LimitReader(rc, 4<<20))
		if err != nil {
			return "", err
		}
		return docxXMLToText(string(xmlBytes)), nil
	}
	return "", errors.New("word/document.xml not found")
}

func docxXMLToText(value string) string {
	value = strings.ReplaceAll(value, "</w:p>", "\n")
	value = strings.ReplaceAll(value, "</w:tr>", "\n")
	value = strings.ReplaceAll(value, "</w:tc>", "\t")
	value = regexp.MustCompile(`<[^>]+>`).ReplaceAllString(value, " ")
	value = html.UnescapeString(value)
	value = regexp.MustCompile(`[ \t]+`).ReplaceAllString(value, " ")
	value = regexp.MustCompile(`\n\s+`).ReplaceAllString(value, "\n")
	return strings.TrimSpace(value)
}

func normalizeProfile(profile *models.CandidateProfile) {
	if profile.Name == "" {
		profile.Name = "Candidate"
	}
	if profile.Career == "" {
		profile.Career = "Software Developer"
	}
	if profile.ExperienceLevel == "" {
		profile.ExperienceLevel = "Not specified"
	}
	if profile.Skills == nil {
		profile.Skills = []string{}
	}
	if profile.MissingSkills == nil {
		profile.MissingSkills = []string{}
	}
	if profile.AnalysisSummary == "" {
		profile.AnalysisSummary = "AI analysis completed."
	}
	if profile.AnalysisSections == nil {
		profile.AnalysisSections = []models.AnalysisSection{}
	}
	for sectionIndex := range profile.AnalysisSections {
		if profile.AnalysisSections[sectionIndex].Items == nil {
			profile.AnalysisSections[sectionIndex].Items = []models.AnalysisItem{}
		}
	}
}

func cleanJSON(value string) string {
	value = strings.TrimSpace(value)
	value = strings.TrimPrefix(value, "```json")
	value = strings.TrimPrefix(value, "```")
	value = strings.TrimSuffix(value, "```")
	return strings.TrimSpace(value)
}

func inferMimeType(fileName string) string {
	extension := strings.ToLower(filepath.Ext(fileName))
	if value := mime.TypeByExtension(extension); value != "" {
		return value
	}
	switch extension {
	case ".pdf":
		return "application/pdf"
	case ".txt":
		return "text/plain"
	case ".docx":
		return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
	case ".doc":
		return "application/msword"
	default:
		return "application/octet-stream"
	}
}

type geminiGenerateRequest struct {
	SystemInstruction geminiContent          `json:"systemInstruction"`
	Contents          []geminiContent        `json:"contents"`
	GenerationConfig  geminiGenerationConfig `json:"generationConfig"`
}

type geminiContent struct {
	Role  string       `json:"role,omitempty"`
	Parts []geminiPart `json:"parts"`
}

type geminiPart struct {
	Text       string            `json:"text,omitempty"`
	InlineData *geminiInlineData `json:"inlineData,omitempty"`
}

type geminiInlineData struct {
	MimeType string `json:"mimeType"`
	Data     string `json:"data"`
}

type geminiGenerationConfig struct {
	Temperature      float64 `json:"temperature"`
	ResponseMimeType string  `json:"responseMimeType"`
}

type geminiGenerateResponse struct {
	Candidates []struct {
		Content geminiContent `json:"content"`
	} `json:"candidates"`
}

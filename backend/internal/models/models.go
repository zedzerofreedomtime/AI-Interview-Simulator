package models

import "time"

type CandidateProfile struct {
	Name             string            `json:"name"`
	Career           string            `json:"career"`
	ExperienceLevel  string            `json:"experienceLevel"`
	Skills           []string          `json:"skills"`
	MissingSkills    []string          `json:"missingSkills"`
	AnalysisSummary  string            `json:"analysisSummary"`
	AnalysisSections []AnalysisSection `json:"analysisSections"`
}

type AnalysisSection struct {
	Title       string            `json:"title"`
	Description string            `json:"description"`
	Score       *int              `json:"score,omitempty"`
	Items       []AnalysisItem    `json:"items"`
	Metadata    map[string]string `json:"metadata,omitempty"`
}

type AnalysisItem struct {
	Label          string   `json:"label"`
	Insight        string   `json:"insight"`
	Evidence       []string `json:"evidence,omitempty"`
	Impact         string   `json:"impact,omitempty"`
	Recommendation string   `json:"recommendation,omitempty"`
}

type InterviewSummary struct {
	ID       string   `json:"id"`
	Date     string   `json:"date"`
	Role     string   `json:"role"`
	Duration string   `json:"duration"`
	Score    int      `json:"score"`
	Topics   []string `json:"topics"`
	Result   string   `json:"result"`
}

type RoadmapItem struct {
	Week        int      `json:"week"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Hours       int      `json:"hours"`
	Outcomes    []string `json:"outcomes"`
}

type Dashboard struct {
	GreetingName     string             `json:"greetingName"`
	Readiness        int                `json:"readiness"`
	TargetRole       string             `json:"targetRole"`
	CandidateProfile CandidateProfile   `json:"candidateProfile"`
	RecentInterviews []InterviewSummary `json:"recentInterviews"`
	Roadmap          []RoadmapItem      `json:"roadmap"`
}

type ResumeAnalysis struct {
	ID               string           `json:"resumeId"`
	FileName         string           `json:"fileName"`
	CandidateProfile CandidateProfile `json:"candidateProfile"`
	CreatedAt        time.Time        `json:"createdAt"`
}

type InterviewQuestion struct {
	ID         string `json:"id"`
	Text       string `json:"text"`
	Category   string `json:"category"`
	Difficulty string `json:"difficulty"`
}

type InterviewSession struct {
	ID         string              `json:"id"`
	TargetRole string              `json:"targetRole"`
	Questions  []InterviewQuestion `json:"questions"`
	CreatedAt  time.Time           `json:"createdAt"`
}

type AnswerEvaluation struct {
	Score          int    `json:"score"`
	Accuracy       int    `json:"accuracy"`
	TechnicalDepth int    `json:"technicalDepth"`
	Communication  int    `json:"communication"`
	ProblemSolving int    `json:"problemSolving"`
	Completeness   int    `json:"completeness"`
	Feedback       string `json:"feedback"`
}

type InterviewAnswer struct {
	ID         string           `json:"id"`
	SessionID  string           `json:"sessionId"`
	QuestionID string           `json:"questionId"`
	Answer     string           `json:"answer"`
	Evaluation AnswerEvaluation `json:"evaluation"`
	CreatedAt  time.Time        `json:"createdAt"`
}

package ai

import (
	"context"
	"strings"

	"github.com/google/uuid"

	"github.com/methasit/intervue-ai/backend/internal/models"
)

type MockProvider struct{}

func NewMockProvider() *MockProvider {
	return &MockProvider{}
}

func (provider *MockProvider) AnalyzeResume(
	_ context.Context,
	_ string,
	_ []byte,
	_ string,
) (models.CandidateProfile, error) {
	resumeDepthScore := 72
	atsScore := 68
	interviewReadinessScore := 74
	projectCredibilityScore := 70

	return models.CandidateProfile{
		Name:            "Methasit",
		Career:          "Backend Developer",
		ExperienceLevel: "Junior",
		Skills:          []string{"Go", "React", "PostgreSQL", "Redis"},
		MissingSkills:   []string{"Docker", "CI/CD", "Testing"},
		AnalysisSummary: "เน€เธฃเธเธนเน€เธกเนเธกเธตเธเธฒเธ backend เธ—เธตเนเธ”เธต เน€เธซเนเธเธชเธฑเธเธเธฒเธ“เธเธญเธ Go, database, caching เนเธฅเธฐ frontend integration เนเธ•เนเธขเธฑเธเธเธงเธฃเน€เธเธดเนเธกเธซเธฅเธฑเธเธเธฒเธเน€เธเธดเธเธเธฅเธเธฒเธ เน€เธเนเธ scale, metrics, testing, deployment เนเธฅเธฐเน€เธซเธ•เธธเธเธฅเน€เธเธดเธ architecture เน€เธเธทเนเธญเนเธซเนเธ”เธนเธเธฃเนเธญเธกเธชเธณเธซเธฃเธฑเธเธเธฒเธเธเธฃเธดเธเธกเธฒเธเธเธถเนเธ",
		AnalysisSections: []models.AnalysisSection{
			{
				Title:       "เธ เธฒเธเธฃเธงเธกเธเธงเธฒเธกเธเธฃเนเธญเธกเธเธญเธเธเธนเนเธชเธกเธฑเธเธฃ",
				Description: "เธเธฃเธฐเน€เธกเธดเธเธเธฒเธเธ—เธฑเธเธฉเธฐเธ—เธตเนเธเธ เธเธงเธฒเธกเธชเธญเธ”เธเธฅเนเธญเธเธเธฑเธเธ•เธณเนเธซเธเนเธ เนเธฅเธฐเธเธงเธฒเธกเธเธฑเธ”เธเธญเธเธเธฃเธฐเธชเธเธเธฒเธฃเธ“เนเนเธเน€เธฃเธเธนเน€เธกเน",
				Score:       &resumeDepthScore,
				Items: []models.AnalysisItem{
					{
						Label:          "เธ—เธดเธจเธ—เธฒเธเธญเธฒเธเธตเธ",
						Insight:        "เน€เธซเธกเธฒเธฐเธเธฑเธเน€เธชเนเธเธ—เธฒเธ Backend Developer เธ—เธตเนเนเธ•เธฐเธเธฒเธ API, database เนเธฅเธฐ caching",
						Evidence:       []string{"เธเธ Go", "เธเธ PostgreSQL", "เธเธ Redis"},
						Impact:         "เธเนเธงเธขเนเธซเนเธฃเธฐเธเธเธชเธฃเนเธฒเธเธเธณเธ–เธฒเธก backend เนเธ”เนเน€เธเธเธฒเธฐเธ—เธฒเธเธเธถเนเธ",
						Recommendation: "เน€เธเธดเนเธก project summary เธ—เธตเนเธเธญเธเธเธฑเธเธซเธฒ เธงเธดเธเธตเธญเธญเธเนเธเธ เนเธฅเธฐเธเธฅเธฅเธฑเธเธเนเธเธญเธเธฃเธฐเธเธเธ—เธตเนเธ—เธณ",
					},
					{
						Label:          "เธฃเธฐเธ”เธฑเธเธเธฃเธฐเธชเธเธเธฒเธฃเธ“เน",
						Insight:        "เธญเธขเธนเนเนเธเธเนเธงเธ Junior เธ—เธตเนเธกเธตเธเธทเนเธเธเธฒเธเธซเธฅเธฒเธเธซเธฅเธฒเธข เนเธ•เนเธซเธฅเธฑเธเธเธฒเธ production เธขเธฑเธเนเธกเนเนเธเนเธ",
						Impact:         "เธเธนเนเธชเธฑเธกเธ เธฒเธฉเธ“เนเธญเธฒเธเธ–เธฒเธกเธฅเธถเธเน€เธฃเธทเนเธญเธ debugging, testing เนเธฅเธฐ deployment",
						Recommendation: "เนเธชเนเธ•เธฑเธงเธญเธขเนเธฒเธ bug เธ—เธตเนเน€เธเธขเนเธเน, test coverage เธซเธฃเธทเธญ deployment workflow เธญเธขเนเธฒเธเธเนเธญเธข 1 เนเธเธฃเน€เธเธเธ•เน",
					},
				},
			},
			{
				Title:       "ATS เนเธฅเธฐเธเธงเธฒเธกเธเธฑเธ”เธเธญเธเน€เธฃเธเธนเน€เธกเน",
				Description: "เธงเธดเน€เธเธฃเธฒเธฐเธซเนเธเธงเธฒเธกเธญเนเธฒเธเธเนเธฒเธขเธ•เนเธญเธฃเธฐเธเธเธเธฑเธ”เธเธฃเธญเธเนเธฅเธฐ recruiter",
				Score:       &atsScore,
				Items: []models.AnalysisItem{
					{
						Label:          "Keyword coverage",
						Insight:        "เธกเธต keyword เธชเธณเธเธฑเธเธชเธณเธซเธฃเธฑเธ backend เนเธฅเนเธง เนเธ•เนเธขเธฑเธเธเธฒเธ”เธเธณเธ—เธตเนเธเธญเธ workflow เธเธฃเธดเธ",
						Evidence:       []string{"Go", "PostgreSQL", "Redis"},
						Recommendation: "เน€เธเธดเนเธก REST API, Docker, CI/CD, unit test, integration test, authentication เนเธฅเธฐ deployment เธ–เนเธฒเธกเธตเธเธฃเธฐเธชเธเธเธฒเธฃเธ“เนเธเธฃเธดเธ",
					},
					{
						Label:          "Impact statement",
						Insight:        "เธขเธฑเธเธเธงเธฃเน€เธเธฅเธตเนเธขเธเธเธฒเธเธเธฒเธฃเธเธญเธเธงเนเธฒเนเธเนเน€เธ—เธเนเธเนเธฅเธขเธตเธญเธฐเนเธฃ เนเธเน€เธเนเธเธเธญเธเธงเนเธฒเธ—เธณเนเธซเนเธฃเธฐเธเธเธ”เธตเธเธถเนเธเธญเธขเนเธฒเธเนเธฃ",
						Recommendation: "เน€เธเธตเธขเธ bullet เนเธเธ Action + System + Metric เน€เธเนเธ เธฅเธ”เน€เธงเธฅเธฒเธ•เธญเธ API เธฅเธเธเธตเนเน€เธเธญเธฃเนเน€เธเนเธเธ•เน เธซเธฃเธทเธญเธฃเธญเธเธฃเธฑเธ request เนเธ”เนเน€เธ—เนเธฒเนเธฃ",
					},
				},
			},
			{
				Title:       "เธเธงเธฒเธกเธฅเธถเธเธ—เธฒเธเน€เธ—เธเธเธดเธ",
				Description: "เธ”เธนเธงเนเธฒเธกเธตเธชเธฑเธเธเธฒเธ“เธเธญเนเธซเนเธ–เธฒเธกเธ•เนเธญเน€เธฃเธทเนเธญเธ architecture, performance เนเธฅเธฐ trade-off เธซเธฃเธทเธญเนเธกเน",
				Score:       &projectCredibilityScore,
				Items: []models.AnalysisItem{
					{
						Label:          "Database design",
						Insight:        "PostgreSQL เน€เธเนเธเธเธธเธ”เนเธเนเธเธ—เธตเนเธ•เนเธญเธขเธญเธ”เน€เธเนเธเธเธณเธ–เธฒเธกเน€เธฃเธทเนเธญเธ schema, index เนเธฅเธฐ transaction เนเธ”เน",
						Recommendation: "เน€เธเธดเนเธกเธ•เธฑเธงเธญเธขเนเธฒเธ table design, index เธ—เธตเนเนเธเนเธเธฃเธดเธ เธซเธฃเธทเธญ query เธ—เธตเนเน€เธเธข optimize",
					},
					{
						Label:          "Caching strategy",
						Insight:        "Redis เน€เธเนเธเธชเธฑเธเธเธฒเธ“เธ”เธต เนเธ•เนเธเธงเธฃเธญเธเธดเธเธฒเธข use case เนเธซเนเธเธฑเธ” เน€เธเนเธ session, cache, rate limit เธซเธฃเธทเธญ queue",
						Recommendation: "เธฃเธฐเธเธธ cache invalidation strategy เธซเธฃเธทเธญ TTL เธ—เธตเนเน€เธเธขเนเธเน เน€เธเธทเนเธญเนเธซเนเธ”เธนเธกเธตเธเธฃเธฐเธชเธเธเธฒเธฃเธ“เน production",
					},
					{
						Label:          "Testing gap",
						Insight:        "Testing เธขเธฑเธเน€เธเนเธเธเนเธญเธเธงเนเธฒเธเธชเธณเธเธฑเธเธชเธณเธซเธฃเธฑเธ backend role",
						Impact:         "เธ–เนเธฒเนเธ”เธเธ–เธฒเธกเน€เธฃเธทเนเธญเธ maintainability เธญเธฒเธเธ•เธญเธเนเธ”เนเนเธกเนเนเธเนเธ",
						Recommendation: "เธเธถเธ table-driven tests เนเธ Go เนเธฅเธฐเน€เธเธดเนเธก mock repository/service tests เนเธเนเธเธฃเน€เธเธเธ•เน",
					},
				},
			},
			{
				Title:       "เธเธฅเธขเธธเธ—เธเนเน€เธ•เธฃเธตเธขเธกเธชเธฑเธกเธ เธฒเธฉเธ“เน",
				Description: "เธซเธฑเธงเธเนเธญเธ—เธตเนเธเธงเธฃเธเนเธญเธกเน€เธเธทเนเธญเนเธซเนเธ•เธญเธเนเธ”เนเธฅเธถเธเธเธงเนเธฒเธเธฒเธฃเธ—เนเธญเธเธเธณ",
				Score:       &interviewReadinessScore,
				Items: []models.AnalysisItem{
					{
						Label:          "JWT เนเธฅเธฐ authentication",
						Insight:        "เธเธงเธฃเน€เธฅเนเธฒ flow access token/refresh token, security risks เนเธฅเธฐ logout strategy เนเธ”เน",
						Recommendation: "เน€เธ•เธฃเธตเธขเธกเธเธณเธ•เธญเธเน€เธฃเธทเนเธญเธ token expiry, rotation, storage, CSRF/XSS เนเธฅเธฐ revoke token",
					},
					{
						Label:          "System design เธฃเธฐเธ”เธฑเธ junior",
						Insight:        "เธเธงเธฃเธญเธเธดเธเธฒเธข service boundaries, repository pattern เนเธฅเธฐ error handling เนเธ”เน",
						Recommendation: "เธเนเธญเธกเธญเธญเธเนเธเธ API เน€เธฅเนเธ เน เธเธฃเนเธญเธก database schema เนเธฅเธฐ trade-off 2-3 เธเธธเธ”",
					},
					{
						Label:          "เธเธณเธ–เธฒเธก behavioral",
						Insight:        "เธขเธฑเธเธเธงเธฃเน€เธ•เธฃเธตเธขเธกเน€เธฃเธทเนเธญเธเธเธฒเธฃเน€เธฃเธตเธขเธเธฃเธนเนเน€เธฃเนเธง เธเธฒเธฃเธฃเธฑเธ feedback เนเธฅเธฐเธเธฒเธฃเนเธเนเธเธฑเธเธซเธฒเน€เธกเธทเนเธญเนเธกเนเธฃเธนเนเธเธณเธ•เธญเธ",
						Recommendation: "เน€เธ•เธฃเธตเธขเธก STAR stories 3 เน€เธฃเธทเนเธญเธ: bug เธขเธฒเธ, deadline เธเธ”เธ”เธฑเธ, เนเธฅเธฐเธเธฒเธฃเน€เธฃเธตเธขเธ tech เนเธซเธกเน",
					},
				},
			},
			{
				Title:       "เธเธณเนเธเธฐเธเธณเธเธฃเธฑเธเน€เธฃเธเธนเน€เธกเนเนเธเธเธฅเธเธกเธทเธญเธ—เธณ",
				Description: "เธฃเธฒเธขเธเธฒเธฃเนเธเนเธ—เธตเนเธ—เธณเนเธ”เนเธ—เธฑเธเธ—เธตเน€เธเธทเนเธญเนเธซเนเน€เธฃเธเธนเน€เธกเนเธ”เธนเธเนเธฒเน€เธเธทเนเธญเธ–เธทเธญเธเธถเนเธ",
				Items: []models.AnalysisItem{
					{
						Label:          "เน€เธเธดเนเธก project bullets",
						Insight:        "เธ—เธธเธเนเธเธฃเน€เธเธเธ•เนเธเธงเธฃเธกเธต 2-4 bullet เธ—เธตเนเธเธญเธ context, responsibility เนเธฅเธฐ result",
						Recommendation: "เนเธเนเธฃเธนเธเนเธเธ Built/Designed/Optimized + technical detail + measurable result",
					},
					{
						Label:          "เนเธขเธ skill เธ•เธฒเธกเธซเธกเธงเธ”",
						Insight:        "เธเธฒเธฃเธฃเธงเธก skill เธ—เธฑเนเธเธซเธกเธ”เนเธงเนเธเนเธญเธเน€เธ”เธตเธขเธงเธ—เธณเนเธซเน recruiter เธญเนเธฒเธเธขเธฒเธ",
						Recommendation: "เนเธขเธ Backend, Frontend, Database, DevOps, Testing เนเธฅเธฐ Tools",
					},
					{
						Label:          "เน€เธเธดเนเธกเธเนเธญเธเธณเธเธฑเธ”เนเธฅเธฐ trade-off",
						Insight:        "เน€เธฃเธเธนเน€เธกเนเธ—เธตเนเธ”เธตเนเธกเนเนเธเนเนเธเนเธเธญเธเธงเนเธฒเธ—เธณเธญเธฐเนเธฃ เนเธ•เนเธเธญเธเธงเนเธฒเธ—เธณเนเธกเน€เธฅเธทเธญเธเธงเธดเธเธตเธเธฑเนเธ",
						Recommendation: "เน€เธเธดเนเธก 1 bullet เธ•เนเธญเนเธเธฃเน€เธเธเธ•เนเธ—เธตเนเน€เธฅเนเธฒ trade-off เน€เธเนเธ Redis cache vs direct DB query",
					},
				},
			},
		},
	}, nil
}

func (provider *MockProvider) GenerateQuestions(
	_ context.Context,
	targetRole string,
	_ []string,
	count int,
	language string,
) ([]models.InterviewQuestion, error) {
	questions := []models.InterviewQuestion{
		{ID: uuid.NewString(), Text: "How does JWT authentication work, and what security trade-offs should a backend developer understand?", Category: "Authentication", Difficulty: "Medium"},
		{ID: uuid.NewString(), Text: "When would you use Redis in a production API, and how would you prevent stale cache data?", Category: "Caching", Difficulty: "Medium"},
		{ID: uuid.NewString(), Text: "Explain how a database index improves query performance and when an index can make performance worse.", Category: "Databases", Difficulty: "Hard"},
		{ID: uuid.NewString(), Text: "Design an API authentication flow that supports access tokens, refresh tokens, and logout across multiple devices.", Category: "Architecture", Difficulty: "Hard"},
		{ID: uuid.NewString(), Text: "How would you structure a " + targetRole + " service so its business logic is easy to test?", Category: "Clean Architecture", Difficulty: "Hard"},
	}
	if language == "th" {
		questions = []models.InterviewQuestion{
			{ID: uuid.NewString(), Text: "JWT authentication ทำงานอย่างไร และนักพัฒนา backend ควรเข้าใจข้อแลกเปลี่ยนด้านความปลอดภัยอะไรบ้าง", Category: "การยืนยันตัวตน", Difficulty: "Medium"},
			{ID: uuid.NewString(), Text: "คุณจะใช้ Redis ใน production API เมื่อใด และจะป้องกันข้อมูล cache ที่ล้าสมัยอย่างไร", Category: "การทำแคช", Difficulty: "Medium"},
			{ID: uuid.NewString(), Text: "อธิบายว่า database index ช่วยเพิ่มประสิทธิภาพ query อย่างไร และกรณีใดที่ index อาจทำให้ระบบช้าลง", Category: "ฐานข้อมูล", Difficulty: "Hard"},
			{ID: uuid.NewString(), Text: "ออกแบบ API authentication ที่รองรับ access token, refresh token และการ logout จากหลายอุปกรณ์", Category: "สถาปัตยกรรม", Difficulty: "Hard"},
			{ID: uuid.NewString(), Text: "คุณจะจัดโครงสร้าง service สำหรับตำแหน่ง " + targetRole + " อย่างไรเพื่อให้ business logic ทดสอบได้ง่าย", Category: "Clean Architecture", Difficulty: "Hard"},
		}
	}
	if count <= 0 || count > len(questions) {
		count = len(questions)
	}
	return questions[:count], nil
}

func (provider *MockProvider) EvaluateAnswer(
	_ context.Context,
	_ models.InterviewQuestion,
	answer string,
	language string,
) (models.AnswerEvaluation, error) {
	wordCount := len(strings.Fields(answer))
	score := clamp(42+wordCount*2, 42, 91)
	return models.AnswerEvaluation{
		Score:          score,
		Accuracy:       clamp(score+4, 0, 94),
		TechnicalDepth: clamp(score-5, 0, 90),
		Communication:  clamp(score+2, 0, 95),
		ProblemSolving: clamp(score-2, 0, 92),
		Completeness:   clamp(score, 0, 93),
		Feedback:       mockFeedback(language),
	}, nil
}

func mockFeedback(language string) string {
	if language == "th" {
		return "แนวทางดีแล้ว ควรเพิ่มข้อแลกเปลี่ยนที่ชัดเจนและตัวอย่างจาก production อีกหนึ่งกรณีเพื่อทำให้คำตอบแข็งแรงขึ้น"
	}
	return "Good direction. Add a concrete trade-off and one production example to make the answer stronger."
}

func clamp(value, minimum, maximum int) int {
	if value < minimum {
		return minimum
	}
	if value > maximum {
		return maximum
	}
	return value
}

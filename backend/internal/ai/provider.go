package ai

import (
	"context"

	"github.com/methasit/intervue-ai/backend/internal/models"
)

type Provider interface {
	AnalyzeResume(ctx context.Context, fileName string, content []byte, language string) (models.CandidateProfile, error)
	GenerateQuestions(ctx context.Context, targetRole string, skills []string, count int, language string) ([]models.InterviewQuestion, error)
	EvaluateAnswer(ctx context.Context, question models.InterviewQuestion, answer string, language string) (models.AnswerEvaluation, error)
}

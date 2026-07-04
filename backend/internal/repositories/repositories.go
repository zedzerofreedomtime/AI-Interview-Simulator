package repositories

import (
	"context"

	"github.com/methasit/intervue-ai/backend/internal/models"
)

type DashboardRepository interface {
	GetDashboard(ctx context.Context) (models.Dashboard, error)
}

type ResumeRepository interface {
	SaveResumeAnalysis(ctx context.Context, analysis models.ResumeAnalysis) error
}

type InterviewRepository interface {
	SaveInterviewSession(ctx context.Context, session models.InterviewSession) error
	GetInterviewSession(ctx context.Context, id string) (models.InterviewSession, error)
	SaveInterviewAnswer(ctx context.Context, answer models.InterviewAnswer) error
}

package services

import (
	"context"
	"time"

	"github.com/google/uuid"

	"github.com/methasit/intervue-ai/backend/internal/ai"
	"github.com/methasit/intervue-ai/backend/internal/models"
	"github.com/methasit/intervue-ai/backend/internal/repositories"
)

type ResumeService struct {
	repository repositories.ResumeRepository
	aiProvider ai.Provider
}

func NewResumeService(
	repository repositories.ResumeRepository,
	aiProvider ai.Provider,
) *ResumeService {
	return &ResumeService{repository: repository, aiProvider: aiProvider}
}

func (service *ResumeService) Analyze(
	ctx context.Context,
	fileName string,
	content []byte,
	language string,
) (models.ResumeAnalysis, error) {
	profile, err := service.aiProvider.AnalyzeResume(ctx, fileName, content, language)
	if err != nil {
		return models.ResumeAnalysis{}, err
	}
	analysis := models.ResumeAnalysis{
		ID:               uuid.NewString(),
		FileName:         fileName,
		CandidateProfile: profile,
		CreatedAt:        time.Now().UTC(),
	}
	if err := service.repository.SaveResumeAnalysis(ctx, analysis); err != nil {
		return models.ResumeAnalysis{}, err
	}
	return analysis, nil
}

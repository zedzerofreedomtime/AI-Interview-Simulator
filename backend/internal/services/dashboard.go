package services

import (
	"context"

	"github.com/methasit/intervue-ai/backend/internal/models"
	"github.com/methasit/intervue-ai/backend/internal/repositories"
)

type DashboardService struct {
	repository repositories.DashboardRepository
}

func NewDashboardService(repository repositories.DashboardRepository) *DashboardService {
	return &DashboardService{repository: repository}
}

func (service *DashboardService) Get(ctx context.Context) (models.Dashboard, error) {
	return service.repository.GetDashboard(ctx)
}

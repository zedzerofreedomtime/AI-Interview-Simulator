package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"

	"github.com/methasit/intervue-ai/backend/internal/services"
)

type Handler struct {
	db               *pgxpool.Pool
	redis            *redis.Client
	dashboardService *services.DashboardService
	resumeService    *services.ResumeService
	interviewService *services.InterviewService
}

func New(
	db *pgxpool.Pool,
	redisClient *redis.Client,
	dashboardService *services.DashboardService,
	resumeService *services.ResumeService,
	interviewService *services.InterviewService,
) *Handler {
	return &Handler{
		db:               db,
		redis:            redisClient,
		dashboardService: dashboardService,
		resumeService:    resumeService,
		interviewService: interviewService,
	}
}

func (handler *Handler) Register(router *gin.Engine) {
	router.GET("/healthz", handler.health)
	router.GET("/readyz", handler.ready)

	api := router.Group("/api/v1")
	api.GET("/dashboard", handler.dashboard)
	api.POST("/resumes/analyze", handler.analyzeResume)
	api.POST("/interviews", handler.createInterview)
	api.GET("/interviews/:id", handler.getInterview)
	api.POST("/interviews/:id/answers", handler.evaluateAnswer)
}

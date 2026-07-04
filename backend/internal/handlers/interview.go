package handlers

import (
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/methasit/intervue-ai/backend/internal/repositories"
	"github.com/methasit/intervue-ai/backend/internal/services"
)

type createInterviewRequest struct {
	TargetRole string   `json:"targetRole" binding:"required"`
	Skills     []string `json:"skills"`
	Count      int      `json:"count"`
	Language   string   `json:"language"`
}

type evaluateAnswerRequest struct {
	QuestionID string `json:"questionId" binding:"required"`
	Answer     string `json:"answer" binding:"required"`
	Language   string `json:"language"`
}

func (handler *Handler) createInterview(ctx *gin.Context) {
	var request createInterviewRequest
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "targetRole is required"})
		return
	}
	session, err := handler.interviewService.Create(
		ctx.Request.Context(),
		request.TargetRole,
		request.Skills,
		request.Count,
		normalizeLanguage(request.Language),
	)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "interview generation failed"})
		return
	}
	ctx.JSON(http.StatusCreated, session)
}

func (handler *Handler) getInterview(ctx *gin.Context) {
	session, err := handler.interviewService.Get(ctx.Request.Context(), ctx.Param("id"))
	if errors.Is(err, repositories.ErrNotFound) {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "interview not found"})
		return
	}
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "unable to load interview"})
		return
	}
	ctx.JSON(http.StatusOK, session)
}

func (handler *Handler) evaluateAnswer(ctx *gin.Context) {
	var request evaluateAnswerRequest
	if err := ctx.ShouldBindJSON(&request); err != nil || strings.TrimSpace(request.Answer) == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "questionId and answer are required"})
		return
	}
	evaluation, err := handler.interviewService.Evaluate(
		ctx.Request.Context(),
		ctx.Param("id"),
		request.QuestionID,
		request.Answer,
		normalizeLanguage(request.Language),
	)
	if errors.Is(err, repositories.ErrNotFound) {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "interview not found"})
		return
	}
	if errors.Is(err, services.ErrQuestionNotFound) {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "interview question not found"})
		return
	}
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "answer evaluation failed"})
		return
	}
	ctx.JSON(http.StatusOK, evaluation)
}

func normalizeLanguage(language string) string {
	if strings.EqualFold(strings.TrimSpace(language), "th") {
		return "th"
	}
	return "en"
}

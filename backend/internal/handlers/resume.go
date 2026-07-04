package handlers

import (
	"context"
	"errors"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

const maxResumeBytes = 10 << 20

func (handler *Handler) analyzeResume(ctx *gin.Context) {
	fileHeader, err := ctx.FormFile("resume")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "resume file is required"})
		return
	}
	if fileHeader.Size > maxResumeBytes {
		ctx.JSON(http.StatusRequestEntityTooLarge, gin.H{"error": "resume must be 10 MB or smaller"})
		return
	}

	file, err := fileHeader.Open()
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "unable to read resume"})
		return
	}
	defer file.Close()

	content, err := io.ReadAll(io.LimitReader(file, maxResumeBytes))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "unable to read resume"})
		return
	}
	analysis, err := handler.resumeService.Analyze(
		ctx.Request.Context(),
		fileHeader.Filename,
		content,
		normalizeLanguage(ctx.PostForm("language")),
	)
	if err != nil {
		log.Printf("resume analysis failed: %v", err)
		if isTimeoutError(err) {
			ctx.JSON(http.StatusGatewayTimeout, gin.H{
				"error": "AI analysis timed out. Please try again, or upload a smaller/cleaner PDF.",
			})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "resume analysis failed"})
		return
	}
	ctx.JSON(http.StatusCreated, analysis)
}

func isTimeoutError(err error) bool {
	return errors.Is(err, context.DeadlineExceeded) ||
		strings.Contains(strings.ToLower(err.Error()), "timeout") ||
		strings.Contains(strings.ToLower(err.Error()), "deadline exceeded")
}

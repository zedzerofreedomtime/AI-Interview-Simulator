package handlers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func (handler *Handler) health(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func (handler *Handler) ready(ctx *gin.Context) {
	checkCtx, cancel := context.WithTimeout(ctx.Request.Context(), 2*time.Second)
	defer cancel()

	if err := handler.db.Ping(checkCtx); err != nil {
		ctx.JSON(http.StatusServiceUnavailable, gin.H{"status": "not_ready", "dependency": "postgres"})
		return
	}
	if err := handler.redis.Ping(checkCtx).Err(); err != nil {
		ctx.JSON(http.StatusServiceUnavailable, gin.H{"status": "not_ready", "dependency": "redis"})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"status": "ready"})
}

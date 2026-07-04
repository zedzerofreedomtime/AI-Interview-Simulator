package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (handler *Handler) dashboard(ctx *gin.Context) {
	dashboard, err := handler.dashboardService.Get(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "unable to load dashboard"})
		return
	}
	ctx.JSON(http.StatusOK, dashboard)
}

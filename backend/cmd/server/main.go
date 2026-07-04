package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/methasit/intervue-ai/backend/internal/ai"
	"github.com/methasit/intervue-ai/backend/internal/config"
	"github.com/methasit/intervue-ai/backend/internal/handlers"
	appmiddleware "github.com/methasit/intervue-ai/backend/internal/middleware"
	"github.com/methasit/intervue-ai/backend/internal/platform/cache"
	"github.com/methasit/intervue-ai/backend/internal/platform/database"
	"github.com/methasit/intervue-ai/backend/internal/repositories"
	"github.com/methasit/intervue-ai/backend/internal/services"
)

func main() {
	cfg := config.Load()
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	startupCtx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	db, err := database.Connect(startupCtx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("connect postgres: %v", err)
	}
	defer db.Close()

	redisClient, err := cache.Connect(startupCtx, cfg.RedisAddress, cfg.RedisPassword, cfg.RedisDB)
	if err != nil {
		log.Fatalf("connect redis: %v", err)
	}
	defer redisClient.Close()

	store := repositories.NewMemoryStore()
	var aiProvider ai.Provider = ai.NewMockProvider()
	if cfg.AIProvider == "gemini" {
		aiProvider = ai.NewGeminiProvider(cfg.GeminiAPIKey)
	}

	dashboardService := services.NewDashboardService(store)
	resumeService := services.NewResumeService(store, aiProvider)
	interviewService := services.NewInterviewService(store, aiProvider)

	handler := handlers.New(
		db,
		redisClient,
		dashboardService,
		resumeService,
		interviewService,
	)

	router := gin.New()
	router.Use(
		gin.Recovery(),
		appmiddleware.RequestID(),
		appmiddleware.CORS(cfg.AllowedOrigin),
	)
	handler.Register(router)

	server := &http.Server{
		Addr:              ":" + cfg.HTTPPort,
		Handler:           router,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       30 * time.Second,
		WriteTimeout:      180 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	go func() {
		log.Printf("Intervue API listening on %s", server.Addr)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("serve: %v", err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer shutdownCancel()
	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Printf("graceful shutdown failed: %v", err)
	}
}

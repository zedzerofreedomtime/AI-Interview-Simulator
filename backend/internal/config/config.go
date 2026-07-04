package config

import (
	"os"
	"strconv"
)

type Config struct {
	Environment   string
	HTTPPort      string
	DatabaseURL   string
	RedisAddress  string
	RedisPassword string
	RedisDB       int
	AllowedOrigin string
	AIProvider    string
	GeminiAPIKey  string
}

func Load() Config {
	return Config{
		Environment:   env("APP_ENV", "development"),
		HTTPPort:      env("HTTP_PORT", "8080"),
		DatabaseURL:   env("DATABASE_URL", "postgres://intervue:intervue@localhost:5432/intervue?sslmode=disable"),
		RedisAddress:  env("REDIS_ADDR", "localhost:6379"),
		RedisPassword: env("REDIS_PASSWORD", ""),
		RedisDB:       envInt("REDIS_DB", 0),
		AllowedOrigin: env("ALLOWED_ORIGIN", "http://localhost:3000"),
		AIProvider:    env("AI_PROVIDER", "mock"),
		GeminiAPIKey:  env("GEMINI_API_KEY", ""),
	}
}

func env(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func envInt(key string, fallback int) int {
	value, err := strconv.Atoi(os.Getenv(key))
	if err != nil {
		return fallback
	}
	return value
}

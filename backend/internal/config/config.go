package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port           string
	DBHost         string
	DBPort         string
	DBUser         string
	DBPassword     string
	DBName         string
	JWTSecret      string
	JWTExpiry      string
	RefreshSecret  string
	RefreshExpiry  string
	AllowedOrigins string
}

func Load() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	return &Config{
		Port:           getEnv("PORT", "8080"),
		DBHost:         getEnv("DB_HOST", "localhost"),
		DBPort:         getEnv("DB_PORT", "5432"),
		DBUser:         getEnv("DB_USER", "postgres"),
		DBPassword:     getEnv("DB_PASSWORD", "password"),
		DBName:         getEnv("DB_NAME", "kose"),
		JWTSecret:      getEnv("JWT_SECRET", "your-secret-key-change-in-production"),
		JWTExpiry:      getEnv("JWT_EXPIRY", "24h"),
		RefreshSecret:  getEnv("REFRESH_SECRET", "your-refresh-secret-key-change-in-production"),
		RefreshExpiry:  getEnv("REFRESH_TOKEN_EXPIRY", "7d"),
		AllowedOrigins: getEnv("ALLOWED_ORIGINS", "http://localhost:3000"),
	}
}

func (c *Config) GetDSN() string {
	return fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Jakarta",
		c.DBHost, c.DBUser, c.DBPassword, c.DBName, c.DBPort,
	)
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"kose-backend/internal/config"
	"kose-backend/internal/handlers"
	"kose-backend/internal/middleware"
	"kose-backend/internal/models"
	"kose-backend/internal/services"
)

func main() {
	cfg := config.Load()

	db, err := gorm.Open(postgres.Open(cfg.GetDSN()), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	if err := db.AutoMigrate(
		&models.User{},
		&models.Kos{},
		&models.Facility{},
		&models.KosImage{},
		&models.Review{},
		&models.Favorite{},
		&models.Location{},
	); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	log.Println("Database migration completed")

	userService := services.NewUserService(db)
	kosService := services.NewKosService(db)
	reviewService := services.NewReviewService(db)
	favoriteService := services.NewFavoriteService(db)
	facilityService := services.NewFacilityService(db)

	authHandler := handlers.NewAuthHandler(userService, cfg)
	kosHandler := handlers.NewKosHandler(kosService)
	reviewHandler := handlers.NewReviewHandler(reviewService, kosService)
	favoriteHandler := handlers.NewFavoriteHandler(favoriteService)
	adminHandler := handlers.NewAdminHandler(kosService, userService, facilityService)

	r := gin.Default()
	r.Use(middleware.CORSMiddleware(cfg))

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	api := r.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.POST("/refresh", authHandler.Refresh)
			auth.GET("/me", middleware.AuthMiddleware(cfg), authHandler.GetMe)
		}

		kos := api.Group("/kos")
		{
			kos.GET("", kosHandler.GetAll)
			kos.GET("/search", kosHandler.Search)
			kos.GET("/:id", kosHandler.GetByID)
			kos.GET("/:id/reviews", reviewHandler.GetByKosID)
		}

		reviews := api.Group("/reviews")
		{
			reviews.POST("/:id", middleware.AuthMiddleware(cfg), reviewHandler.Create)
			reviews.PUT("/:id", middleware.AuthMiddleware(cfg), reviewHandler.Update)
			reviews.DELETE("/:id", middleware.AuthMiddleware(cfg), reviewHandler.Delete)
		}

		favorites := api.Group("/favorites")
		favorites.Use(middleware.AuthMiddleware(cfg))
		{
			favorites.GET("", favoriteHandler.GetAll)
			favorites.POST("/:id", favoriteHandler.Add)
			favorites.DELETE("/:id", favoriteHandler.Remove)
		}

		admin := api.Group("/admin")
		admin.Use(middleware.AuthMiddleware(cfg), middleware.AdminMiddleware())
		{
			admin.POST("/kos", adminHandler.CreateKos)
			admin.PUT("/kos/:id", adminHandler.UpdateKos)
			admin.DELETE("/kos/:id", adminHandler.DeleteKos)
			admin.GET("/users", adminHandler.GetAllUsers)
			admin.PUT("/users/:id/role", adminHandler.UpdateUserRole)
			admin.GET("/facilities", adminHandler.GetAllFacilities)
			admin.POST("/facilities", adminHandler.CreateFacility)
			admin.DELETE("/facilities/:id", adminHandler.DeleteFacility)
		}
	}

	log.Printf("Server starting on port %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

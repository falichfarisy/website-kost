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
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"kose-backend/internal/config"
	"kose-backend/internal/handlers"
	"kose-backend/internal/middleware"
	"kose-backend/internal/repositories"
	"kose-backend/internal/services"
)

func main() {
	cfg := config.Load()

	db, err := gorm.Open(postgres.Open(cfg.GetDSN()), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("Failed to get database instance: %v", err)
	}
	if err := sqlDB.Ping(); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	log.Println("Database schema ready")

	userService := services.NewUserService(db)
	kosService := services.NewKosService(db)
	reviewService := services.NewReviewService(db)
	favoriteService := services.NewFavoriteService(db)
	facilityService := services.NewFacilityService(db)

	bookingRepo := repositories.NewBookingRepository(db)
	notificationRepo := repositories.NewNotificationRepository(db)
	bookingService := services.NewBookingService(bookingRepo, notificationRepo)
	notificationService := services.NewNotificationService(notificationRepo)

	authHandler := handlers.NewAuthHandler(userService, cfg)
	kosHandler := handlers.NewKosHandler(kosService)
	reviewHandler := handlers.NewReviewHandler(reviewService, kosService)
	favoriteHandler := handlers.NewFavoriteHandler(favoriteService)
	adminHandler := handlers.NewAdminHandler(kosService, userService, facilityService)
	bookingHandler := handlers.NewBookingHandler(bookingService)
	ownerBookingHandler := handlers.NewOwnerBookingHandler(bookingService)
	notificationHandler := handlers.NewNotificationHandler(notificationService)

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

		bookings := api.Group("/bookings")
		bookings.Use(middleware.AuthMiddleware(cfg))
		{
			bookings.POST("", bookingHandler.Create)
			bookings.GET("", bookingHandler.GetAll)
			bookings.GET("/:id", bookingHandler.GetByID)
			bookings.PUT("/:id/cancel", bookingHandler.Cancel)
		}

		owner := api.Group("/owner")
		owner.Use(middleware.AuthMiddleware(cfg), middleware.OwnerOrAdminMiddleware())
		{
			owner.GET("/bookings", ownerBookingHandler.GetAll)
			owner.GET("/bookings/pending", ownerBookingHandler.GetPending)
			owner.GET("/bookings/:id", ownerBookingHandler.GetByID)
			owner.PUT("/bookings/:id/approve", ownerBookingHandler.Approve)
			owner.PUT("/bookings/:id/reject", ownerBookingHandler.Reject)
		}

		notifications := api.Group("/notifications")
		notifications.Use(middleware.AuthMiddleware(cfg))
		{
			notifications.GET("", notificationHandler.GetAll)
			notifications.GET("/unread/count", notificationHandler.GetUnreadCount)
			notifications.PUT("/:id/read", notificationHandler.MarkAsRead)
			notifications.PUT("/read-all", notificationHandler.MarkAllAsRead)
			notifications.DELETE("/:id", notificationHandler.Delete)
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

	// Initialize and start cron service
	cronService := services.NewCronService(bookingRepo)
	cronService.Start()

	srv := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: r,
	}

	go func() {
		log.Printf("Server starting on port %s", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	cronService.Stop()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exiting")
}

package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"kose-backend/internal/models"
	"kose-backend/internal/services"
)

type ReviewHandler struct {
	reviewService *services.ReviewService
	kosService    *services.KosService
}

func NewReviewHandler(reviewService *services.ReviewService, kosService *services.KosService) *ReviewHandler {
	return &ReviewHandler{
		reviewService: reviewService,
		kosService:    kosService,
	}
}

func (h *ReviewHandler) GetByKosID(c *gin.Context) {
	kosID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid kos ID"})
		return
	}

	reviews, err := h.reviewService.GetReviewsByKosID(uint(kosID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch reviews"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reviews})
}

func (h *ReviewHandler) Create(c *gin.Context) {
	userID, _ := c.Get("user_id")
	kosID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid kos ID"})
		return
	}

	var req struct {
		Rating  int    `json:"rating" binding:"required,min=1,max=5"`
		Comment string `json:"comment"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	review := &models.Review{
		KosID:   uint(kosID),
		UserID:  userID.(uint),
		Rating:  req.Rating,
		Comment: req.Comment,
	}

	if err := h.reviewService.CreateReview(review); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create review"})
		return
	}

	if err := h.kosService.UpdateRating(uint(kosID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update kos rating"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Review created", "data": review})
}

func (h *ReviewHandler) Update(c *gin.Context) {
	userID, _ := c.Get("user_id")
	reviewID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid review ID"})
		return
	}

	existingReview, err := h.reviewService.GetReviewByID(uint(reviewID))
	if err != nil || existingReview.UserID != userID.(uint) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Cannot update this review"})
		return
	}

	var req struct {
		Rating  int    `json:"rating" binding:"required,min=1,max=5"`
		Comment string `json:"comment"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	existingReview.Rating = req.Rating
	existingReview.Comment = req.Comment

	if err := h.reviewService.UpdateReview(existingReview); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update review"})
		return
	}

	if err := h.kosService.UpdateRating(existingReview.KosID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update kos rating"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Review updated", "data": existingReview})
}

func (h *ReviewHandler) Delete(c *gin.Context) {
	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")
	reviewID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid review ID"})
		return
	}

	existingReview, err := h.reviewService.GetReviewByID(uint(reviewID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Review not found"})
		return
	}

	if existingReview.UserID != userID.(uint) && role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Cannot delete this review"})
		return
	}

	kosID := existingReview.KosID

	if err := h.reviewService.DeleteReview(uint(reviewID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete review"})
		return
	}

	if err := h.kosService.UpdateRating(kosID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update kos rating"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Review deleted"})
}

package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"kose-backend/internal/models"
	"kose-backend/internal/services"
)

type FavoriteHandler struct {
	favoriteService *services.FavoriteService
}

func NewFavoriteHandler(favoriteService *services.FavoriteService) *FavoriteHandler {
	return &FavoriteHandler{
		favoriteService: favoriteService,
	}
}

func (h *FavoriteHandler) GetAll(c *gin.Context) {
	userID, _ := c.Get("user_id")

	favorites, err := h.favoriteService.GetFavoritesByUserID(userID.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch favorites"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": favorites})
}

func (h *FavoriteHandler) Add(c *gin.Context) {
	userID, _ := c.Get("user_id")
	kosID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid kos ID"})
		return
	}

	favorite := &models.Favorite{
		UserID: userID.(uint),
		KosID:  uint(kosID),
	}

	if err := h.favoriteService.AddFavorite(favorite); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add favorite"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Added to favorites"})
}

func (h *FavoriteHandler) Remove(c *gin.Context) {
	userID, _ := c.Get("user_id")
	kosID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid kos ID"})
		return
	}

	if err := h.favoriteService.RemoveFavorite(userID.(uint), uint(kosID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove favorite"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Removed from favorites"})
}

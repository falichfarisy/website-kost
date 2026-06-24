package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"kose-backend/internal/models"
	"kose-backend/internal/services"
)

type KosHandler struct {
	kosService *services.KosService
}

func NewKosHandler(kosService *services.KosService) *KosHandler {
	return &KosHandler{
		kosService: kosService,
	}
}

func (h *KosHandler) GetAll(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "12"))
	minPrice, _ := strconv.Atoi(c.Query("min_price"))
	maxPrice, _ := strconv.Atoi(c.Query("max_price"))
	kosType := c.Query("type")
	facility := c.Query("facility")
	minRating, _ := strconv.ParseFloat(c.Query("min_rating"), 64)
	search := c.Query("search")

	filters := models.KosFilters{
		MinPrice:  minPrice,
		MaxPrice:  maxPrice,
		KosType:   kosType,
		Facility:  facility,
		MinRating: minRating,
		Search:    search,
		Page:      page,
		Limit:     limit,
	}

	kosList, total, err := h.kosService.GetAllKos(filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch kos"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": kosList,
		"meta": gin.H{
			"page":       page,
			"limit":      limit,
			"total":      total,
			"totalPages": (int(total) + limit - 1) / limit,
		},
	})
}

func (h *KosHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid kos ID"})
		return
	}

	kos, err := h.kosService.GetKosByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kos not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": kos})
}

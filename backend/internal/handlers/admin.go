package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"kose-backend/internal/models"
	"kose-backend/internal/services"
)

type AdminHandler struct {
	kosService      *services.KosService
	userService     *services.UserService
	facilityService *services.FacilityService
}

func NewAdminHandler(kosService *services.KosService, userService *services.UserService, facilityService *services.FacilityService) *AdminHandler {
	return &AdminHandler{
		kosService:      kosService,
		userService:     userService,
		facilityService: facilityService,
	}
}

func (h *AdminHandler) CreateKos(c *gin.Context) {
	var req struct {
		Name           string  `json:"name" binding:"required"`
		Description    string  `json:"description"`
		Address        string  `json:"address" binding:"required"`
		Latitude       float64 `json:"latitude"`
		Longitude      float64 `json:"longitude"`
		KosType        string  `json:"kos_type" binding:"required"`
		Price          int     `json:"price" binding:"required"`
		PriceType      string  `json:"price_type"`
		Area           float64 `json:"area"`
		Capacity       int     `json:"capacity"`
		AvailableRooms int     `json:"available_rooms"`
		FacilityIDs    []uint  `json:"facility_ids"`
		LocationID     *uint   `json:"location_id"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("user_id")
	kos := &models.Kos{
		Name:           req.Name,
		Description:    req.Description,
		Address:        req.Address,
		Latitude:       req.Latitude,
		Longitude:      req.Longitude,
		KosType:        models.KosType(req.KosType),
		Price:          req.Price,
		PriceType:      req.PriceType,
		Area:           req.Area,
		Capacity:       req.Capacity,
		AvailableRooms: req.AvailableRooms,
		Source:         models.SourceManual,
		CreatedBy:      func() *uint { u := userID.(uint); return &u }(),
		LocationID:     req.LocationID,
	}

	if err := h.kosService.CreateKos(kos); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create kos"})
		return
	}

	if len(req.FacilityIDs) > 0 {
		h.kosService.SetFacilities(kos.ID, req.FacilityIDs)
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Kos created", "data": kos})
}

func (h *AdminHandler) UpdateKos(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid kos ID"})
		return
	}

	existingKos, err := h.kosService.GetKosByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kos not found"})
		return
	}

	var req struct {
		Name           string  `json:"name"`
		Description    string  `json:"description"`
		Address        string  `json:"address"`
		Latitude       float64 `json:"latitude"`
		Longitude      float64 `json:"longitude"`
		KosType        string  `json:"kos_type"`
		Price          int     `json:"price"`
		PriceType      string  `json:"price_type"`
		Area           float64 `json:"area"`
		Capacity       int     `json:"capacity"`
		AvailableRooms int     `json:"available_rooms"`
		FacilityIDs    []uint  `json:"facility_ids"`
		LocationID     *uint   `json:"location_id"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.Name != "" {
		existingKos.Name = req.Name
	}
	if req.Description != "" {
		existingKos.Description = req.Description
	}
	if req.Address != "" {
		existingKos.Address = req.Address
	}
	if req.KosType != "" {
		existingKos.KosType = models.KosType(req.KosType)
	}
	if req.Price > 0 {
		existingKos.Price = req.Price
	}
	if req.PriceType != "" {
		existingKos.PriceType = req.PriceType
	}
	if req.AvailableRooms > 0 {
		existingKos.AvailableRooms = req.AvailableRooms
	}

	if req.FacilityIDs != nil {
		h.kosService.SetFacilities(existingKos.ID, req.FacilityIDs)
	}

	if err := h.kosService.UpdateKos(existingKos); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update kos"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Kos updated", "data": existingKos})
}

func (h *AdminHandler) DeleteKos(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid kos ID"})
		return
	}

	if err := h.kosService.DeleteKos(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete kos"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Kos deleted"})
}

func (h *AdminHandler) GetAllUsers(c *gin.Context) {
	users, err := h.userService.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": users})
}

func (h *AdminHandler) UpdateUserRole(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var req struct {
		Role string `json:"role" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.userService.UpdateUserRole(uint(id), models.UserRole(req.Role)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user role"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User role updated"})
}

func (h *AdminHandler) CreateFacility(c *gin.Context) {
	var req struct {
		Name string `json:"name" binding:"required"`
		Icon string `json:"icon"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	facility := &models.Facility{
		Name: req.Name,
		Icon: req.Icon,
	}

	if err := h.facilityService.CreateFacility(facility); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create facility"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Facility created", "data": facility})
}

func (h *AdminHandler) GetAllFacilities(c *gin.Context) {
	facilities, err := h.facilityService.GetAllFacilities()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch facilities"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": facilities})
}

func (h *AdminHandler) DeleteFacility(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid facility ID"})
		return
	}

	if err := h.facilityService.DeleteFacility(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete facility"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Facility deleted"})
}

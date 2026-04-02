package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"kose-backend/internal/models"
	"kose-backend/internal/services"
)

type BookingHandler struct {
	bookingService *services.BookingService
}

func NewBookingHandler(bookingService *services.BookingService) *BookingHandler {
	return &BookingHandler{
		bookingService: bookingService,
	}
}

func (h *BookingHandler) Create(c *gin.Context) {
	var req models.CreateBookingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("user_id")

	booking, err := h.bookingService.CreateBooking(userID.(uint), &req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Booking request created successfully",
		"data":    h.toBookingResponse(booking),
	})
}

func (h *BookingHandler) GetAll(c *gin.Context) {
	userID, _ := c.Get("user_id")

	filters := models.BookingFilters{
		Status: c.Query("status"),
		Page:   getPageParam(c, "page", 1),
		Limit:  getPageParam(c, "limit", 10),
	}

	bookings, total, err := h.bookingService.GetUserBookings(userID.(uint), filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bookings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": h.toBookingsResponse(bookings),
		"meta": models.PaginationMeta{
			Page:       filters.Page,
			Limit:      filters.Limit,
			Total:      int(total),
			TotalPages: int((int(total) + filters.Limit - 1) / filters.Limit),
		},
	})
}

func (h *BookingHandler) GetByID(c *gin.Context) {
	userID, _ := c.Get("user_id")

	bookingID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}

	booking, err := h.bookingService.GetUserBooking(uint(bookingID), userID.(uint))
	if err != nil {
		if err == services.ErrBookingNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch booking"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": h.toBookingResponse(booking)})
}

func (h *BookingHandler) Cancel(c *gin.Context) {
	userID, _ := c.Get("user_id")

	bookingID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}

	var req models.CancelBookingRequest
	c.ShouldBindJSON(&req)

	err = h.bookingService.CancelBooking(uint(bookingID), userID.(uint), req.Reason)
	if err != nil {
		if err == services.ErrBookingNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
			return
		}
		if err == services.ErrInvalidStatus {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Only pending bookings can be cancelled"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to cancel booking"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Booking cancelled successfully"})
}

func (h *BookingHandler) toBookingResponse(booking *models.Booking) models.BookingResponse {
	response := models.BookingResponse{
		ID:              booking.ID,
		KosID:           booking.KosID,
		TenantName:      booking.TenantName,
		TenantEmail:     booking.TenantEmail,
		TenantPhone:     booking.TenantPhone,
		TenantNotes:     booking.TenantNotes,
		CheckInDate:     booking.CheckInDate.Format("2006-01-02"),
		DurationMonths:  booking.DurationMonths,
		Status:          booking.Status,
		RejectionReason: booking.RejectionReason,
		MonthlyPrice:    booking.MonthlyPrice,
		TotalPrice:      booking.TotalPrice,
		DepositAmount:   booking.DepositAmount,
		PaymentStatus:   booking.PaymentStatus,
		ExpiresAt:       booking.ExpiresAt.Format(time.RFC3339),
		CreatedAt:       booking.CreatedAt.Format(time.RFC3339),
	}

	if booking.Kos != nil {
		response.Kos = &models.KosResponse{
			ID:             booking.Kos.ID,
			Name:           booking.Kos.Name,
			Address:        booking.Kos.Address,
			Price:          booking.Kos.Price,
			AvailableRooms: booking.Kos.AvailableRooms,
		}

		for _, img := range booking.Kos.Images {
			if img.IsPrimary || len(response.Kos.Images) == 0 {
				response.Kos.Images = append(response.Kos.Images, img.URL)
			}
		}
	}

	return response
}

func (h *BookingHandler) toBookingsResponse(bookings []models.Booking) []models.BookingResponse {
	responses := make([]models.BookingResponse, len(bookings))
	for i, booking := range bookings {
		responses[i] = h.toBookingResponse(&booking)
	}
	return responses
}

func getPageParam(c *gin.Context, key string, defaultVal int) int {
	val := c.Query(key)
	if val == "" {
		return defaultVal
	}
	parsed, err := strconv.Atoi(val)
	if err != nil || parsed < 1 {
		return defaultVal
	}
	return parsed
}

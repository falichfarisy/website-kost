package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"kose-backend/internal/models"
	"kose-backend/internal/services"
)

type OwnerBookingHandler struct {
	bookingService *services.BookingService
}

func NewOwnerBookingHandler(bookingService *services.BookingService) *OwnerBookingHandler {
	return &OwnerBookingHandler{
		bookingService: bookingService,
	}
}

func (h *OwnerBookingHandler) GetAll(c *gin.Context) {
	ownerID, _ := c.Get("user_id")

	status := c.Query("status")
	page := getPageParam(c, "page", 1)
	limit := getPageParam(c, "limit", 10)

	bookings, total, err := h.bookingService.GetOwnerBookings(ownerID.(uint), status, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bookings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": h.toBookingsResponse(bookings),
		"meta": models.PaginationMeta{
			Page:       page,
			Limit:      limit,
			Total:      int(total),
			TotalPages: int((int(total) + limit - 1) / limit),
		},
	})
}

func (h *OwnerBookingHandler) GetPending(c *gin.Context) {
	ownerID, _ := c.Get("user_id")

	page := getPageParam(c, "page", 1)
	limit := getPageParam(c, "limit", 10)

	bookings, total, err := h.bookingService.GetPendingBookings(ownerID.(uint), page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch pending bookings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": h.toBookingsResponse(bookings),
		"meta": models.PaginationMeta{
			Page:       page,
			Limit:      limit,
			Total:      int(total),
			TotalPages: int((int(total) + limit - 1) / limit),
		},
	})
}

func (h *OwnerBookingHandler) GetByID(c *gin.Context) {
	ownerID, _ := c.Get("user_id")

	bookingID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}

	booking, err := h.bookingService.GetOwnerBooking(uint(bookingID), ownerID.(uint))
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

func (h *OwnerBookingHandler) Approve(c *gin.Context) {
	ownerID, _ := c.Get("user_id")

	bookingID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}

	err = h.bookingService.ApproveBooking(uint(bookingID), ownerID.(uint))
	if err != nil {
		if err == services.ErrBookingNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
			return
		}
		if err == services.ErrInvalidStatus {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Only pending bookings can be approved"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to approve booking"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Booking approved successfully"})
}

func (h *OwnerBookingHandler) Reject(c *gin.Context) {
	ownerID, _ := c.Get("user_id")

	bookingID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}

	var req models.RejectBookingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Rejection reason is required"})
		return
	}

	err = h.bookingService.RejectBooking(uint(bookingID), ownerID.(uint), req.Reason)
	if err != nil {
		if err == services.ErrBookingNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
			return
		}
		if err == services.ErrInvalidStatus {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Only pending bookings can be rejected"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reject booking"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Booking rejected"})
}

func (h *OwnerBookingHandler) toBookingResponse(booking *models.Booking) models.BookingResponse {
	return toBookingResponsePublic(booking)
}

func (h *OwnerBookingHandler) toBookingsResponse(bookings []models.Booking) []models.BookingResponse {
	responses := make([]models.BookingResponse, len(bookings))
	for i, booking := range bookings {
		responses[i] = h.toBookingResponse(&booking)
	}
	return responses
}

func toBookingResponsePublic(booking *models.Booking) models.BookingResponse {
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
		ExpiresAt:       booking.ExpiresAt.Format("2006-01-02T15:04:05Z"),
		CreatedAt:       booking.CreatedAt.Format("2006-01-02T15:04:05Z"),
	}

	if booking.Kos != nil {
		response.Kos = &models.KosResponse{
			ID:             booking.Kos.ID,
			Name:           booking.Kos.Name,
			Address:        booking.Kos.Address,
			Price:          booking.Kos.Price,
			AvailableRooms: booking.Kos.AvailableRooms,
		}
	}

	return response
}

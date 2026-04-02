package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"kose-backend/internal/models"
	"kose-backend/internal/services"
)

type NotificationHandler struct {
	notificationService *services.NotificationService
}

func NewNotificationHandler(notificationService *services.NotificationService) *NotificationHandler {
	return &NotificationHandler{
		notificationService: notificationService,
	}
}

func (h *NotificationHandler) GetAll(c *gin.Context) {
	userID, _ := c.Get("user_id")

	page := getPageParam(c, "page", 1)
	limit := getPageParam(c, "limit", 20)

	notifications, total, err := h.notificationService.GetUserNotifications(userID.(uint), page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch notifications"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": notifications,
		"meta": models.PaginationMeta{
			Page:       page,
			Limit:      limit,
			Total:      int(total),
			TotalPages: int((int(total) + limit - 1) / limit),
		},
	})
}

func (h *NotificationHandler) GetUnreadCount(c *gin.Context) {
	userID, _ := c.Get("user_id")

	count, err := h.notificationService.GetUnreadCount(userID.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get unread count"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"count": count})
}

func (h *NotificationHandler) MarkAsRead(c *gin.Context) {
	userID, _ := c.Get("user_id")

	notificationID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid notification ID"})
		return
	}

	err = h.notificationService.MarkAsRead(uint(notificationID), userID.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to mark as read"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Notification marked as read"})
}

func (h *NotificationHandler) MarkAllAsRead(c *gin.Context) {
	userID, _ := c.Get("user_id")

	err := h.notificationService.MarkAllAsRead(userID.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to mark all as read"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "All notifications marked as read"})
}

func (h *NotificationHandler) Delete(c *gin.Context) {
	userID, _ := c.Get("user_id")

	notificationID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid notification ID"})
		return
	}

	err = h.notificationService.DeleteNotification(uint(notificationID), userID.(uint))
	if err != nil {
		if err == services.ErrUnauthorized {
			c.JSON(http.StatusForbidden, gin.H{"error": "Cannot delete this notification"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete notification"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Notification deleted"})
}

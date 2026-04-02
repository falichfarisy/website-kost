package services

import (
	"kose-backend/internal/models"
	"kose-backend/internal/repositories"
)

type NotificationService struct {
	notificationRepo *repositories.NotificationRepository
}

func NewNotificationService(notificationRepo *repositories.NotificationRepository) *NotificationService {
	return &NotificationService{
		notificationRepo: notificationRepo,
	}
}

func (s *NotificationService) GetUserNotifications(userID uint, page, limit int) ([]models.Notification, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 20
	}

	return s.notificationRepo.GetByUserID(userID, page, limit)
}

func (s *NotificationService) GetUnreadCount(userID uint) (int64, error) {
	return s.notificationRepo.GetUnreadCount(userID)
}

func (s *NotificationService) MarkAsRead(notificationID, userID uint) error {
	notification, err := s.notificationRepo.GetByID(notificationID)
	if err != nil {
		return err
	}

	if notification.UserID != userID {
		return ErrUnauthorized
	}

	return s.notificationRepo.MarkAsRead(notificationID)
}

func (s *NotificationService) MarkAllAsRead(userID uint) error {
	return s.notificationRepo.MarkAllAsRead(userID)
}

func (s *NotificationService) DeleteNotification(notificationID, userID uint) error {
	notification, err := s.notificationRepo.GetByID(notificationID)
	if err != nil {
		return err
	}

	if notification.UserID != userID {
		return ErrUnauthorized
	}

	return s.notificationRepo.Delete(notificationID)
}

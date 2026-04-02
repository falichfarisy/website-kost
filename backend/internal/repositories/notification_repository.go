package repositories

import (
	"gorm.io/gorm"
	"kose-backend/internal/models"
)

type NotificationRepository struct {
	db *gorm.DB
}

func NewNotificationRepository(db *gorm.DB) *NotificationRepository {
	return &NotificationRepository{db: db}
}

func (r *NotificationRepository) Create(notification *models.Notification) error {
	return r.db.Create(notification).Error
}

func (r *NotificationRepository) GetByID(id uint) (*models.Notification, error) {
	var notification models.Notification
	err := r.db.Preload("Kos").Preload("Booking").First(&notification, id).Error
	if err != nil {
		return nil, err
	}
	return &notification, nil
}

func (r *NotificationRepository) GetByUserID(userID uint, page, limit int) ([]models.Notification, int64, error) {
	var notifications []models.Notification
	var total int64

	r.db.Model(&models.Notification{}).Where("user_id = ?", userID).Count(&total)

	offset := (page - 1) * limit
	err := r.db.Preload("Kos").Preload("Booking").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Offset(offset).Limit(limit).
		Find(&notifications).Error

	return notifications, total, err
}

func (r *NotificationRepository) GetUnreadCount(userID uint) (int64, error) {
	var count int64
	err := r.db.Model(&models.Notification{}).
		Where("user_id = ? AND is_read = ?", userID, false).
		Count(&count).Error
	return count, err
}

func (r *NotificationRepository) MarkAsRead(id uint) error {
	return r.db.Model(&models.Notification{}).
		Where("id = ?", id).
		Update("is_read", true).Error
}

func (r *NotificationRepository) MarkAllAsRead(userID uint) error {
	return r.db.Model(&models.Notification{}).
		Where("user_id = ? AND is_read = ?", userID, false).
		Update("is_read", true).Error
}

func (r *NotificationRepository) Delete(id uint) error {
	return r.db.Delete(&models.Notification{}, id).Error
}

func (r *NotificationRepository) DeleteByUserID(userID uint) error {
	return r.db.Where("user_id = ?", userID).Delete(&models.Notification{}).Error
}

func (r *NotificationRepository) MarkEmailSent(id uint) error {
	return r.db.Model(&models.Notification{}).
		Where("id = ?", id).
		Update("email_sent", true).Error
}

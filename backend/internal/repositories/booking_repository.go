package repositories

import (
	"time"

	"gorm.io/gorm"
	"kose-backend/internal/models"
)

type BookingRepository struct {
	db *gorm.DB
}

func NewBookingRepository(db *gorm.DB) *BookingRepository {
	return &BookingRepository{db: db}
}

func (r *BookingRepository) Create(booking *models.Booking) error {
	return r.db.Create(booking).Error
}

func (r *BookingRepository) GetByID(id uint) (*models.Booking, error) {
	var booking models.Booking
	err := r.db.Preload("Kos").Preload("User").Preload("Owner").First(&booking, id).Error
	if err != nil {
		return nil, err
	}
	return &booking, nil
}

func (r *BookingRepository) GetByIDForUser(id uint, userID uint) (*models.Booking, error) {
	var booking models.Booking
	err := r.db.Preload("Kos").Preload("Kos.Images").
		Where("id = ? AND user_id = ?", id, userID).
		First(&booking).Error
	if err != nil {
		return nil, err
	}
	return &booking, nil
}

func (r *BookingRepository) GetByUserID(userID uint, filters models.BookingFilters) ([]models.Booking, int64, error) {
	var bookings []models.Booking
	var total int64

	query := r.db.Model(&models.Booking{}).Where("user_id = ?", userID)

	if filters.Status != "" {
		query = query.Where("status = ?", filters.Status)
	}

	query.Count(&total)

	offset := (filters.Page - 1) * filters.Limit
	err := query.Preload("Kos").Preload("Kos.Images").
		Order("created_at DESC").
		Offset(offset).Limit(filters.Limit).
		Find(&bookings).Error

	return bookings, total, err
}

func (r *BookingRepository) GetPendingByOwnerID(ownerID uint, page, limit int) ([]models.Booking, int64, error) {
	var bookings []models.Booking
	var total int64

	query := r.db.Model(&models.Booking{}).
		Joins("JOIN kos ON kos.id = bookings.kos_id").
		Where("kos.owner_id = ? AND bookings.status = ?", ownerID, models.BookingStatusPending)

	query.Count(&total)

	offset := (page - 1) * limit
	err := query.Preload("Kos").Preload("Kos.Images").Preload("User").
		Order("bookings.created_at DESC").
		Offset(offset).Limit(limit).
		Find(&bookings).Error

	return bookings, total, err
}

func (r *BookingRepository) GetByOwnerID(ownerID uint, status string, page, limit int) ([]models.Booking, int64, error) {
	var bookings []models.Booking
	var total int64

	query := r.db.Model(&models.Booking{}).
		Joins("JOIN kos ON kos.id = bookings.kos_id").
		Where("kos.owner_id = ?", ownerID)

	if status != "" {
		query = query.Where("bookings.status = ?", status)
	}

	query.Count(&total)

	offset := (page - 1) * limit
	err := query.Preload("Kos").Preload("Kos.Images").Preload("User").
		Order("bookings.created_at DESC").
		Offset(offset).Limit(limit).
		Find(&bookings).Error

	return bookings, total, err
}

func (r *BookingRepository) GetByIDAndOwnerID(bookingID, ownerID uint) (*models.Booking, error) {
	var booking models.Booking
	err := r.db.Preload("Kos").Preload("User").
		Joins("JOIN kos ON kos.id = bookings.kos_id").
		Where("bookings.id = ? AND kos.owner_id = ?", bookingID, ownerID).
		First(&booking).Error
	if err != nil {
		return nil, err
	}
	return &booking, nil
}

func (r *BookingRepository) Update(booking *models.Booking) error {
	return r.db.Save(booking).Error
}

func (r *BookingRepository) UpdateStatus(id uint, status models.BookingStatus) error {
	return r.db.Model(&models.Booking{}).Where("id = ?", id).Update("status", status).Error
}

func (r *BookingRepository) Approve(id uint, approvedBy uint) error {
	now := time.Now()
	return r.db.Model(&models.Booking{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"status":      models.BookingStatusApproved,
			"approved_by": approvedBy,
			"approved_at": now,
		}).Error
}

func (r *BookingRepository) Reject(id uint, reason string) error {
	return r.db.Model(&models.Booking{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"status":           models.BookingStatusRejected,
			"rejection_reason": reason,
		}).Error
}

func (r *BookingRepository) Cancel(id uint, reason string) error {
	now := time.Now()
	return r.db.Model(&models.Booking{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"status":              models.BookingStatusCancelled,
			"cancelled_at":        now,
			"cancellation_reason": reason,
		}).Error
}

func (r *BookingRepository) ExpirePendingBookings() (int64, error) {
	result := r.db.Model(&models.Booking{}).
		Where("status = ? AND expires_at < ?", models.BookingStatusPending, time.Now()).
		Update("status", models.BookingStatusExpired)
	return result.RowsAffected, result.Error
}

func (r *BookingRepository) DecrementAvailableRooms(kosID uint) error {
	return r.db.Model(&models.Kos{}).
		Where("id = ? AND available_rooms > 0", kosID).
		Update("available_rooms", gorm.Expr("available_rooms - 1")).Error
}

func (r *BookingRepository) IncrementAvailableRooms(kosID uint) error {
	return r.db.Model(&models.Kos{}).
		Where("id = ?", kosID).
		Update("available_rooms", gorm.Expr("available_rooms + 1")).Error
}

func (r *BookingRepository) CreateHistory(history *models.BookingHistory) error {
	return r.db.Create(history).Error
}

func (r *BookingRepository) GetExpiredBookingsForNotification() ([]models.Booking, error) {
	var bookings []models.Booking
	err := r.db.Preload("Kos").Preload("User").
		Where("status = ? AND expires_at < ? AND expires_at > ?",
			models.BookingStatusPending,
			time.Now(),
			time.Now().Add(-24*time.Hour)).
		Find(&bookings).Error
	return bookings, err
}

func (r *BookingRepository) GetUpcomingCheckIns() ([]models.Booking, error) {
	var bookings []models.Booking
	tomorrow := time.Now().Add(24 * time.Hour)
	startOfTomorrow := time.Date(tomorrow.Year(), tomorrow.Month(), tomorrow.Day(), 0, 0, 0, 0, tomorrow.Location())
	endOfTomorrow := startOfTomorrow.Add(24 * time.Hour)

	err := r.db.Preload("Kos").Preload("User").
		Where("status = ? AND check_in_date >= ? AND check_in_date < ?",
			models.BookingStatusApproved,
			startOfTomorrow,
			endOfTomorrow).
		Find(&bookings).Error
	return bookings, err
}

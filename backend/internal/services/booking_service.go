package services

import (
	"errors"
	"time"

	"kose-backend/internal/models"
	"kose-backend/internal/repositories"
)

var (
	ErrBookingNotFound  = errors.New("booking not found")
	ErrUnauthorized     = errors.New("unauthorized")
	ErrInvalidStatus    = errors.New("invalid booking status")
	ErrNoRoomsAvailable = errors.New("no rooms available")
	ErrKosNotFound      = errors.New("kos not found")
)

type BookingService struct {
	bookingRepo      *repositories.BookingRepository
	notificationRepo *repositories.NotificationRepository
}

func NewBookingService(bookingRepo *repositories.BookingRepository, notificationRepo *repositories.NotificationRepository) *BookingService {
	return &BookingService{
		bookingRepo:      bookingRepo,
		notificationRepo: notificationRepo,
	}
}

func (s *BookingService) CreateBooking(userID uint, req *models.CreateBookingRequest) (*models.Booking, error) {
	checkInDate, err := time.Parse("2006-01-02", req.CheckInDate)
	if err != nil {
		return nil, errors.New("invalid check-in date format")
	}

	if checkInDate.Before(time.Now().Truncate(24 * time.Hour)) {
		return nil, errors.New("check-in date cannot be in the past")
	}

	expiresAt := time.Now().Add(7 * 24 * time.Hour)
	totalPrice := req.DurationMonths * req.MonthlyPrice

	booking := &models.Booking{
		KosID:          req.KosID,
		UserID:         &userID,
		TenantName:     req.TenantName,
		TenantEmail:    req.TenantEmail,
		TenantPhone:    req.TenantPhone,
		TenantNotes:    req.TenantNotes,
		CheckInDate:    checkInDate,
		DurationMonths: req.DurationMonths,
		Status:         models.BookingStatusPending,
		MonthlyPrice:   req.MonthlyPrice,
		TotalPrice:     totalPrice,
		ExpiresAt:      expiresAt,
	}

	if err := s.bookingRepo.Create(booking); err != nil {
		return nil, err
	}

	s.createBookingRequestNotification(booking)

	s.createHistory(booking.ID, userID, "created", "", string(models.BookingStatusPending), "Booking request created")

	return booking, nil
}

func (s *BookingService) GetUserBookings(userID uint, filters models.BookingFilters) ([]models.Booking, int64, error) {
	if filters.Page < 1 {
		filters.Page = 1
	}
	if filters.Limit < 1 {
		filters.Limit = 10
	}

	return s.bookingRepo.GetByUserID(userID, filters)
}

func (s *BookingService) GetUserBooking(bookingID, userID uint) (*models.Booking, error) {
	booking, err := s.bookingRepo.GetByIDForUser(bookingID, userID)
	if err != nil {
		return nil, ErrBookingNotFound
	}
	return booking, nil
}

func (s *BookingService) CancelBooking(bookingID, userID uint, reason string) error {
	booking, err := s.bookingRepo.GetByIDForUser(bookingID, userID)
	if err != nil {
		return ErrBookingNotFound
	}

	if booking.Status != models.BookingStatusPending {
		return ErrInvalidStatus
	}

	if err := s.bookingRepo.Cancel(bookingID, reason); err != nil {
		return err
	}

	s.createBookingCancelledNotification(booking)
	s.createHistory(bookingID, userID, "cancelled", string(booking.Status), string(models.BookingStatusCancelled), reason)

	return nil
}

func (s *BookingService) GetOwnerBookings(ownerID uint, status string, page, limit int) ([]models.Booking, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}

	return s.bookingRepo.GetByOwnerID(ownerID, status, page, limit)
}

func (s *BookingService) GetPendingBookings(ownerID uint, page, limit int) ([]models.Booking, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}

	return s.bookingRepo.GetPendingByOwnerID(ownerID, page, limit)
}

func (s *BookingService) GetOwnerBooking(bookingID, ownerID uint) (*models.Booking, error) {
	booking, err := s.bookingRepo.GetByIDAndOwnerID(bookingID, ownerID)
	if err != nil {
		return nil, ErrBookingNotFound
	}
	return booking, nil
}

func (s *BookingService) ApproveBooking(bookingID, ownerID uint) error {
	booking, err := s.bookingRepo.GetByIDAndOwnerID(bookingID, ownerID)
	if err != nil {
		return ErrBookingNotFound
	}

	if booking.Status != models.BookingStatusPending {
		return ErrInvalidStatus
	}

	if err := s.bookingRepo.Approve(bookingID, ownerID); err != nil {
		return err
	}

	if err := s.bookingRepo.DecrementAvailableRooms(booking.KosID); err != nil {
	}

	s.createBookingApprovedNotification(booking)
	s.createHistory(bookingID, ownerID, "approved", string(booking.Status), string(models.BookingStatusApproved), "")

	return nil
}

func (s *BookingService) RejectBooking(bookingID, ownerID uint, reason string) error {
	booking, err := s.bookingRepo.GetByIDAndOwnerID(bookingID, ownerID)
	if err != nil {
		return ErrBookingNotFound
	}

	if booking.Status != models.BookingStatusPending {
		return ErrInvalidStatus
	}

	if err := s.bookingRepo.Reject(bookingID, reason); err != nil {
		return err
	}

	s.createBookingRejectedNotification(booking, reason)
	s.createHistory(bookingID, ownerID, "rejected", string(booking.Status), string(models.BookingStatusRejected), reason)

	return nil
}

func (s *BookingService) CompleteExpiredBookings() (int64, error) {
	expiredCount, err := s.bookingRepo.ExpirePendingBookings()
	if err != nil {
		return 0, err
	}

	if expiredCount > 0 {
		bookings, err := s.bookingRepo.GetExpiredBookingsForNotification()
		if err == nil {
			for _, booking := range bookings {
				s.createBookingExpiredNotification(&booking)
			}
		}
	}

	return expiredCount, nil
}

func (s *BookingService) SendCheckInReminders() error {
	bookings, err := s.bookingRepo.GetUpcomingCheckIns()
	if err != nil {
		return err
	}

	for _, booking := range bookings {
		s.createReminderNotification(&booking)
	}

	return nil
}

func (s *BookingService) createBookingRequestNotification(booking *models.Booking) {
	booking, _ = s.bookingRepo.GetByID(booking.ID)
	if booking == nil || booking.Kos == nil || booking.Kos.OwnerID == nil {
		return
	}

	notification := &models.Notification{
		UserID:    *booking.Kos.OwnerID,
		Type:      models.NotificationTypeBookingRequest,
		Title:     "Booking Baru!",
		Message:   booking.TenantName + " ingin menyewa " + booking.Kos.Name + ". Check-in: " + booking.CheckInDate.Format("02 Jan 2006"),
		BookingID: &booking.ID,
		KosID:     &booking.KosID,
	}

	s.notificationRepo.Create(notification)
}

func (s *BookingService) createBookingApprovedNotification(booking *models.Booking) {
	if booking.UserID == nil {
		return
	}

	notification := &models.Notification{
		UserID:    *booking.UserID,
		Type:      models.NotificationTypeBookingApproved,
		Title:     "Booking Disetujui!",
		Message:   "Selamat! Booking kost " + booking.Kos.Name + " telah disetujui. Hubungi owner untuk detail selanjutnya.",
		BookingID: &booking.ID,
		KosID:     &booking.KosID,
	}

	s.notificationRepo.Create(notification)
}

func (s *BookingService) createBookingRejectedNotification(booking *models.Booking, reason string) {
	if booking.UserID == nil {
		return
	}

	notification := &models.Notification{
		UserID:    *booking.UserID,
		Type:      models.NotificationTypeBookingRejected,
		Title:     "Booking Ditolak",
		Message:   "Maaf, booking kost " + booking.Kos.Name + " ditolak. Alasan: " + reason,
		BookingID: &booking.ID,
		KosID:     &booking.KosID,
	}

	s.notificationRepo.Create(notification)
}

func (s *BookingService) createBookingCancelledNotification(booking *models.Booking) {
	if booking.Kos == nil || booking.Kos.OwnerID == nil {
		return
	}

	notification := &models.Notification{
		UserID:    *booking.Kos.OwnerID,
		Type:      models.NotificationTypeBookingCancelled,
		Title:     "Booking Dibatalkan",
		Message:   booking.TenantName + " membatalkan request booking " + booking.Kos.Name,
		BookingID: &booking.ID,
		KosID:     &booking.KosID,
	}

	s.notificationRepo.Create(notification)
}

func (s *BookingService) createBookingExpiredNotification(booking *models.Booking) {
	if booking.UserID == nil {
		return
	}

	notification := &models.Notification{
		UserID:    *booking.UserID,
		Type:      models.NotificationTypeBookingExpired,
		Title:     "Request Kadaluarsa",
		Message:   "Request booking kost " + booking.Kos.Name + " telah kadaluarsa (7 hari tanpa respon)",
		BookingID: &booking.ID,
		KosID:     &booking.KosID,
	}

	s.notificationRepo.Create(notification)
}

func (s *BookingService) createReminderNotification(booking *models.Booking) {
	if booking.UserID == nil {
		return
	}

	notification := &models.Notification{
		UserID:    *booking.UserID,
		Type:      models.NotificationTypeReminder,
		Title:     "Reminder Check-in",
		Message:   "Jangan lupa check-in ke kost " + booking.Kos.Name + " besok!",
		BookingID: &booking.ID,
		KosID:     &booking.KosID,
	}

	s.notificationRepo.Create(notification)
}

func (s *BookingService) createHistory(bookingID, actorID uint, action, oldStatus, newStatus, notes string) {
	history := &models.BookingHistory{
		BookingID: bookingID,
		ActorID:   &actorID,
		Action:    action,
		OldStatus: oldStatus,
		NewStatus: newStatus,
		Notes:     notes,
	}

	s.bookingRepo.CreateHistory(history)
}

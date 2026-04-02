package services

import (
	"log"
	"time"

	"kose-backend/internal/repositories"
)

type CronService struct {
	bookingRepo *repositories.BookingRepository
}

func NewCronService(bookingRepo *repositories.BookingRepository) *CronService {
	return &CronService{
		bookingRepo: bookingRepo,
	}
}

func (s *CronService) Start() {
	go s.runBookingExpirationChecker()
	go s.runCheckInReminderChecker()
	log.Println("[Cron] Cron service started")
}

func (s *CronService) runBookingExpirationChecker() {
	ticker := time.NewTicker(1 * time.Hour)
	defer ticker.Stop()

	for range ticker.C {
		s.checkAndExpireBookings()
	}
}

func (s *CronService) runCheckInReminderChecker() {
	ticker := time.NewTicker(1 * time.Hour)
	defer ticker.Stop()

	for range ticker.C {
		s.sendCheckInReminders()
	}
}

func (s *CronService) checkAndExpireBookings() {
	count, err := s.bookingRepo.ExpirePendingBookings()
	if err != nil {
		log.Printf("[Cron] Error expiring bookings: %v", err)
		return
	}

	if count > 0 {
		log.Printf("[Cron] Expired %d pending bookings", count)
	}
}

func (s *CronService) sendCheckInReminders() {
	bookings, err := s.bookingRepo.GetUpcomingCheckIns()
	if err != nil {
		log.Printf("[Cron] Error getting upcoming check-ins: %v", err)
		return
	}

	if len(bookings) > 0 {
		log.Printf("[Cron] Found %d upcoming check-ins for tomorrow", len(bookings))
	}
}

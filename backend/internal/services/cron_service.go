package services

import (
	"log"
	"time"

	"kose-backend/internal/repositories"
)

type CronService struct {
	bookingRepo *repositories.BookingRepository
	stopCh      chan struct{}
}

func NewCronService(bookingRepo *repositories.BookingRepository) *CronService {
	return &CronService{
		bookingRepo: bookingRepo,
		stopCh:      make(chan struct{}),
	}
}

func (s *CronService) Start() {
	go s.runBookingExpirationChecker()
	go s.runCheckInReminderChecker()
	log.Println("[Cron] Cron service started")
}

func (s *CronService) Stop() {
	close(s.stopCh)
	log.Println("[Cron] Cron service stopped")
}

func (s *CronService) runBookingExpirationChecker() {
	ticker := time.NewTicker(1 * time.Hour)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			s.checkAndExpireBookings()
		case <-s.stopCh:
			return
		}
	}
}

func (s *CronService) runCheckInReminderChecker() {
	ticker := time.NewTicker(1 * time.Hour)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			s.sendCheckInReminders()
		case <-s.stopCh:
			return
		}
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

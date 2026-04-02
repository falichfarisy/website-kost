package services

import (
	"bytes"
	"fmt"
	"html/template"
	"log"
	"os"

	"gorm.io/gorm"
	"kose-backend/internal/models"
)

type EmailConfig struct {
	Enabled   bool
	Host      string
	Port      int
	Username  string
	Password  string
	FromEmail string
	FromName  string
}

type EmailService struct {
	config EmailConfig
	db     *gorm.DB
}

type EmailData struct {
	To      string
	Subject string
	Body    string
}

func NewEmailService(db *gorm.DB) *EmailService {
	return &EmailService{
		config: EmailConfig{
			Enabled:   os.Getenv("ENABLE_EMAIL") == "true",
			Host:      os.Getenv("SMTP_HOST"),
			Port:      587,
			Username:  os.Getenv("SMTP_USERNAME"),
			Password:  os.Getenv("SMTP_PASSWORD"),
			FromEmail: os.Getenv("SMTP_FROM_EMAIL"),
			FromName:  os.Getenv("SMTP_FROM_NAME"),
		},
		db: db,
	}
}

func (s *EmailService) IsEnabled() bool {
	return s.config.Enabled
}

func (s *EmailService) SendEmail(to, subject, body string) error {
	if !s.config.Enabled {
		log.Println("[Email] Email disabled, skipping send to:", to)
		return nil
	}

	log.Printf("[Email] Sending email to %s: %s", to, subject)
	return nil
}

func (s *EmailService) SendBookingRequestNotification(booking *models.Booking) error {
	if booking.Kos == nil {
		return nil
	}

	owner, err := s.getOwnerForKos(booking.Kos.ID)
	if err != nil || owner == nil {
		return nil
	}

	subject := "Booking Baru - " + booking.Kos.Name
	body := fmt.Sprintf(`
Halo %s,

Ada request booking baru untuk kost kamu!

Detail:
- Penyewa: %s
- Check-in: %s
- Durasi: %d bulan
- Total: Rp %s

Login ke dashboard owner untuk meninjau request ini.

Salam,
KOSE Platform
`, owner.Name, booking.TenantName,
		booking.CheckInDate.Format("02 Jan 2006"),
		booking.DurationMonths,
		formatCurrency(booking.TotalPrice))

	return s.SendEmail(owner.Email, subject, body)
}

func (s *EmailService) SendBookingApprovedNotification(booking *models.Booking) error {
	if booking.User == nil {
		return nil
	}

	kosName := "Kost"
	if booking.Kos != nil {
		kosName = booking.Kos.Name
	}

	subject := "Booking Disetujui - " + kosName
	body := fmt.Sprintf(`
Halo %s,

Booking kamu telah DISETUJUI!

Detail:
- Kost: %s
- Check-in: %s
- Durasi: %d bulan
- Total: Rp %s

Segera hubungi pemilik kost untuk koordinasi lebih lanjut.

Salam,
KOSE Platform
`, booking.TenantName,
		kosName,
		booking.CheckInDate.Format("02 Jan 2006"),
		booking.DurationMonths,
		formatCurrency(booking.TotalPrice))

	return s.SendEmail(booking.TenantEmail, subject, body)
}

func (s *EmailService) SendBookingRejectedNotification(booking *models.Booking, reason string) error {
	kosName := "Kost"
	if booking.Kos != nil {
		kosName = booking.Kos.Name
	}

	subject := "Booking Ditolak - " + kosName
	body := fmt.Sprintf(`
Halo %s,

Mohon maaf, booking kamu untuk kost %s ditolak.

Alasan: %s

Kamu bisa mencari kost lain di KOSE Platform.

Salam,
KOSE Platform
`, booking.TenantName,
		kosName,
		reason)

	return s.SendEmail(booking.TenantEmail, subject, body)
}

func (s *EmailService) SendCheckInReminder(booking *models.Booking) error {
	kosName := "Kost"
	if booking.Kos != nil {
		kosName = booking.Kos.Name
	}

	subject := "Reminder Check-in - " + kosName
	body := fmt.Sprintf(`
Halo %s,

Reminder: check-in ke %s besok (%s)!

Pastikan kamu sudah siap dengan dokumen yang diperlukan.

Salam,
KOSE Platform
`, booking.TenantName,
		kosName,
		booking.CheckInDate.Format("02 Jan 2006"))

	return s.SendEmail(booking.TenantEmail, subject, body)
}

func (s *EmailService) getOwnerForKos(kosID uint) (*models.User, error) {
	var kos models.Kos
	if err := s.db.First(&kos, kosID).Error; err != nil {
		return nil, err
	}

	if kos.OwnerID == nil {
		return nil, fmt.Errorf("kos has no owner")
	}

	var owner models.User
	if err := s.db.First(&owner, *kos.OwnerID).Error; err != nil {
		return nil, err
	}

	return &owner, nil
}

func formatCurrency(amount int) string {
	return fmt.Sprintf("%,d", amount)
}

type EmailTemplate struct {
	Name    string
	Subject string
	Body    string
}

var emailTemplates = map[string]EmailTemplate{
	"booking_request": {
		Name:    "booking_request",
		Subject: "Booking Baru - {{.KosName}}",
		Body:    getBookingRequestTemplate(),
	},
}

func getBookingRequestTemplate() string {
	return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #011E55; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; background: #011E55; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>KOSE - Booking Baru</h1>
        </div>
        <div class="content">
            <p>Halo <strong>{{.OwnerName}}</strong>,</p>
            <p>Ada request booking baru untuk kost Anda!</p>
            <h3>Detail Booking:</h3>
            <ul>
                <li><strong>Penyewa:</strong> {{.TenantName}}</li>
                <li><strong>Email:</strong> {{.TenantEmail}}</li>
                <li><strong>Telepon:</strong> {{.TenantPhone}}</li>
                <li><strong>Check-in:</strong> {{.CheckInDate}}</li>
                <li><strong>Durasi:</strong> {{.Duration}} bulan</li>
                <li><strong>Total:</strong> Rp {{.TotalPrice}}</li>
            </ul>
            {{if .Notes}}
            <p><strong>Catatan:</strong> {{.Notes}}</p>
            {{end}}
            <p style="text-align: center; margin-top: 20px;">
                <a href="{{.DashboardURL}}" class="button">Lihat di Dashboard</a>
            </p>
        </div>
        <div class="footer">
            <p>KOSE - Platform Pencarian Kost</p>
            <p>Email ini dikirim secara otomatis. Mohon jangan membalas email ini.</p>
        </div>
    </div>
</body>
</html>
`
}

type BookingEmailData struct {
	OwnerName    string
	TenantName   string
	TenantEmail  string
	TenantPhone  string
	KosName      string
	CheckInDate  string
	Duration     int
	TotalPrice   string
	Notes        string
	DashboardURL string
}

func ParseTemplate(templateStr string, data interface{}) (string, error) {
	tmpl, err := template.New("email").Parse(templateStr)
	if err != nil {
		return "", err
	}

	var buf bytes.Buffer
	if err := tmpl.Execute(&buf, data); err != nil {
		return "", err
	}

	return buf.String(), nil
}

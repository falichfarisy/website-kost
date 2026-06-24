package models

import (
	"time"

	"gorm.io/gorm"
)

// ============================================
// BOOKING ENUMS
// ============================================

// Booking Status enum
type BookingStatus string

const (
	BookingStatusPending   BookingStatus = "pending"
	BookingStatusApproved  BookingStatus = "approved"
	BookingStatusRejected  BookingStatus = "rejected"
	BookingStatusCancelled BookingStatus = "cancelled"
	BookingStatusExpired   BookingStatus = "expired"
	BookingStatusCompleted BookingStatus = "completed"
)

// Payment Status enum
type PaymentStatus string

const (
	PaymentStatusUnpaid   PaymentStatus = "unpaid"
	PaymentStatusPartial  PaymentStatus = "partial"
	PaymentStatusPaid     PaymentStatus = "paid"
	PaymentStatusRefunded PaymentStatus = "refunded"
)

// Notification Type enum
type NotificationType string

const (
	NotificationTypeBookingRequest   NotificationType = "booking_request"
	NotificationTypeBookingApproved  NotificationType = "booking_approved"
	NotificationTypeBookingRejected  NotificationType = "booking_rejected"
	NotificationTypeBookingCancelled NotificationType = "booking_cancelled"
	NotificationTypeBookingExpired   NotificationType = "booking_expired"
	NotificationTypeReminder         NotificationType = "reminder"
)

// ============================================
// BOOKING MODEL
// ============================================

type Booking struct {
	ID     uint  `gorm:"primaryKey" json:"id"`
	KosID  uint  `gorm:"index;not null" json:"kos_id"`
	UserID *uint `gorm:"index" json:"user_id"`

	// Tenant Information
	TenantName  string `gorm:"size:255;not null" json:"tenant_name"`
	TenantEmail string `gorm:"size:255;not null" json:"tenant_email"`
	TenantPhone string `gorm:"size:20;not null" json:"tenant_phone"`
	TenantNotes string `gorm:"type:text" json:"tenant_notes"`

	// Schedule
	CheckInDate    time.Time `gorm:"type:date;not null" json:"check_in_date"`
	DurationMonths int       `gorm:"default:1" json:"duration_months"`

	// Status
	Status             BookingStatus `gorm:"type:booking_status;default:pending" json:"status"`
	RejectionReason    string        `gorm:"type:text" json:"rejection_reason,omitempty"`
	CancelledAt        *time.Time    `json:"cancelled_at,omitempty"`
	CancellationReason string        `gorm:"type:text" json:"cancellation_reason,omitempty"`

	// Approval
	ApprovedBy *uint      `json:"approved_by,omitempty"`
	ApprovedAt *time.Time `json:"approved_at,omitempty"`
	ExpiresAt  time.Time  `json:"expires_at"`

	// Pricing
	MonthlyPrice  int           `gorm:"not null" json:"monthly_price"`
	TotalPrice    int           `gorm:"not null" json:"total_price"`
	DepositAmount int           `gorm:"default:0" json:"deposit_amount"`
	PaymentStatus PaymentStatus `gorm:"type:payment_status;default:unpaid" json:"payment_status"`

	// Timestamps
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	// Relations
	Kos   *Kos  `gorm:"foreignKey:KosID" json:"kos,omitempty"`
	User  *User `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Owner *User `gorm:"foreignKey:ApprovedBy" json:"approver,omitempty"`
}

// BookingHistory model for audit trail
type BookingHistory struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	BookingID uint      `gorm:"index;not null" json:"booking_id"`
	Action    string    `gorm:"size:50;not null" json:"action"`
	ActorID   *uint     `json:"actor_id,omitempty"`
	OldStatus string    `gorm:"size:20" json:"old_status,omitempty"`
	NewStatus string    `gorm:"size:20" json:"new_status,omitempty"`
	Notes     string    `gorm:"type:text" json:"notes,omitempty"`
	IPAddress string    `gorm:"size:45" json:"ip_address,omitempty"`
	CreatedAt time.Time `json:"created_at"`

	// Relations
	Booking *Booking `gorm:"foreignKey:BookingID" json:"booking,omitempty"`
	Actor   *User    `gorm:"foreignKey:ActorID" json:"actor,omitempty"`
}

// ============================================
// NOTIFICATION MODEL
// ============================================

type Notification struct {
	ID      uint             `gorm:"primaryKey" json:"id"`
	UserID  uint             `gorm:"index;not null" json:"user_id"`
	Type    NotificationType `gorm:"type:notification_type;not null" json:"type"`
	Title   string           `gorm:"size:255;not null" json:"title"`
	Message string           `gorm:"type:text;not null" json:"message"`

	// Relations
	BookingID *uint `json:"booking_id,omitempty"`
	KosID     *uint `json:"kos_id,omitempty"`

	// Read status
	IsRead bool       `gorm:"default:false" json:"is_read"`
	ReadAt *time.Time `json:"read_at,omitempty"`

	// Email tracking
	EmailSent   bool       `gorm:"default:false" json:"email_sent"`
	EmailSentAt *time.Time `json:"email_sent_at,omitempty"`

	CreatedAt time.Time      `json:"created_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	// Relations
	User    *User    `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Booking *Booking `gorm:"foreignKey:BookingID" json:"booking,omitempty"`
	Kos     *Kos     `gorm:"foreignKey:KosID" json:"kos,omitempty"`
}

// ============================================
// REQUEST/RESPONSE DTOs
// ============================================

// Create Booking Request
type CreateBookingRequest struct {
	KosID          uint   `json:"kos_id" binding:"required"`
	TenantName     string `json:"tenant_name" binding:"required,min=2"`
	TenantEmail    string `json:"tenant_email" binding:"required,email"`
	TenantPhone    string `json:"tenant_phone" binding:"required,min=10"`
	TenantNotes    string `json:"tenant_notes"`
	CheckInDate    string `json:"check_in_date" binding:"required"`
	DurationMonths int    `json:"duration_months" binding:"required,min=1,max=12"`
	MonthlyPrice   int    `json:"monthly_price" binding:"required,min=1"`
}

// Booking Response (for API)
type BookingResponse struct {
	ID              uint          `json:"id"`
	KosID           uint          `json:"kos_id"`
	TenantName      string        `json:"tenant_name"`
	TenantEmail     string        `json:"tenant_email"`
	TenantPhone     string        `json:"tenant_phone"`
	TenantNotes     string        `json:"tenant_notes,omitempty"`
	CheckInDate     string        `json:"check_in_date"`
	DurationMonths  int           `json:"duration_months"`
	Status          BookingStatus `json:"status"`
	RejectionReason string        `json:"rejection_reason,omitempty"`
	MonthlyPrice    int           `json:"monthly_price"`
	TotalPrice      int           `json:"total_price"`
	DepositAmount   int           `json:"deposit_amount"`
	PaymentStatus   PaymentStatus `json:"payment_status"`
	ExpiresAt       string        `json:"expires_at"`
	CreatedAt       string        `json:"created_at"`
	Kos             *KosResponse  `json:"kos,omitempty"`
}

// Kos Response (simplified for booking)
type KosResponse struct {
	ID             uint     `json:"id"`
	Name           string   `json:"name"`
	Address        string   `json:"address"`
	Price          int      `json:"price"`
	AvailableRooms int      `json:"available_rooms"`
	Images         []string `json:"images,omitempty"`
}

// Cancel Booking Request
type CancelBookingRequest struct {
	Reason string `json:"reason"`
}

// Reject Booking Request
type RejectBookingRequest struct {
	Reason string `json:"reason" binding:"required"`
}

// Paginated Bookings Response
type BookingsListResponse struct {
	Data []BookingResponse `json:"data"`
	Meta PaginationMeta    `json:"meta"`
}

type PaginationMeta struct {
	Page       int `json:"page"`
	Limit      int `json:"limit"`
	Total      int `json:"total"`
	TotalPages int `json:"totalPages"`
}

// ============================================
// BOOKING FILTERS
// ============================================

type BookingFilters struct {
	Status string
	KosID  uint
	Page   int
	Limit  int
}

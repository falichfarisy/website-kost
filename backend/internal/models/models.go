package models

import (
	"time"

	"gorm.io/gorm"
)

// User Role enum
type UserRole string

const (
	RoleUser  UserRole = "user"
	RoleAdmin UserRole = "admin"
	RoleOwner UserRole = "owner"
)

// Kos Type enum
type KosType string

const (
	KosTypePutra  KosType = "putra"
	KosTypePutri  KosType = "putri"
	KosTypeCampur KosType = "campur"
)

// Source Type enum
type SourceType string

const (
	SourceManual  SourceType = "manual"
	SourceScraped SourceType = "scraped"
)

// User model
type User struct {
	ID           uint           `gorm:"primaryKey" json:"id"`
	Email        string         `gorm:"uniqueIndex;size:255" json:"email"`
	PasswordHash string         `gorm:"size:255" json:"-"`
	Name         string         `gorm:"size:255" json:"name"`
	Phone        string         `gorm:"size:20" json:"phone"`
	Role         UserRole       `gorm:"type:user_role;default:user" json:"role"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

// Kos model
type Kos struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	Name           string         `gorm:"size:255" json:"name"`
	Description    string         `gorm:"type:text" json:"description"`
	Address        string         `gorm:"type:text" json:"address"`
	Latitude       float64        `json:"latitude"`
	Longitude      float64        `json:"longitude"`
	KosType        KosType        `gorm:"type:kos_type" json:"kos_type"`
	Price          int            `json:"price"`
	PriceType      string         `gorm:"size:20;default:bulan" json:"price_type"`
	Area           float64        `json:"area"`
	Capacity       int            `gorm:"default:1" json:"capacity"`
	AvailableRooms int            `gorm:"default:0" json:"available_rooms"`
	Rating         float64        `gorm:"default:0" json:"rating"`
	ReviewCount    int            `gorm:"default:0" json:"review_count"`
	Source         SourceType     `gorm:"type:source_type;default:manual" json:"source"`
	CreatedBy      *uint          `json:"created_by"`
	OwnerID        *uint          `json:"owner_id"`
	LocationID     *uint          `json:"location_id"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`

	// Relations
	Location   *Location  `gorm:"foreignKey:LocationID" json:"location,omitempty"`
	Facilities []Facility `gorm:"many2many:kos_facilities;" json:"facilities,omitempty"`
	Images     []KosImage `gorm:"foreignKey:KosID" json:"images,omitempty"`
	Reviews    []Review   `gorm:"foreignKey:KosID" json:"reviews,omitempty"`
	Owner      *User      `gorm:"foreignKey:OwnerID" json:"owner,omitempty"`
}

// Facility model
type Facility struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"uniqueIndex;size:100" json:"name"`
	Icon      string    `gorm:"size:50" json:"icon"`
	CreatedAt time.Time `json:"created_at"`
	Kos       []Kos     `gorm:"many2many:kos_facilities;" json:"-"`
}

// KosImage model
type KosImage struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	KosID     uint      `gorm:"index" json:"kos_id"`
	URL       string    `gorm:"type:text" json:"url"`
	IsPrimary bool      `gorm:"default:false" json:"is_primary"`
	CreatedAt time.Time `json:"created_at"`
}

// Review model
type Review struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	KosID     uint      `gorm:"index" json:"kos_id"`
	UserID    uint      `gorm:"index" json:"user_id"`
	Rating    int       `gorm:"check:rating >= 1 AND rating <= 5" json:"rating"`
	Comment   string    `gorm:"type:text" json:"comment"`
	CreatedAt time.Time `json:"created_at"`

	// Relations
	User *User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

// Favorite model
type Favorite struct {
	UserID    uint      `gorm:"primaryKey" json:"user_id"`
	KosID     uint      `gorm:"primaryKey" json:"kos_id"`
	CreatedAt time.Time `json:"created_at"`

	// Relations
	User *User `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Kos  *Kos  `gorm:"foreignKey:KosID" json:"kos,omitempty"`
}

// Location model
type Location struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Province    string    `gorm:"size:100" json:"province"`
	City        string    `gorm:"size:100" json:"city"`
	District    string    `gorm:"size:100" json:"district"`
	Subdistrict string    `gorm:"size:100" json:"subdistrict"`
	CreatedAt   time.Time `json:"created_at"`
}

type KosFilters struct {
	MinPrice  int
	MaxPrice  int
	KosType   string
	Facility  string
	MinRating float64
	Search    string
	Page      int
	Limit     int
}

package main

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	godotenv.Load()

	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "5432")
	dbUser := getEnv("DB_USER", "postgres")
	dbPassword := getEnv("DB_PASSWORD", "password")
	dbName := getEnv("DB_NAME", "kose")

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Jakarta",
		dbHost, dbUser, dbPassword, dbName, dbPort,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("Failed to get underlying DB: %v", err)
	}
	defer sqlDB.Close()

	migrations := []string{
		// Booking status enum
		`DO $$ BEGIN
			CREATE TYPE booking_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled', 'expired', 'completed');
		EXCEPTION
			WHEN duplicate_object THEN null;
		END $$;`,

		// Payment status enum
		`DO $$ BEGIN
			CREATE TYPE payment_status AS ENUM ('unpaid', 'partial', 'paid', 'refunded');
		EXCEPTION
			WHEN duplicate_object THEN null;
		END $$;`,

		// Notification type enum
		`DO $$ BEGIN
			CREATE TYPE notification_type AS ENUM ('booking_request', 'booking_approved', 'booking_rejected', 'booking_cancelled', 'booking_expired', 'reminder');
		EXCEPTION
			WHEN duplicate_object THEN null;
		END $$;`,

		// Add owner_id to kos
		`DO $$ BEGIN
			ALTER TABLE kos ADD COLUMN owner_id INTEGER REFERENCES users(id);
		EXCEPTION
			WHEN duplicate_column THEN null;
		END $$;`,

		// Create bookings table
		`CREATE TABLE IF NOT EXISTS bookings (
			id SERIAL PRIMARY KEY,
			kos_id INTEGER NOT NULL REFERENCES kos(id) ON DELETE CASCADE,
			user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
			tenant_name VARCHAR(255) NOT NULL,
			tenant_email VARCHAR(255) NOT NULL,
			tenant_phone VARCHAR(20) NOT NULL,
			tenant_notes TEXT,
			check_in_date DATE NOT NULL,
			duration_months INTEGER DEFAULT 1,
			status booking_status DEFAULT 'pending',
			rejection_reason TEXT,
			cancelled_at TIMESTAMP,
			cancellation_reason TEXT,
			approved_by INTEGER REFERENCES users(id),
			approved_at TIMESTAMP,
			expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days'),
			monthly_price INTEGER NOT NULL,
			total_price INTEGER NOT NULL,
			deposit_amount INTEGER DEFAULT 0,
			payment_status payment_status DEFAULT 'unpaid',
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);`,

		// Create indexes for bookings
		`CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);`,
		`CREATE INDEX IF NOT EXISTS idx_bookings_kos ON bookings(kos_id);`,
		`CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);`,
		`CREATE INDEX IF NOT EXISTS idx_bookings_expires ON bookings(expires_at) WHERE status = 'pending';`,
		`CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings(created_at DESC);`,

		// Create booking_history table
		`CREATE TABLE IF NOT EXISTS booking_history (
			id SERIAL PRIMARY KEY,
			booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
			action VARCHAR(50) NOT NULL,
			actor_id INTEGER REFERENCES users(id),
			old_status VARCHAR(20),
			new_status VARCHAR(20),
			notes TEXT,
			ip_address VARCHAR(45),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE INDEX IF NOT EXISTS idx_booking_history_booking ON booking_history(booking_id);`,

		// Create notifications table
		`CREATE TABLE IF NOT EXISTS notifications (
			id SERIAL PRIMARY KEY,
			user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			type notification_type NOT NULL,
			title VARCHAR(255) NOT NULL,
			message TEXT NOT NULL,
			booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
			kos_id INTEGER REFERENCES kos(id) ON DELETE SET NULL,
			is_read BOOLEAN DEFAULT FALSE,
			read_at TIMESTAMP,
			email_sent BOOLEAN DEFAULT FALSE,
			email_sent_at TIMESTAMP,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);`,
		`CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id) WHERE is_read = FALSE;`,
		`CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);`,

		// Add owner_id index if column exists
		`DO $$ BEGIN
			CREATE INDEX IF NOT EXISTS idx_kos_owner ON kos(owner_id);
		EXCEPTION
			WHEN undefined_column THEN null;
		END $$;`,
	}

	fmt.Println("Running booking system migrations...")
	fmt.Println()

	for i, migration := range migrations {
		fmt.Printf("[%d/%d] Executing migration...\n", i+1, len(migrations))
		if err := db.Exec(migration).Error; err != nil {
			log.Printf("Warning: %v", err)
		}
	}

	fmt.Println()
	fmt.Println("✅ Migrations completed successfully!")
	fmt.Println()
	fmt.Println("Next steps:")
	fmt.Println("1. Set owner_id for existing kos (optional)")
	fmt.Println("2. Start the server: go run ./cmd/server")
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

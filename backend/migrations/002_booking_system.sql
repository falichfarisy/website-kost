-- Booking System Migration
-- Run this after 001_initial.sql

-- Connect to database
\c kose;

-- 1. Add owner_id to kos table
ALTER TABLE kos ADD COLUMN owner_id INTEGER REFERENCES users(id);
CREATE INDEX idx_kos_owner ON kos(owner_id);

-- 2. Booking status enum
CREATE TYPE booking_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'cancelled',
    'expired',
    'completed'
);

-- 3. Payment status enum
CREATE TYPE payment_status AS ENUM (
    'unpaid',
    'partial',
    'paid',
    'refunded'
);

-- 4. Bookings table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    kos_id INTEGER NOT NULL REFERENCES kos(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    
    -- Tenant information
    tenant_name VARCHAR(255) NOT NULL,
    tenant_email VARCHAR(255) NOT NULL,
    tenant_phone VARCHAR(20) NOT NULL,
    tenant_notes TEXT,
    
    -- Schedule
    check_in_date DATE NOT NULL,
    duration_months INTEGER DEFAULT 1,
    
    -- Status
    status booking_status DEFAULT 'pending',
    rejection_reason TEXT,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    
    -- Approval tracking
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days'),
    
    -- Pricing (prepared for payment gateway)
    monthly_price INTEGER NOT NULL,
    total_price INTEGER NOT NULL,
    deposit_amount INTEGER DEFAULT 0,
    payment_status payment_status DEFAULT 'unpaid',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for bookings
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_kos ON bookings(kos_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_expires ON bookings(expires_at) WHERE status = 'pending';
CREATE INDEX idx_bookings_created ON bookings(created_at DESC);

-- 5. Booking history (audit trail)
CREATE TABLE booking_history (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    actor_id INTEGER REFERENCES users(id),
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    notes TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_booking_history_booking ON booking_history(booking_id);

-- 6. Notification type enum
CREATE TYPE notification_type AS ENUM (
    'booking_request',
    'booking_approved',
    'booking_rejected',
    'booking_cancelled',
    'booking_expired',
    'reminder'
);

-- 7. Notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Relations
    booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
    kos_id INTEGER REFERENCES kos(id) ON DELETE SET NULL,
    
    -- Read status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    -- Email tracking
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

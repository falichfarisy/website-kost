# Booking System Implementation Plan

## 🎯 Goals

**Primary Goal**: Menghubungkan pemilik kos dengan mahasiswa/calon pelanggan secara efisien.

**Key Principles**:
- Payment gateway: Prepared but disabled (toggle via env)
- Room granularity: Simple count-based (`available_rooms`)
- Auto-approve: Not implemented yet (future decision)
- Notifications: Email + In-app (email infrastructure ready)
- Approval: Dedicated owner panel

---

## 📊 Database Schema

### 1. Bookings Table (NEW)
```sql
CREATE TYPE booking_status AS ENUM (
    'pending',      -- Menunggu approval
    'approved',    -- Disetujui
    'rejected',    -- Ditolak
    'cancelled',   -- Dibatalkan user
    'expired',     -- Expired (no response dalam 7 days)
    'completed'    -- Selesai (udah check-out)
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    kos_id INTEGER REFERENCES kos(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    
    -- Booking Details
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
    
    -- Approval
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    expires_at TIMESTAMP, -- Auto-expire after 7 days if pending
    
    -- Pricing (for payment gateway preparation)
    monthly_price INTEGER NOT NULL,
    total_price INTEGER NOT NULL,
    deposit_amount INTEGER DEFAULT 0,
    payment_status payment_status DEFAULT 'unpaid',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE payment_status AS ENUM ('unpaid', 'partial', 'paid', 'refunded');

CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_kos ON bookings(kos_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_expires ON bookings(expires_at) WHERE status = 'pending';
```

### 2. Kos Owner Relation (UPDATE)
```sql
-- Add owner_id to kos table
ALTER TABLE kos ADD COLUMN owner_id INTEGER REFERENCES users(id);

-- Only owner can approve bookings for their kos
CREATE INDEX idx_kos_owner ON kos(owner_id);
```

### 3. Notifications Table (NEW)
```sql
CREATE TYPE notification_type AS ENUM (
    'booking_request',       -- Owner: ada booking baru
    'booking_approved',      -- User: booking approved
    'booking_rejected',      -- User: booking rejected
    'booking_cancelled',     -- Owner: user cancel
    'booking_expired',       -- User: request expired
    'reminder'              -- User: check-in reminder
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Relations
    booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
    kos_id INTEGER REFERENCES kos(id) ON DELETE SET NULL,
    
    -- Read status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    -- For email
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE is_read = FALSE;
```

### 4. Booking History (NEW - for audit)
```sql
CREATE TABLE booking_history (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    
    action VARCHAR(50) NOT NULL, -- created, approved, rejected, cancelled, etc.
    actor_id INTEGER REFERENCES users(id), -- who did it
    old_status booking_status,
    new_status booking_status,
    
    notes TEXT,
    ip_address VARCHAR(45),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 Backend API Endpoints

### User Booking APIs
```
POST   /api/bookings                    - Create booking request
GET    /api/bookings                    - List user's bookings (with pagination)
GET    /api/bookings/:id                - Get booking detail
PUT    /api/bookings/:id/cancel         - Cancel own booking
GET    /api/bookings/:id/history        - Get booking history/audit trail
```

### Owner APIs (Dedicated Owner Panel)
```
GET    /api/owner/bookings              - List bookings for owner's kos
GET    /api/owner/bookings/pending      - List pending bookings
GET    /api/owner/bookings/:id          - Get booking detail
PUT    /api/owner/bookings/:id/approve  - Approve booking
PUT    /api/owner/bookings/:id/reject   - Reject booking (with reason)
PUT    /api/owner/bookings/:id/complete - Mark as completed (check-out)
```

### Notifications APIs
```
GET    /api/notifications               - List user's notifications
GET    /api/notifications/unread/count  - Get unread count
PUT    /api/notifications/:id/read      - Mark single as read
PUT    /api/notifications/read-all      - Mark all as read
DELETE /api/notifications/:id           - Delete notification
```

### Admin APIs
```
GET    /api/admin/bookings              - List all bookings (superadmin)
GET    /api/admin/bookings/stats        - Booking statistics
```

### Payment Gateway (Prepared, Disabled)
```
POST   /api/payments/create-session      - Create payment session (disabled by default)
POST   /api/payments/webhook            - Payment gateway webhook
GET    /api/payments/:booking_id/status - Check payment status
```

---

## 📁 Backend File Structure

```
backend/internal/
├── config/
│   └── config.go                       # Add: booking settings
├── models/
│   ├── booking.go                      # NEW
│   ├── notification.go                  # NEW
│   ├── booking_history.go               # NEW
│   └── ...
├── repositories/
│   ├── booking_repository.go            # NEW
│   ├── notification_repository.go        # NEW
│   └── ...
├── services/
│   ├── booking_service.go               # NEW
│   ├── notification_service.go          # NEW
│   ├── email_service.go                 # NEW (prepared for email)
│   └── payment_service.go               # NEW (prepared, disabled)
├── handlers/
│   ├── booking_handler.go               # NEW
│   ├── owner_booking_handler.go         # NEW
│   ├── notification_handler.go          # NEW
│   └── payment_handler.go               # NEW (prepared, disabled)
└── middleware/
    └── owner_middleware.go              # NEW (verify owner of kos)
```

---

## 🎨 Frontend Pages

### User Portal
```
/bookings                              - List user's bookings
/bookings/[id]                         - Booking detail
/kos/[id]                              - Add "Booking" button
```

### Owner Portal (NEW)
```
/owner                                  - Owner dashboard
/owner/bookings                         - Booking management
/owner/bookings/pending                 - Pending approvals
/owner/bookings/[id]                    - Booking detail + approve/reject
/owner/settings                         - Owner settings
```

### Components
```
frontend/components/
├── BookingCard.tsx                     # NEW - booking card for list
├── BookingForm.tsx                     # NEW - booking request form
├── BookingStatus.tsx                   # NEW - status badge
├── OwnerBookingList.tsx                # NEW - owner booking list
├── BookingActions.tsx                  # NEW - approve/reject buttons
├── NotificationBell.tsx                # NEW - notification bell icon
├── NotificationList.tsx                # NEW - notification dropdown/list
└── NotificationItem.tsx                # NEW - single notification
```

---

## 🔔 Notification System Design

### Notification Types & Messages

| Type | Recipient | Title | Message |
|------|-----------|-------|---------|
| `booking_request` | Owner | Booking Baru! | "{tenant_name} ingin menyewa {kos_name}. Check-in: {date}" |
| `booking_approved` | User | Booking Disetujui! | "Selamat! Booking kost {kos_name} telah disetujui. Hubungi owner untuk detail selanjutnya." |
| `booking_rejected` | User | Booking Ditolak | "Maaf, booking kost {kos_name} ditolak. Alasan: {reason}" |
| `booking_cancelled` | Owner | Booking Dibatalkan | "{tenant_name} membatalkan request booking {kos_name}" |
| `booking_expired` | User | Request Kadaluarsa | "Request booking kost {kos_name} telah kadaluarsa (7 hari tanpa respon)" |
| `reminder` | User | Reminder Check-in | "Jangan lupa check-in ke kost {kos_name} pada {date}!" |

### Email Preparation
- Email templates stored in `backend/templates/emails/`
- SMTP config ready in `.env`
- Toggle: `ENABLE_EMAIL=true/false`

---

## 💳 Payment Gateway Preparation

### Structure (Disabled by Default)
```go
// backend/internal/services/payment_service.go

type PaymentConfig struct {
    Enabled        bool   // Toggle: false by default
    Provider       string // "midtrans", "xendit", "stripe"
    MerchantId     string
    ClientKey      string
    ServerKey      string
    Sandbox        bool
}

// Environment variables (in .env)
ENABLE_PAYMENT=false
PAYMENT_PROVIDER=midtrans
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_SANDBOX=true
```

### Prepared Features
- [ ] Midtrans integration (most popular in Indonesia)
- [ ] Xendit alternative
- [ ] Payment status tracking
- [ ] Webhook handlers
- [ ] Refund handling

---

## ⏰ Cron Jobs / Background Jobs

```go
// Booking expiration checker
// Runs every hour
// - Find bookings with status='pending' AND expires_at < now
// - Update status to 'expired'
// - Create notification for user
// - Create notification for owner (info)

// Check-in reminder
// Runs daily at 9 AM
// - Find bookings with check_in_date = tomorrow AND status='approved'
// - Create reminder notification
```

---

## 📋 Implementation Phases

### Phase 1: Database & Models (Day 1)
- [ ] Create migrations for bookings, notifications, booking_history
- [ ] Add owner_id to kos table
- [ ] Create Go models
- [ ] Create repositories

### Phase 2: Core Booking APIs (Day 2-3)
- [ ] Booking CRUD (user)
- [ ] Owner booking management
- [ ] Owner middleware (verify ownership)
- [ ] Booking validation & business logic

### Phase 3: Notifications (Day 3-4)
- [ ] Notification model & repository
- [ ] Notification service
- [ ] In-app notification APIs
- [ ] Frontend notification bell component
- [ ] Real-time notification (polling or WebSocket)

### Phase 4: Email Infrastructure (Day 4)
- [ ] Email templates
- [ ] SMTP setup
- [ ] Email service (disabled by default)
- [ ] Test email sending

### Phase 5: Frontend - User (Day 5-6)
- [ ] Booking form on kos detail page
- [ ] User bookings list page
- [ ] Booking detail page
- [ ] Booking cancellation

### Phase 6: Frontend - Owner Portal (Day 6-7)
- [ ] Owner dashboard layout
- [ ] Booking management page
- [ ] Approve/reject functionality
- [ ] Booking history

### Phase 7: Payment Preparation (Day 7)
- [ ] Payment service structure
- [ ] Environment variable setup
- [ ] Payment toggle logic
- [ ] Webhook handlers (prepared)

### Phase 8: Cron Jobs & Polish (Day 8)
- [ ] Booking expiration cron
- [ ] Reminder cron
- [ ] Testing edge cases
- [ ] Error handling

---

## 🔐 Permission Matrix

| Action | User | Owner | Admin |
|--------|------|-------|-------|
| Create booking | ✅ Own | ❌ | ❌ |
| View own bookings | ✅ | ❌ | ❌ |
| Cancel own booking | ✅ (pending only) | ❌ | ❌ |
| View bookings for own kos | ❌ | ✅ | ❌ |
| Approve/Reject booking | ❌ | ✅ (own kos) | ✅ |
| View all bookings | ❌ | ❌ | ✅ |
| Manage notifications | ✅ (own) | ✅ (own) | ✅ (all) |

---

## 📱 Owner App Considerations

Since goal is to **connect owner with customers**, owner needs:
1. **Quick response** - Mobile-friendly panel
2. **Push notifications** - Get notified immediately
3. **One-tap approve/reject** - Fast decision making
4. **Contact customer** - Call/WhatsApp button
5. **Booking calendar view** - See all bookings timeline

For MVP: Owner panel as part of web app
Future: Dedicated mobile app for owners

---

## 🎯 Success Metrics

1. **Booking conversion rate**: % of kos detail visitors who make booking
2. **Response time**: Avg time owner takes to approve/reject
3. **Booking completion rate**: % approved bookings that complete
4. **User satisfaction**: Rating after booking experience

---

## 📝 Notes

- Owner must be a user with `role='owner'` or assigned via `owner_id` on kos
- Booking decrement `available_rooms` when approved
- Consider: What if owner doesn't respond? → Expires in 7 days
- Consider: What if user wants to modify booking? → Cancel & re-book

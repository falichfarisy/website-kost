-- Seed Data for Development
-- Run this after all migrations: 001_initial.sql, 002_booking_system.sql, 003_add_owner_role.sql
-- Password for all users: password123
\c kose;

-- Hapus data lama (idempotent — bisa dijalankan berulang)
TRUNCATE TABLE
    notifications,
    booking_history,
    bookings,
    favorites,
    reviews,
    kos_facilities,
    kos_images,
    kos,
    locations,
    users
RESTART IDENTITY CASCADE;

-- ============================================
-- USERS (password hash: password123)
-- ============================================
INSERT INTO users (email, password_hash, name, phone, role) VALUES
    ('admin@kose.id',    '$2a$10$DnU.Pt0hlLCGpd7RUvILeuaELZK6pdaXhFFM67gKGCVnoWUDmX7K2', 'Admin KOSE',      '081234567890', 'admin'),
    ('owner@kose.id',    '$2a$10$DnU.Pt0hlLCGpd7RUvILeuaELZK6pdaXhFFM67gKGCVnoWUDmX7K2', 'Budi Santoso',    '081234567891', 'owner'),
    ('user@kose.id',     '$2a$10$DnU.Pt0hlLCGpd7RUvILeuaELZK6pdaXhFFM67gKGCVnoWUDmX7K2', 'Test User',       '081234567892', 'user');

-- ============================================
-- LOCATIONS
-- ============================================
INSERT INTO locations (province, city, district, subdistrict) VALUES
    ('Jawa Barat', 'Bandung',      'Coblong',       'Dago'),
    ('Jawa Barat', 'Bandung',      'Sukajadi',      'Setiabudi'),
    ('DKI Jakarta', 'Jakarta Pusat', 'Menteng',     'Gondangdia'),
    ('DKI Jakarta', 'Jakarta Selatan', 'Setiabudi', 'Kuningan'),
    ('DI Yogyakarta', 'Sleman',    'Depok',         'Babarsari');

-- ============================================
-- KOS (5 kos with various types, prices, facilities)
-- ============================================
INSERT INTO kos (name, description, address, latitude, longitude, kos_type, price, price_type, area, capacity, available_rooms, rating, review_count, source, created_by, owner_id, location_id) VALUES
    -- Kos 1: Putra - Dago, Bandung
    ('Kost Dago Elit',
     'Kost eksklusif di kawasan Dago dengan view pegunungan. Cocok untuk mahasiswa dan pekerja. Dilengkapi dengan akses 24 jam dan CCTV.',
     'Jl. Ir. H. Juanda No. 123, Dago, Coblong, Bandung',
     -6.8765432, 107.6189012, 'putra', 1500000, 'bulan', 24.0, 2, 5, 4.5, 12, 'manual', 1, 2, 1),

    -- Kos 2: Putri - Setiabudi, Bandung
    ('Kost Putri Setiabudi',
     'Kost khusus putri nyaman dan aman. Dekat dengan kampus UNPAD, UPI, dan ITB. Ada dapur bersama dan area parkir luas.',
     'Jl. Setiabudi No. 45, Sukajadi, Bandung',
     -6.8654321, 107.6098765, 'putri', 1200000, 'bulan', 18.0, 1, 3, 4.2, 8, 'manual', 1, 2, 2),

    -- Kos 3: Campur - Menteng, Jakarta Pusat
    ('Kost Menteng Tengah',
     'Kost premium di jantung kota Jakarta. Dekat dengan perkantoran, pusat perbelanjaan, dan transportasi umum. Full furnished.',
     'Jl. Menteng Tengah No. 78, Menteng, Jakarta Pusat',
     -6.1934567, 106.8312345, 'campur', 2500000, 'bulan', 30.0, 2, 8, 4.8, 25, 'manual', 1, 2, 3),

    -- Kos 4: Putra - Kuningan, Jakarta Selatan
    ('Kost Kuningan City',
     'Kost strategis di kawasan bisnis Kuningan. Cocok untuk karyawan. 5 menit ke SCBD, 10 menit ke Mega Kuningan. Ada laundry service.',
     'Jl. Kuningan Barat No. 56, Setiabudi, Jakarta Selatan',
     -6.2345678, 106.8456789, 'putra', 2000000, 'bulan', 22.0, 1, 4, 4.0, 15, 'manual', 1, 2, 4),

    -- Kos 5: Campur - Babarsari, Sleman
    ('Kost Babarsari Jogja',
     'Kost mahasiswa di kawasan Babarsari. Dekat dengan UGM, UNY, dan AMIKOM. Suasana asri dan harga ramah di kantong.',
     'Jl. Babarsari No. 12, Depok, Sleman, Yogyakarta',
     -7.7789012, 110.3845678, 'campur', 750000, 'bulan', 15.0, 1, 10, 4.6, 30, 'manual', 1, 2, 5);

-- ============================================
-- KOS IMAGES (placeholder URLs using picsum.photos)
-- ============================================
INSERT INTO kos_images (kos_id, url, is_primary) VALUES
    (1, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', true),
    (1, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', false),
    (2, 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800', true),
    (2, 'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800', false),
    (3, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', true),
    (3, 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800', false),
    (4, 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800', true),
    (5, 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800', true),
    (5, 'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=800', false);

-- ============================================
-- KOS FACILITIES (linking kos to facilities)
-- Facilities are pre-seeded in 001_initial.sql (id 1-18)
-- ============================================
-- Kost Dago Elit: WiFi, AC, Kamar Mandi Dalam, Parkir Motor, Kasur, Meja, Kursi, Lemari, CCTV
INSERT INTO kos_facilities (kos_id, facility_id) VALUES
    (1, 1), (1, 2), (1, 3), (1, 7), (1, 11), (1, 12), (1, 13), (1, 14), (1, 16);

-- Kost Putri Setiabudi: WiFi, AC, Kamar Mandi Dalam, Dapur, Parkir Motor, Kasur, Meja, Lemari, Security
INSERT INTO kos_facilities (kos_id, facility_id) VALUES
    (2, 1), (2, 2), (2, 3), (2, 5), (2, 7), (2, 11), (2, 12), (2, 14), (2, 15);

-- Kost Menteng Tengah: All facilities
INSERT INTO kos_facilities (kos_id, facility_id) VALUES
    (3, 1), (3, 2), (3, 3), (3, 5), (3, 6), (3, 7), (3, 8), (3, 9), (3, 10), (3, 11), (3, 12), (3, 13), (3, 14), (3, 15), (3, 16), (3, 17), (3, 18);

-- Kost Kuningan City: WiFi, AC, Kamar Mandi Dalam, Parkir Motor, Parkir Mobil, Kasur, Meja, Kursi, Lemari, CCTV, Security
INSERT INTO kos_facilities (kos_id, facility_id) VALUES
    (4, 1), (4, 2), (4, 3), (4, 7), (4, 8), (4, 11), (4, 12), (4, 13), (4, 14), (4, 15), (4, 16);

-- Kost Babarsari Jogja: WiFi, Kamar Mandi Luar, Dapur, Parkir Motor, Kasur, Meja, Lemari
INSERT INTO kos_facilities (kos_id, facility_id) VALUES
    (5, 1), (5, 4), (5, 5), (5, 7), (5, 11), (5, 12), (5, 14);

-- ============================================
-- REVIEWS
-- ============================================
INSERT INTO reviews (kos_id, user_id, rating, comment) VALUES
    (1, 3, 5, 'Kostnya bagus, bersih, dan nyaman. Lokasi strategis dekat kampus.'),
    (2, 3, 5, 'Kost putri terbaik di Setiabudi! Aman dan nyaman.'),
    (3, 3, 5, 'Mewah banget! Cocok untuk ekspat atau pekerja kantoran.'),
    (5, 3, 5, 'Kost favorit anak Jogja! Murah, nyaman, dekat kampus.');

-- ============================================
-- FAVORITES
-- ============================================
INSERT INTO favorites (user_id, kos_id) VALUES
    (3, 1),
    (3, 5);

-- ============================================
-- BOOKINGS (sample booking for testing)
-- ============================================
INSERT INTO bookings (kos_id, user_id, tenant_name, tenant_email, tenant_phone, tenant_notes, check_in_date, duration_months, status, monthly_price, total_price, deposit_amount, payment_status, expires_at)
VALUES
    (1, 3, 'Test User', 'user@kose.id', '081234567892', 'Saya mahasiswa baru, butuh kost untuk 6 bulan.', CURRENT_DATE + INTERVAL '7 days', 6, 'pending', 1500000, 9000000, 500000, 'unpaid', CURRENT_TIMESTAMP + INTERVAL '7 days'),
    (5, 3, 'Test User', 'user@kose.id', '081234567892', 'Mau booking untuk kakak saya.', CURRENT_DATE + INTERVAL '14 days', 12, 'approved', 750000, 9000000, 750000, 'paid', CURRENT_TIMESTAMP - INTERVAL '1 day'),
    (2, 3, 'Test User', 'user@kose.id', '081234567892', NULL, CURRENT_DATE - INTERVAL '30 days', 3, 'completed', 1200000, 3600000, 0, 'paid', CURRENT_TIMESTAMP - INTERVAL '23 days');

-- ============================================
-- BOOKING HISTORY (audit trail)
-- ============================================
INSERT INTO booking_history (booking_id, action, actor_id, old_status, new_status, notes) VALUES
    (1, 'created', 3, NULL, 'pending', 'Booking dibuat oleh tenant'),
    (2, 'created', 3, NULL, 'pending', 'Booking dibuat oleh tenant'),
    (2, 'approved', 2, 'pending', 'approved', 'Booking disetujui oleh owner'),
    (2, 'payment_confirmed', 1, 'approved', 'paid', 'Pembayaran dikonfirmasi admin'),
    (3, 'created', 3, NULL, 'pending', 'Booking dibuat oleh tenant'),
    (3, 'approved', 2, 'pending', 'approved', 'Booking disetujui oleh owner'),
    (3, 'completed', 2, 'paid', 'completed', 'Booking selesai');

-- ============================================
-- NOTIFICATIONS
-- ============================================
INSERT INTO notifications (user_id, type, title, message, booking_id, kos_id, is_read) VALUES
    (2, 'booking_request', 'Booking Baru', 'Test User ingin booking Kost Dago Elit selama 6 bulan.', 1, 1, false),
    (1, 'booking_request', 'Booking Baru', 'Test User ingin booking Kost Dago Elit selama 6 bulan.', 1, 1, true),
    (3, 'booking_approved', 'Booking Disetujui', 'Booking Kost Babarsari Jogja kamu telah disetujui oleh owner.', 2, 5, true),
    (3, 'reminder', 'Booking Selesai', 'Masa kost Kost Putri Setiabudi telah selesai. Terima kasih!', 3, 2, true);

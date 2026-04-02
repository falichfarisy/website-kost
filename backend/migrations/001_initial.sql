-- Database migration SQL for KOSE
-- Run this file to create the database and tables manually

-- Create database
CREATE DATABASE kose;

-- Connect to database
\c kose;

-- User roles enum
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Kos type enum
CREATE TYPE kos_type AS ENUM ('putra', 'putri', 'campur');

-- Source type enum
CREATE TYPE source_type AS ENUM ('manual', 'scraped');

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role user_role DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Locations table
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    province VARCHAR(100),
    city VARCHAR(100),
    district VARCHAR(100),
    subdistrict VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Kos table
CREATE TABLE kos (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    kos_type kos_type NOT NULL,
    price INTEGER NOT NULL,
    price_type VARCHAR(20) DEFAULT 'bulan',
    area DECIMAL(10,2),
    capacity INTEGER DEFAULT 1,
    available_rooms INTEGER DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    source source_type DEFAULT 'manual',
    created_by INTEGER REFERENCES users(id),
    location_id INTEGER REFERENCES locations(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Facilities table
CREATE TABLE facilities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Kos-Facilities many-to-many
CREATE TABLE kos_facilities (
    kos_id INTEGER REFERENCES kos(id) ON DELETE CASCADE,
    facility_id INTEGER REFERENCES facilities(id) ON DELETE CASCADE,
    PRIMARY KEY (kos_id, facility_id)
);

-- Kos images
CREATE TABLE kos_images (
    id SERIAL PRIMARY KEY,
    kos_id INTEGER REFERENCES kos(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    kos_id INTEGER REFERENCES kos(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(kos_id, user_id)
);

-- Favorites
CREATE TABLE favorites (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    kos_id INTEGER REFERENCES kos(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, kos_id)
);

-- Indexes for search performance
CREATE INDEX idx_kos_price ON kos(price);
CREATE INDEX idx_kos_type ON kos(kos_type);
CREATE INDEX idx_kos_rating ON kos(rating DESC);
CREATE INDEX idx_kos_location ON kos(location_id);
CREATE INDEX idx_kos_available ON kos(available_rooms) WHERE available_rooms > 0;

-- Full-text search index
CREATE INDEX idx_kos_search ON kos USING GIN(to_tsvector('indonesian', name || ' ' || address));

-- Composite index for filtering
CREATE INDEX idx_kos_filter ON kos(kos_type, price, rating) WHERE available_rooms > 0;

-- Insert default facilities
INSERT INTO facilities (name, icon) VALUES 
    ('WiFi', 'wifi'),
    ('AC', 'ac'),
    ('Kamar Mandi Dalam', 'bathroom'),
    ('Kamar Mandi Luar', 'bathroom-outside'),
    ('Dapur', 'kitchen'),
    ('Mesin Cuci', 'washing-machine'),
    ('Parkir Motor', 'motorcycle'),
    ('Parkir Mobil', 'car'),
    ('TV', 'tv'),
    ('Kulkas', 'fridge'),
    ('Kasur', 'bed'),
    ('Meja', 'desk'),
    ('Kursi', 'chair'),
    ('Lemari', 'wardrobe'),
    ('Security', 'security'),
    ('CCTV', 'cctv'),
    ('Pompa Air', 'water-pump'),
    ('Air Panas', 'hot-water');

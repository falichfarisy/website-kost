# Website Kost - Work Plan

## Project Overview

**Project Name**: KOSE - Platform Pencarian Kos  
**Purpose**: Membantu mahasiswa/orang umum menemukan kos terbaik berdasarkan harga dan kualitas  
**Target Users**: Mahasiswa, pekerja muda, masyarakat umum yang mencari kos

---

## Techstack

| Layer | Technology | Justification |
|-------|------------|----------------|
| Frontend | Next.js 16 + TypeScript | SEO-friendly, SSR, existing project |
| Styling | Tailwind CSS v4 | Existing, efficient |
| Backend | Go + Gin Framework | Fast, mobile-ready, low memory |
| ORM | GORM | Popular, well-documented for Go |
| Database | PostgreSQL | Robust, scalable |
| Auth | JWT (access + refresh tokens) | Stateless, mobile-friendly |
| Maps | Google Maps JavaScript API | Industry standard |
| State Management | Zustand + React Query | Lightweight, server state sync |

---

## Database Schema (PostgreSQL)

### 1. Users Table
```sql
CREATE TYPE user_role AS ENUM ('user', 'admin');

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
```

### 2. Kos Table
```sql
CREATE TYPE kos_type AS ENUM ('putra', 'putri', 'campur');
CREATE TYPE source_type AS ENUM ('manual', 'scraped');

CREATE TABLE kos (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    kos_type kos_type NOT NULL,
    price INTEGER NOT NULL,
    price_type VARCHAR(20) DEFAULT 'bulan', -- bulan, tahun
    area DECIMAL(10,2), -- dalam m2
    capacity INTEGER DEFAULT 1,
    available_rooms INTEGER DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    source source_type DEFAULT 'manual',
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Facilities Table
```sql
CREATE TABLE facilities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50)
);

-- Many-to-many: kos_facilities
CREATE TABLE kos_facilities (
    kos_id INTEGER REFERENCES kos(id) ON DELETE CASCADE,
    facility_id INTEGER REFERENCES facilities(id) ON DELETE CASCADE,
    PRIMARY KEY (kos_id, facility_id)
);
```

### 4. Kos Images Table
```sql
CREATE TABLE kos_images (
    id SERIAL PRIMARY KEY,
    kos_id INTEGER REFERENCES kos(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Reviews Table
```sql
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    kos_id INTEGER REFERENCES kos(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(kos_id, user_id) -- one review per user per kos
);
```

### 6. User Favorites Table
```sql
CREATE TABLE favorites (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    kos_id INTEGER REFERENCES kos(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, kos_id)
);
```

### 7. Locations Table (for filtering)
```sql
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    province VARCHAR(100),
    city VARCHAR(100),
    district VARCHAR(100),
    subdistrict VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add location_id to kos table for faster filtering
ALTER TABLE kos ADD COLUMN location_id INTEGER REFERENCES locations(id);
```

### Indexes for Search Performance
```sql
-- Basic search indexes
CREATE INDEX idx_kos_price ON kos(price);
CREATE INDEX idx_kos_type ON kos(kos_type);
CREATE INDEX idx_kos_rating ON kos(rating DESC);
CREATE INDEX idx_kos_location ON kos(location_id);

-- Full-text search
CREATE INDEX idx_kos_search ON kos USING GIN(to_tsvector('indonesian', name || ' ' || address));

-- Composite for filtering
CREATE INDEX idx_kos_filter ON kos(kos_type, price, rating) WHERE available_rooms > 0;
```

---

## API Endpoints (Go Backend)

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new user | Public |
| POST | /api/auth/login | Login user | Public |
| POST | /api/auth/refresh | Refresh access token | JWT |
| POST | /api/auth/logout | Logout user | JWT |

### Kos (Public)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/kos | List kos with filters | Public |
| GET | /api/kos/:id | Get kos detail | Public |
| GET | /api/kos/search | Full-text search | Public |

### Reviews
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/kos/:id/reviews | Get reviews for kos | Public |
| POST | /api/kos/:id/reviews | Add review | JWT |
| PUT | /api/reviews/:id | Update own review | JWT |
| DELETE | /api/reviews/:id | Delete own review | JWT |

### Favorites
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/favorites | Get user's favorites | JWT |
| POST | /api/kos/:id/favorite | Add to favorites | JWT |
| DELETE | /api/kos/:id/favorite | Remove from favorites | JWT |

### Admin - Kos Management
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/admin/kos | Create kos | Admin |
| PUT | /api/admin/kos/:id | Update kos | Admin |
| DELETE | /api/admin/kos/:id | Delete kos | Admin |
| POST | /api/admin/kos/import | Import scraped data | Admin |

### Admin - User Management
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/admin/users | List all users | Admin |
| PUT | /api/admin/users/:id/role | Change user role | Admin |

### Admin - Facilities
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/admin/facilities | List facilities | Admin |
| POST | /api/admin/facilities | Create facility | Admin |
| DELETE | /api/admin/facilities/:id | Delete facility | Admin |

---

## Frontend Pages (Next.js)

### User Portal
1. **Homepage** (`/`)
   - Hero section dengan search bar
   - Featured kos cards
   - Filter sidebar

2. **Search Results** (`/search`)
   - Grid/list view toggle
   - Advanced filters (price range, facilities, type, rating)
   - Google Maps integration
   - Pagination

3. **Kos Detail** (`/kos/[id]`)
   - Image gallery
   - Map location
   - Facilities list
   - Reviews section
   - Contact/booking button

4. **Auth Pages**
   - Login (`/login`)
   - Register (`/register`)

5. **User Dashboard** (`/dashboard`)
   - Profile settings
   - Favorites list
   - Review history

### Admin Portal
1. **Admin Login** (`/admin/login`)
2. **Dashboard** (`/admin`)
   - Stats overview
   - Recent activities
3. **Kos Management** (`/admin/kos`)
   - Table view with CRUD
   - Bulk actions
   - Import from scraping
4. **User Management** (`/admin/users`)
5. **Facilities Management** (`/admin/facilities`)

---

## Implementation Phases

### Phase 1: Backend Foundation (Week 1-2)
- [ ] Setup Go project with Gin
- [ ] Database connection with GORM
- [ ] User authentication (register, login, JWT)
- [ ] Basic CRUD for kos
- [ ] Configuration management (env vars)

### Phase 2: Backend Features (Week 2-3)
- [ ] Kos search with filters
- [ ] Facilities management
- [ ] Reviews system
- [ ] Favorites system
- [ ] Admin role management

### Phase 3: Frontend User (Week 3-5)
- [ ] Setup Next.js with routing
- [ ] API client setup
- [ ] Authentication flow
- [ ] Homepage & search
- [ ] Kos detail page
- [ ] Google Maps integration

### Phase 4: Frontend Admin (Week 5-6)
- [ ] Admin login
- [ ] Kos CRUD admin panel
- [ ] User management
- [ ] Dashboard stats

### Phase 5: Integration & Polish (Week 6-7)
- [ ] End-to-end testing
- [ ] Error handling
- [ ] Performance optimization
- [ ] UI/UX polish

---

## Project Structure

```
website-kost/
├── frontend/                    # Next.js frontend
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (user)/
│   │   │   ├── search/
│   │   │   ├── kos/[id]/
│   │   │   └── dashboard/
│   │   ├── (admin)/
│   │   │   ├── admin/
│   │   │   └── login/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── kos/
│   │   └── map/
│   ├── lib/
│   │   ├── api.ts
│   │   └── store.ts
│   └── public/
│
├── backend/                     # Go backend
│   ├── cmd/
│   │   └── server/
│   ├── internal/
│   │   ├── config/
│   │   ├── handlers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── repositories/
│   │   └── services/
│   ├── pkg/
│   │   └── utils/
│   ├── migrations/
│   └── go.mod
│
└── docs/
    ├── api.md
    └── database.md
```

---

## Environment Variables

### Backend (.env)
```env
# Server
PORT=8080
ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=kose

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRY=24h
REFRESH_TOKEN_EXPIRY=7d

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key
```

---

## Acceptance Criteria

1. **User Registration/Login**: Users can register and login with JWT authentication
2. **Kos Search**: Users can search kos with filters (price, location, facilities, type, rating)
3. **Kos Detail**: Users can view detailed kos information with map location
4. **Favorites**: Users can save favorite kos
5. **Reviews**: Users can leave reviews with ratings
6. **Admin Panel**: Admins can manage kos, users, and facilities
7. **Responsive Design**: Works on mobile and desktop
8. **Google Maps**: Shows kos locations on map

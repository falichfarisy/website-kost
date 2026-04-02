# KOSE - Platform Pencarian Kos

Platform pencarian kos untuk membantu mahasiswa dan masyarakat umum menemukan kos terbaik berdasarkan harga dan kualitas.

## Techstack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 + TypeScript + Tailwind CSS |
| Backend | Go + Gin Framework |
| Database | PostgreSQL + GORM |
| Auth | JWT (access + refresh tokens) |
| Maps | Google Maps JavaScript API |

## Project Structure

```
website-kost/
├── backend/                     # Go backend
│   ├── cmd/server/              # Main entry point
│   ├── internal/
│   │   ├── config/              # Configuration
│   │   ├── handlers/            # HTTP handlers
│   │   ├── middleware/          # Auth, CORS middleware
│   │   ├── models/              # Database models
│   │   └── services/            # Business logic
│   ├── migrations/              # SQL migrations
│   └── .env                     # Environment variables
│
├── frontend/                    # Next.js frontend
│   ├── app/                     # App router pages
│   │   ├── (auth)/              # Auth pages (login, register)
│   │   ├── (user)/              # User pages (search, kos detail, dashboard)
│   │   └── (admin)/             # Admin pages
│   ├── components/              # Reusable components
│   ├── lib/                     # API client, types, store
│   └── .env.local               # Environment variables
│
└── docs/                        # Documentation
```

## Getting Started

### Prerequisites

- Go 1.21+
- Node.js 18+
- PostgreSQL 14+
- Bun atau npm

### 1. Setup Database

```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE kose;

# Atau jalankan migration
\c kose;
\i backend/migrations/001_initial.sql
```

### 2. Setup Backend

```bash
cd backend

# Copy environment variables
cp .env.example .env
# Edit .env sesuai konfigurasi database kamu

# Run server
go run ./cmd/server
```

Backend akan berjalan di `http://localhost:8080`

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local - tambahkan Google Maps API Key

# Run development server
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user baru |
| POST | /api/auth/login | Login |
| POST | /api/auth/refresh | Refresh token |
| GET | /api/auth/me | Get current user |

### Kos (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/kos | List kos dengan filter |
| GET | /api/kos/:id | Detail kos |
| GET | /api/kos/search | Search kos |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/kos/:id/reviews | Get reviews |
| POST | /api/reviews/:id | Add review (auth) |

### Favorites
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/favorites | Get favorites (auth) |
| POST | /api/favorites/:id | Add favorite (auth) |
| DELETE | /api/favorites/:id | Remove favorite (auth) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/admin/kos | Create kos |
| PUT | /api/admin/kos/:id | Update kos |
| DELETE | /api/admin/kos/:id | Delete kos |
| GET | /api/admin/users | List users |
| GET | /api/admin/facilities | List facilities |

## Default Facilities

Setelah setup database, fasilitas berikut sudah tersedia:
- WiFi, AC, Kamar Mandi Dalam, Kamar Mandi Luar
- Dapur, Mesin Cuci, Parkir Motor, Parkir Mobil
- TV, Kulkas, Kasur, Meja, Kursi, Lemari
- Security, CCTV, Pompa Air, Air Panas

## Environment Variables

### Backend (.env)
```env
PORT=8080
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=kose
JWT_SECRET=your-secret-key
JWT_EXPIRY=24h
REFRESH_SECRET=your-refresh-key
REFRESH_TOKEN_EXPIRY=7d
ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key
```

## Deployment

### Development Mode
```bash
# Terminal 1 - Backend
cd backend && go run ./cmd/server

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Production
```bash
# Build backend
cd backend && go build -o kose-server ./cmd/server

# Build frontend
cd frontend && npm run build
```

## License

MIT

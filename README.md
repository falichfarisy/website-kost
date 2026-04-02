# KOSE - Platform Pencarian Kost 🏠

Platform pencarian kost untuk membantu mahasiswa dan masyarakat umum menemukan kost terbaik berdasarkan harga dan kualitas.

**Live Demo:** https://frontend-ten-zeta-45.vercel.app

---

## 🎯 Fitur Utama

### User Features
- **Pencarian Kost** - Filter berdasarkan lokasi, harga, tipe, fasilitas
- **Peta Interaktif** - Google Maps integration untuk lihat lokasi
- **Detail Kost** - Gallery foto, fasilitas, rating, ulasan
- **Favorit** - Simpan kost yang disukai
- **Ulasan & Rating** - Beri rating dan komentar
- **Chat Pemilik** - Langsung chat via floating chat button
- **Dark Mode** - Tema gelap/terang
- **PWA** - Install di HP seperti app native

### Admin Features
- **Dashboard Admin** - Kelola data kost
- **CRUD Kost** - Tambah, edit, hapus kost
- **Manajemen User** - Lihat daftar pengguna

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 + TypeScript + Tailwind CSS 4 |
| State | Zustand + React Query |
| Backend | Go + Gin Framework |
| Database | PostgreSQL + GORM |
| Auth | JWT (access + refresh tokens) |
| Maps | Google Maps JavaScript API |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |

---

## 📁 Project Structure

```
website-kost/
├── backend/                     # Go backend API
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
│   │   ├── (auth)/              # Auth pages
│   │   │   ├── login/           # Login page
│   │   │   └── register/         # Register page
│   │   ├── (user)/              # User pages
│   │   │   ├── kos/[id]/        # Kos detail page
│   │   │   ├── search/           # Search page
│   │   │   ├── dashboard/        # User dashboard
│   │   │   └── favorites/        # Favorites page
│   │   ├── (admin)/             # Admin pages
│   │   │   ├── admin/           # Admin dashboard
│   │   │   └── admin/kos/       # Kos management
│   │   ├── about/               # About page
│   │   ├── articles/            # Articles page
│   │   ├── contact/             # Contact page
│   │   ├── help/                # Help page
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Homepage
│   │   └── globals.css          # Global styles
│   ├── components/              # Reusable components
│   │   ├── Header.tsx           # Header with dark mode
│   │   ├── ThemeToggle.tsx      # Dark mode toggle
│   │   ├── ChatButton.tsx       # Floating chat button
│   │   ├── ChatWindow.tsx       # Chat modal
│   │   ├── ChatLayout.tsx       # Chat container
│   │   └── PWAProvider.tsx      # PWA service worker
│   ├── lib/                     # Utilities
│   │   ├── api.ts               # Axios API client
│   │   ├── store.ts             # Zustand auth store
│   │   ├── theme-store.ts       # Zustand theme store
│   │   ├── chat-store.ts        # Zustand chat store
│   │   └── types.ts             # TypeScript types
│   └── public/                  # Static assets
│       ├── manifest.json        # PWA manifest
│       ├── sw.js                # Service worker
│       └── offline.html         # Offline page
│
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites

- Go 1.21+
- Node.js 18+
- PostgreSQL 14+
- npm atau bun

### 1. Setup Database

```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE kose;

# Jalankan migration
\c kose;
\i backend/migrations/001_initial.sql
```

### 2. Setup Backend

```bash
cd backend

# Copy environment variables
cp .env.example .env

# Edit .env sesuai konfigurasi database kamu
# PORT=8080
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=postgres
# DB_PASSWORD=yourpassword
# DB_NAME=kose

# Run server
go run ./cmd/server
```

Backend berjalan di `http://localhost:8080`

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8080
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Run development server
npm run dev
```

Frontend berjalan di `http://localhost:3000`

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user baru |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh token |
| GET | `/api/auth/me` | Get current user |

### Kos (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/kos` | List kos dengan filter |
| GET | `/api/kos/:id` | Detail kos |
| GET | `/api/kos/search` | Search kos |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/kos/:id/reviews` | Get reviews |
| POST | `/api/reviews/:id` | Add review (auth) |

### Favorites
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/favorites` | Get favorites (auth) |
| POST | `/api/favorites/:id` | Add favorite (auth) |
| DELETE | `/api/favorites/:id` | Remove favorite (auth) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/kos` | Create kos |
| PUT | `/api/admin/kos/:id` | Update kos |
| DELETE | `/api/admin/kos/:id` | Delete kos |
| GET | `/api/admin/users` | List users |
| GET | `/api/admin/facilities` | List facilities |

---

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=8080
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=kose
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRY=24h
REFRESH_SECRET=your-refresh-secret-key
REFRESH_TOKEN_EXPIRY=7d
ALLOWED_ORIGINS=http://localhost:3000,https://frontend-ten-zeta-45.vercel.app
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

---

## 🎨 Default Facilities

Setelah setup database, fasilitas berikut sudah tersedia:

| Kategori | Fasilitas |
|---------|----------|
| Internet | WiFi |
| AC | AC |
| Kamar Mandi | Kamar Mandi Dalam, Kamar Mandi Luar |
| Dapur | Dapur, Mesin Cuci |
| Parkir | Parkir Motor, Parkir Mobil |
| Elektronik | TV, Kulkas |
| Furnitur | Kasur, Meja, Kursi, Lemari |
| Keamanan | Security, CCTV |
| Lainnya | Pompa Air, Air Panas |

---

## 📱 Deployment

### Development Mode
```bash
# Terminal 1 - Backend
cd backend && go run ./cmd/server

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Production - Frontend (Vercel)
```bash
cd frontend

# Install vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
npx vercel

# Deploy to production
npx vercel --prod
```

### Production - Backend
```bash
cd backend

# Build
go build -o kose-server ./cmd/server

# Run
./kose-server
```

---

## 🌟 New Features Guide

### Dark Mode

Dark mode toggle tersedia di header. State disimpan di localStorage (`theme-storage`).

```typescript
// Usage in components
import { useThemeStore } from '@/lib/theme-store';

const { theme, toggleTheme } = useThemeStore();
```

### PWA Installation

1. Buka https://frontend-ten-zeta-45.vercel.app di browser (Chrome/Safari)
2. Di mobile: Tap "Share" → "Add to Home Screen"
3. Di desktop: Click install icon di address bar

Fitur PWA:
- Offline support dengan cached pages
- Installable di desktop & mobile
- Full-screen experience

### Chat Owner

Fitur chat memungkinkan user berkomunikasi dengan pemilik kost:

1. Click floating chat button (右下角)
2. Atau click "Chat Pemilik" di halaman detail kost
3. Kirim pesan - auto-reply simulation aktif

Note: Untuk production, perlu integration dengan real-time chat service (Socket.io, Firebase, dll)

---

## 🔐 Default Admin Account

Setelah setup, buat admin user via endpoint:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@kose.id","password":"admin123","role":"admin"}'
```

---

## 📝 Pages Overview

| Route | Description |
|-------|-------------|
| `/` | Homepage dengan hero, search, fitur |
| `/search` | Pencarian kost dengan filter |
| `/kos/[id]` | Detail kost, galeri, review, chat |
| `/login` | Halaman login |
| `/register` | Halaman registrasi |
| `/dashboard` | Dashboard user (favorites, profile) |
| `/favorites` | Daftar kost favorit |
| `/about` | Tentang KOSE |
| `/contact` | Halaman kontak |
| `/articles` | Artikel & tips cari kost |
| `/help` | Pusat bantuan |
| `/admin` | Dashboard admin |
| `/admin/kos` | Manajemen kost (admin only) |

---

## 🧪 Tech Details

### State Management
- **Zustand** - Lightweight state management
- **React Query** - Server state & caching
- **LocalStorage** - Persist theme & auth

### Forms
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Styling
- **Tailwind CSS 4** - Utility-first CSS
- **CSS Variables** - Theme colors
- **Dark Mode** - CSS class-based

### Icons
- **Lucide React** - Consistent icon set

---

## 📄 License

MIT License - Bebas digunakan untuk project apapun.

---

Built with ❤️ for Indonesian students and workers looking for their perfect kost.

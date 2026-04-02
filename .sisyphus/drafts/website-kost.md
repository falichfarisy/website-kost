# Draft: Website Pencarian Kos

## Requirements (confirmed)
- [Kebutuhan utama]: Platform pencarian kos untuk mahasiswa/orang umum
- [Target pengguna]: Mahasiswa dan masyarakat umum yang mencari kos
- [Tujuan utama]: Membantu user menemukan kos terbaik dari harga dan kualitas

## Current Project State
- Frontend framework: Next.js 16.1.1
- React: 19.2.3
- Styling: Tailwind CSS v4
- Language: TypeScript
- Existing components: Headers, SearchIcon, ResultCard

## Techstack Decisions (confirmed)
- **Backend**: Go (Golang) - karena akan diintegrasikan dengan mobile
- **Database**: PostgreSQL - belum ada, perlu setup dari awal
- **Frontend**: Next.js (existing) dengan TypeScript
- **Data Source**: 
  - Scraping dari website lain
  - Input manual oleh admin
- **Authentication**: Login dan Register (user)
- **Maps**: Google Maps integration
- **Admin Panel**: Halaman admin terpisah

## Filter Features Confirmed
- Filter by: harga, lokasi, fasilitas, tipe kos (putra/putri), rating

## Open Questions
- [Deployment]: Belum terpikirkan - perlu brainstorm
- [Scraping]: Website target apa untuk scraping? Atau perlu research?
- [Admin features]: Apa saja fitur untuk halaman admin? (CRUD kos, manage users, view analytics?)
- [User features]: Apa saja untuk user biasa? (search, favorite, comparison?)
- [Google Maps API]: Apakah sudah ada Google Cloud project/API key?

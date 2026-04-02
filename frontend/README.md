# Frontend Documentation

Dokumentasi khusus untuk frontend KOSE.

## 📦 Dependencies

### Core
```json
{
  "next": "16.1.1",
  "react": "19.2.3",
  "react-dom": "19.2.3"
}
```

### State & Data Fetching
```json
{
  "@tanstack/react-query": "^5.96.1",
  "zustand": "^5.0.12"
}
```

### Forms & Validation
```json
{
  "react-hook-form": "^7.72.0",
  "@hookform/resolvers": "^5.2.2",
  "zod": "^4.3.6"
}
```

### UI & Icons
```json
{
  "lucide-react": "latest",
  "tailwindcss": "^4"
}
```

### HTTP Client
```json
{
  "axios": "^1.14.0"
}
```

---

## 🏗️ Component Architecture

### Layout Components

#### `layout.tsx`
Root layout dengan metadata, PWA support, dan ChatLayout.

```tsx
export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <Providers>
          <PWAProvider />
          {children}
          <ChatLayout />
        </Providers>
      </body>
    </html>
  );
}
```

#### `providers.tsx`
Client-side providers untuk React Query dan Theme.

```tsx
export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### UI Components

#### `Header.tsx`
Navigation header dengan:
- Logo KOSE
- Navigation links
- Theme toggle
- Auth state (login/logout/user)
- Mobile responsive menu

#### `ThemeToggle.tsx`
Dark mode toggle button.

```tsx
export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  
  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? <Moon /> : <Sun />}
    </button>
  );
}
```

#### `ChatButton.tsx`
Floating chat button (fixed position, bottom-right).

#### `ChatWindow.tsx`
Chat modal dengan:
- Header dengan owner info
- Message list
- Input field
- Auto-reply simulation

#### `ChatLayout.tsx`
Container untuk ChatButton dan ChatWindow.

#### `PWAProvider.tsx`
Registers service worker untuk PWA functionality.

---

## 📚 Store Architecture

### `lib/store.ts` - Auth Store
```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user, accessToken, refreshToken) => void;
  logout: () => void;
}
```

### `lib/theme-store.ts` - Theme Store
```typescript
interface ThemeState {
  theme: 'light' | 'dark';
  setTheme: (theme) => void;
  toggleTheme: () => void;
}
```

### `lib/chat-store.ts` - Chat Store
```typescript
interface ChatState {
  isOpen: boolean;
  activeKosId: string | null;
  activeKosName: string | null;
  ownerName: string | null;
  messages: Message[];
  unreadCount: number;
  openChat: (kosId, kosName, ownerName?) => void;
  closeChat: () => void;
  sendMessage: (text) => void;
  markAsRead: () => void;
}
```

---

## 🎨 Styling Guide

### Color Palette
```css
--color-primary: #011E55;      /* Dark blue - main brand */
--color-primary-light: #0a2d6e; /* Lighter blue - hover states */
```

### Dark Mode Classes
```tsx
// Text
text-gray-900 dark:text-gray-100

// Backgrounds
bg-gray-50 dark:bg-gray-900
bg-white dark:bg-gray-800

// Borders
border-gray-200 dark:border-gray-700

// Custom styling
dark:bg-gray-800/50  // Semi-transparent
```

### Animations
```css
.animate-float         // Floating animation
.animate-float-delayed // Delayed float
.animate-slide-up      // Slide up entrance
.animate-slide-in-right // Slide in from right
```

---

## 🔌 API Client

### `lib/api.ts`
Axios instance dengan interceptors.

```typescript
import api from '@/lib/api';

// Request interceptor adds auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor handles token refresh
```

### Usage Examples
```typescript
// GET request
const { data } = await api.get('/kos');

// POST request
await api.post('/auth/login', { email, password });

// Auth header auto-added from localStorage
```

---

## 📱 PWA Setup

### manifest.json
```json
{
  "name": "KOSE - Platform Pencarian Kost",
  "short_name": "KOSE",
  "display": "standalone",
  "theme_color": "#011E55",
  "background_color": "#011E55",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192" },
    { "src": "/icon-512.png", "sizes": "512x512" }
  ]
}
```

### Service Worker (sw.js)
- Caches static assets
- Offline fallback page
- Network-first strategy for API

### offline.html
Fallback page saat offline.

---

## 🌙 Dark Mode Implementation

### 1. Theme Store
State di localStorage, apply class ke `<html>`.

### 2. CSS Classes
Gunakan Tailwind dark mode variant:
```tsx
<div className="bg-white dark:bg-gray-800">
  <h1 className="text-gray-900 dark:text-white">
    Hello
  </h1>
</div>
```

### 3. Hydration Handling
```tsx
<html lang="id" suppressHydrationWarning>
```
Prevents hydration mismatch karena server render vs client.

---

## 📝 Form Validation

### Login Schema
```typescript
const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});
```

### Register Schema
```typescript
const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});
```

---

## 🚀 Deployment to Vercel

### Automatic Deploy
1. Push ke GitHub
2. Vercel auto-detects Next.js
3. Builds and deploys

### Manual Deploy
```bash
cd frontend
npx vercel --prod
```

### Environment Variables di Vercel
Set via Dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key
```

---

## 📂 Route Groups

### `(auth)`
- `/login` - Login page
- `/register` - Register page

### `(user)`
- `/` - Homepage
- `/search` - Search page
- `/kos/[id]` - Kos detail
- `/dashboard` - User dashboard
- `/favorites` - Favorites page

### `(admin)`
- `/admin` - Admin dashboard
- `/admin/kos` - Kos management

### Public Pages
- `/about` - About page
- `/contact` - Contact page
- `/articles` - Articles page
- `/help` - Help page

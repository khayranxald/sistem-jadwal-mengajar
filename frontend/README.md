# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# 🎓 Sistem Rekomendasi Penjadwalan Mengajar - Frontend

## 📌 Deskripsi
Frontend web application untuk sistem rekomendasi penjadwalan mengajar guru SMA/SMK yang dibangun dengan React.js, Vite, dan TailwindCSS.

## 🛠 Teknologi yang Digunakan
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📂 Struktur Folder
```
frontend/
├── src/
│   ├── api/              # API configuration & endpoints
│   ├── components/       # Reusable components
│   │   ├── layout/       # Layout components (Navbar, Sidebar)
│   │   └── ui/           # UI components (Button, Input, Card)
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   │   ├── auth/         # Authentication pages
│   │   ├── admin/        # Admin pages
│   │   ├── guru/         # Guru pages
│   │   └── kepsek/       # Kepala Sekolah pages
│   ├── stores/           # Zustand stores
│   ├── router/           # React Router configuration
│   ├── styles/           # Global styles
│   └── main.jsx          # Entry point
├── public/               # Static assets
└── package.json          # Dependencies
```

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js >= 18.x
- npm atau yarn

### Installation
```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev

# Build untuk production
npm run build

# Preview production build
npm run preview
```

## 🎨 Fitur
- ✅ Dark Mode Toggle
- ✅ Responsive Design (Mobile-first)
- ✅ Modern UI dengan Animations
- ✅ Protected Routes berdasarkan Role
- ✅ Global State Management
- ✅ API Integration dengan Axios

## 👥 Role Pengguna
1. **Admin** - Mengelola data master (guru, mapel, kelas, jam)
2. **Guru** - Melihat jadwal mengajar & mengatur ketersediaan
3. **Kepala Sekolah** - Monitoring & laporan

## 📅 Development Timeline

### ✅ Minggu 1 - Setup Project (Selesai)
- [x] Setup React + Vite
- [x] Install TailwindCSS & dependencies
- [x] Konfigurasi routing
- [x] Dark mode implementation
- [x] UI components dasar
- [x] Layout & navigation

### 📋 Minggu 2 - Authentication (Next)
- [ ] Login UI implementation
- [ ] API integration untuk login
- [ ] Protected routes
- [ ] Role-based access control

### 📋 Minggu 3 - CRUD Data Master
- [ ] Guru management
- [ ] Mata pelajaran
- [ ] Kelas
- [ ] Jam pelajaran
- [ ] Ketersediaan guru

### 📋 Minggu 4-8
- Algoritma penjadwalan
- Kalender UI
- Export PDF
- Testing & deployment

## 🔗 API Endpoints
Base URL: `http://localhost:8000/api`

### Health Check
```
GET /health
```

### Authentication (Minggu 2)
```
POST /auth/login
POST /auth/logout
GET /user
```

## 🎨 Color Palette
- **Primary**: Blue (#3b82f6)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)

## 📝 Environment Variables
Buat file `.env` di root folder:
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Sistem Jadwal Mengajar
```

## 👨‍💻 Author
Developed as part of weekly project development

## 📄 License
Private Project

---
**Status**: 🚧 In Development - Minggu 1 Complete
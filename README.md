# 📚 Sistem Jadwal Mengajar

Sistem Jadwal Mengajar adalah aplikasi berbasis web yang digunakan untuk mengelola jadwal mengajar guru secara terstruktur, efisien, dan terintegrasi antara **backend Laravel** dan **frontend modern (Vite + React + Tailwind CSS)**.

Project ini dirancang untuk membantu sekolah dalam:
- Mengatur jadwal pelajaran
- Mengelola ketersediaan guru
- Menghindari bentrok jadwal
- Menyediakan dashboard untuk admin dan guru

---

## 🚀 Fitur Utama

### 👤 Manajemen Pengguna
- Login & autentikasi (Admin & Guru)
- Manajemen profil pengguna
- Role & hak akses berbasis akun

### 🧑‍🏫 Guru
- Manajemen data guru
- Input ketersediaan waktu mengajar
- Dashboard guru

### 📅 Jadwal Mengajar
- Penyusunan jadwal otomatis/manual
- Manajemen jam pelajaran
- Manajemen kelas & mata pelajaran
- Validasi bentrok jadwal

### 📤 Export & Notifikasi
- Export jadwal ke **PDF**
- Sistem notifikasi jadwal
- Pencarian data jadwal

---

## 🛠️ Teknologi yang Digunakan

### Backend
- **Laravel**
- PHP 8+
- MySQL
- REST API
- Laravel Sanctum (Auth)
- PHPUnit (Testing)

### Frontend
- **React (Vite)**
- Tailwind CSS
- Axios
- ESLint

---

## 📁 Struktur Folder

Sistem Jadwal Mengajar
├── backend
│ ├── app
│ │ ├── Http
│ │ │ ├── Controllers
│ │ │ ├── Middleware
│ │ ├── Models
│ │ ├── Services
│ │ └── Helpers
│ ├── routes
│ │ ├── api.php
│ │ └── web.php
│ ├── database
│ │ ├── migrations
│ │ └── seeders
│ ├── tests
│ └── docs
│ ├── TESTING_GUIDE.md
│ └── SECURITY_TESTING.md
│
├── frontend
│ ├── src
│ │ ├── components
│ │ ├── pages
│ │ ├── services
│ │ └── App.jsx
│ ├── index.html
│ ├── vite.config.js
│ └── tailwind.config.js
│
└── README.md

yaml
Copy code

---

## ⚙️ Instalasi & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/username/sistem-jadwal-mengajar.git
cd sistem-jadwal-mengajar
2️⃣ Setup Backend (Laravel)
bash
Copy code
cd backend
composer install
cp .env.example .env
php artisan key:generate
Atur database di .env, lalu:

bash
Copy code
php artisan migrate --seed
php artisan serve
Backend berjalan di:

cpp
Copy code
http://127.0.0.1:8000
3️⃣ Setup Frontend (Vite + React)
bash
Copy code
cd frontend
npm install
npm run dev
Frontend berjalan di:

arduino
Copy code
http://localhost:5173
🧪 Testing
Menjalankan test backend:

bash
Copy code
cd backend
php artisan test
🔐 Role & Hak Akses
Role	Hak Akses
Admin	Kelola guru, jadwal, kelas, mapel, export
Guru	Lihat jadwal, atur ketersediaan

📌 Catatan Penting
Project ini menggunakan REST API

Frontend & backend dipisah

Direkomendasikan menggunakan LF line ending untuk kompatibilitas server Linux

🤝 Kontribusi
Kontribusi sangat terbuka.
Silakan lakukan:

Fork repository

Buat branch baru

Commit perubahan

Pull Request

📄 Lisensi
Project ini bersifat open-source dan digunakan untuk kebutuhan pembelajaran dan pengembangan sistem akademik.

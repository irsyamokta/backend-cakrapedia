# 📦 Backend CakraPedia

Ini adalah proyek backend untuk aplikasi **CakraPedia**, dibangun menggunakan **Node.js**, **Express.js**, dan **Prisma ORM**.

## 🚀 Fitur Utama

- 🔐 Autentikasi & otorisasi (JWT)
- 👤 Manajemen pengguna
- 📰 Manajemen berita & aksi berita
- 🔄 Reset password
- 📁 Upload file (multer)
- 🧠 Struktur modular (controllers, services, routes, dll)

---

## 🛠️ Teknologi

- Node.js
- Express.js
- Prisma ORM
- MySQL 
- Multer (upload file)
- Docker

---

## 📁 Struktur Direktori

```bash
.
├── prisma/                  # Skema & migration Prisma
├── src/
│   ├── config/             # Konfigurasi (DB, multer)
│   ├── controllers/        # Logic controller
│   ├── middlewares/        # Middleware (auth, error handler, dsb)
│   ├── repositories/       # Query ke database
│   ├── routes/             # Routing endpoint API
│   ├── services/           # Bisnis logic
│   └── utils/              # Helper & utilitas
├── .env                    # Variabel environment
├── Dockerfile              # Konfigurasi container
├── server.js               # Entry point aplikasi
├── package.json
└── README.md

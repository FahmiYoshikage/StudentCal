# 🎓 StudenCal - Modern Student Calendar & Productivity App

<div align="center">

![StudenCal](https://img.shields.io/badge/StudenCal-v2.0.0-purple?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**Aplikasi manajemen akademik & produktivitas dengan Modern Web3 Gaming Aesthetic**

[Features](#-features) • [Prerequisites](#-prerequisites) • [Installation](#-installation) • [Configuration](#-configuration) • [Running](#-running-the-application) • [Documentation](#-documentation)

</div>

---

## 📋 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Prerequisites](#-prerequisites)
4. [Installation](#-installation)
5. [Configuration](#-configuration)
    - [MongoDB Atlas Setup](#1-mongodb-atlas-setup)
    - [Google OAuth Setup](#2-google-oauth-20-credentials-setup)
    - [Environment Variables](#3-environment-variables-setup)
6. [Database Initialization](#-database-initialization)
7. [Running the Application](#-running-the-application)
8. [Project Structure](#-project-structure)
9. [API Documentation](#-api-documentation)
10. [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### 📚 Academic Management

-   ✅ **Course Management** - Kelola mata kuliah dengan recurring sync
-   ✅ **Task Management** - To-do list dengan subtasks & priorities
-   ✅ **Grade Tracker** - Tracking nilai dengan weighted GPA calculation
-   ✅ **Exam Planner** - Jadwal ujian dengan countdown timer
-   ✅ **Google Calendar Integration** - Full sync dengan Google Calendar

### 💰 Financial Tracking

-   ✅ **Income/Expense Tracking** - Catat pemasukan & pengeluaran
-   ✅ **Category Breakdown** - Analisis per kategori
-   ✅ **Monthly/Yearly Summary** - Laporan keuangan periode
-   ✅ **Transaction History** - Riwayat lengkap transaksi

### 🎯 Personal Development

-   ✅ **Habit Tracker** - Tracking kebiasaan harian
-   ✅ **Progress Visualization** - Visualisasi progress dengan chart
-   ✅ **Streak Calculation** - Hitung streak konsistensi
-   ✅ **Custom Icons & Colors** - Personalisasi habit

### ⚡ Productivity Tools

-   ✅ **Pomodoro Timer** - Timer fokus 25 menit
-   ✅ **Today's Focus Widget** - Tugas prioritas hari ini
-   ✅ **Upcoming Exams Widget** - Ujian yang akan datang
-   ✅ **Statistics Dashboard** - Overview semua aktivitas

### 🎨 Design Features

-   ✅ **Modern Web3 Aesthetic** - Purple/pink gradient theme
-   ✅ **Glass Morphism** - Frosted glass effects
-   ✅ **Smooth Animations** - 60fps transitions
-   ✅ **Responsive Design** - Mobile, tablet, desktop
-   ✅ **Dark Theme Optimized** - Eye-friendly dark mode

---

## 🛠 Tech Stack

### Backend

-   **Node.js** - Runtime environment
-   **Express.js** - Web framework
-   **MongoDB** - NoSQL database
-   **Passport.js** - Authentication middleware
-   **Google APIs** - Calendar integration

### Frontend

-   **React 19** - UI library
-   **Vite** - Build tool
-   **Tailwind CSS** - Utility-first CSS
-   **FullCalendar** - Calendar component
-   **Axios** - HTTP client

---

## 📦 Prerequisites

Sebelum memulai, pastikan Anda sudah menginstall:

### Required Software

1. **Node.js** (v18 atau lebih baru)

    ```bash
    # Check version
    node --version  # Should be v18.x.x or higher
    npm --version   # Should be 9.x.x or higher
    ```

    📥 Download: https://nodejs.org/

2. **Git**

    ```bash
    # Check version
    git --version
    ```

    📥 Download: https://git-scm.com/

3. **Text Editor/IDE**

    - VS Code (Recommended)
    - WebStorm
    - Atom

    📥 VS Code: https://code.visualstudio.com/

### Required Accounts

4. **MongoDB Atlas Account** (Recommended - GRATIS)

    - Untuk database online
    - Tidak perlu install MongoDB lokal
    - 📝 Panduan lengkap ada di bagian [Configuration](#-configuration)

    🔗 Sign up: https://www.mongodb.com/cloud/atlas/register

5. **Google Cloud Account** (GRATIS)

    - Untuk Google OAuth & Calendar API
    - Perlu credit card untuk verifikasi (tidak dicharge)
    - 📝 Panduan lengkap ada di bagian [Configuration](#-configuration)

    🔗 Sign up: https://console.cloud.google.com/

---

## 📥 Installation

### 1. Clone Repository

```bash
# Clone project
git clone https://github.com/FahmiYoshikage/StudentCal.git
cd StudentCal
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

**Dependencies yang akan diinstall:**

-   express - Web framework
-   mongoose - MongoDB ODM
-   passport & passport-google-oauth20 - Authentication
-   express-session & connect-mongo - Session management
-   googleapis - Google Calendar API
-   dotenv - Environment variables
-   cors - Cross-Origin Resource Sharing
-   nodemon (dev) - Auto-restart server

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

**Dependencies yang akan diinstall:**

-   react & react-dom - UI library
-   react-router-dom - Routing
-   axios - HTTP client
-   @fullcalendar/\* - Calendar components
-   tailwindcss - CSS framework
-   vite - Build tool

---

## ⚙️ Configuration

### 1. MongoDB Atlas Setup

#### Kenapa MongoDB Atlas?

✅ **GRATIS** untuk 512MB storage
✅ **Tidak perlu install** MongoDB lokal
✅ **Auto backup** & high availability
✅ **Accessible from anywhere** - tidak terbatas localhost
✅ **Production-ready** - langsung bisa deploy

#### Langkah-langkah Setup:

**Step 1: Buat Account & Cluster**

1. Buka https://www.mongodb.com/cloud/atlas/register
2. Sign up dengan Google/Email
3. Setelah login, klik **"Build a Database"**
4. Pilih **"M0 FREE"** tier
    - Provider: **AWS** (atau yang terdekat)
    - Region: **Singapore** (ap-southeast-1) untuk Asia
    - Cluster Name: **studentcal** (atau bebas)
5. Klik **"Create"**

**Step 2: Setup Database Access**

1. Di sidebar kiri, klik **"Database Access"**
2. Klik **"Add New Database User"**
3. Pilih **"Password"** authentication
4. Username: `studentcal_admin` (atau bebas)
5. Password: Klik **"Autogenerate Secure Password"**
    - ⚠️ **SIMPAN PASSWORD INI!** Copy ke notepad
6. Database User Privileges: **"Atlas admin"**
7. Klik **"Add User"**

**Step 3: Setup Network Access**

1. Di sidebar kiri, klik **"Network Access"**
2. Klik **"Add IP Address"**
3. Untuk development, pilih **"Allow Access from Anywhere"**
    - IP: `0.0.0.0/0`
    - ⚠️ **Note**: Untuk production, gunakan IP spesifik
4. Klik **"Confirm"**

**Step 4: Get Connection String**

1. Kembali ke **"Database"** (sidebar kiri)
2. Di cluster Anda, klik tombol **"Connect"**
3. Pilih **"Connect your application"**
4. Driver: **Node.js** version **5.5 or later**
5. Copy connection string, contoh:
    ```
    mongodb+srv://studentcal_admin:<password>@studentcal.xxxxx.mongodb.net/?retryWrites=true&w=majority
    ```
6. **Replace `<password>`** dengan password yang Anda simpan tadi
7. **Tambahkan database name** sebelum `?`, contoh:
    ```
    mongodb+srv://studentcal_admin:YourPassword123@studentcal.xxxxx.mongodb.net/studencal?retryWrites=true&w=majority
    ```

✅ **Connection string Anda sudah siap!**

---

### 2. Google OAuth 2.0 Credentials Setup

#### Kenapa Perlu Google OAuth?

-   Login dengan akun Google (tanpa password)
-   Akses Google Calendar untuk sync otomatis
-   Secure authentication

#### Langkah-langkah Setup:

**Step 1: Buat Google Cloud Project**

1. Buka https://console.cloud.google.com/
2. Login dengan akun Google Anda
3. Klik dropdown project di navbar atas
4. Klik **"New Project"**
5. Project name: **StudenCal**
6. Location: **No organization** (atau sesuai kebutuhan)
7. Klik **"Create"**

**Step 2: Enable APIs**

1. Di dashboard, cari **"APIs & Services"** di sidebar
2. Klik **"Enable APIs and Services"**
3. Cari dan enable API berikut:

    **a) Google Calendar API**

    - Search: "Google Calendar API"
    - Klik, lalu klik **"Enable"**

    **b) Google+ API** (untuk OAuth)

    - Search: "Google+ API"
    - Klik, lalu klik **"Enable"**

**Step 3: Configure OAuth Consent Screen**

1. Di sidebar, **"APIs & Services"** > **"OAuth consent screen"**
2. User Type: Pilih **"External"**
3. Klik **"Create"**
4. Isi form:
    - App name: **StudenCal**
    - User support email: **email Anda**
    - Developer contact: **email Anda**
5. Klik **"Save and Continue"**
6. **Scopes**: Klik **"Add or Remove Scopes"**
    - Cari dan centang:
        - `userinfo.email`
        - `userinfo.profile`
        - `calendar.events`
    - Klik **"Update"**
    - Klik **"Save and Continue"**
7. **Test users**: Klik **"Add Users"**
    - Tambahkan email Anda (untuk testing)
    - Klik **"Save and Continue"**
8. **Summary**: Review dan klik **"Back to Dashboard"**

**Step 4: Create OAuth Credentials**

1. Di sidebar, **"APIs & Services"** > **"Credentials"**
2. Klik **"Create Credentials"** > **"OAuth client ID"**
3. Application type: **"Web application"**
4. Name: **StudenCal Web Client**
5. **Authorized JavaScript origins**:
    - Klik **"Add URI"**
    - Development: `http://localhost:5000`
    - Production: `https://yourdomain.com` (nanti)
6. **Authorized redirect URIs**:
    - Klik **"Add URI"**
    - Development: `http://localhost:5000/auth/google/callback`
    - Production: `https://yourdomain.com/auth/google/callback` (nanti)
7. Klik **"Create"**

**Step 5: Save Credentials**

1. Modal popup akan muncul dengan:
    - **Client ID**: `xxxxx.apps.googleusercontent.com`
    - **Client Secret**: `GOCSPX-xxxxxx`
2. ⚠️ **SIMPAN KEDUANYA!** Copy ke notepad
3. Anda juga bisa download JSON atau lihat lagi di halaman Credentials

✅ **Google OAuth credentials Anda sudah siap!**

---

### 3. Environment Variables Setup

**Step 1: Create Backend .env file**

```bash
cd backend
cp .env.example .env
```

**Step 2: Edit .env file**

Buka `backend/.env` dan isi dengan data Anda:

```bash
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# MongoDB Atlas
MONGODB_URI=mongodb+srv://studentcal_admin:YourPassword123@studentcal.xxxxx.mongodb.net/studencal?retryWrites=true&w=majority

# Google OAuth 2.0
GOOGLE_CLIENT_ID=123456789-abcdefghijk.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ
REDIRECT_URI=http://localhost:5000/auth/google/callback

# Security (Generate random 32 character strings)
SESSION_SECRET=your_random_32_character_string_here
ENCRYPTION_KEY=another_random_32_character_string
```

**Step 3: Generate Security Keys**

Generate random string untuk `SESSION_SECRET` dan `ENCRYPTION_KEY`:

```bash
# Method 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Method 2: Using OpenSSL (Linux/Mac)
openssl rand -hex 32

# Method 3: Online generator
# Visit: https://www.random.org/strings/
```

Copy hasil generate dan paste ke `.env`:

```bash
SESSION_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
ENCRYPTION_KEY=z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4
```

**Step 4: Verifikasi .env**

Pastikan semua variable sudah diisi dengan benar:

-   ✅ `MONGODB_URI` - Connection string dari MongoDB Atlas
-   ✅ `GOOGLE_CLIENT_ID` - Client ID dari Google Cloud
-   ✅ `GOOGLE_CLIENT_SECRET` - Client Secret dari Google Cloud
-   ✅ `SESSION_SECRET` - Random 32 character string
-   ✅ `ENCRYPTION_KEY` - Random 32 character string (berbeda dari SESSION_SECRET)

⚠️ **PENTING**:

-   Jangan commit file `.env` ke Git!
-   File `.env` sudah ada di `.gitignore`
-   Untuk production, gunakan environment variables di hosting platform

---

## 🗄️ Database Initialization

Setelah MongoDB Atlas terkonfigurasi, jalankan script setup:

### 1. Setup Database Indexes

Script ini akan membuat indexes untuk performa query yang optimal:

```bash
cd backend
node scripts/setupIndexes.js
```

**Apa yang dilakukan:**

-   ✅ Membuat indexes untuk User collection (email, googleId)
-   ✅ Membuat indexes untuk Course collection (userId, scheduleDay)
-   ✅ Membuat indexes untuk Task collection (userId, dueDate, status)
-   ✅ Membuat indexes untuk Exam collection (userId, date)
-   ✅ Membuat indexes untuk Grade collection (userId, courseId)
-   ✅ Membuat indexes untuk Transaction collection (userId, date)
-   ✅ Membuat indexes untuk Habit collection (userId)
-   ✅ Membuat indexes untuk HabitLog collection (habitId, date)

**Output yang diharapkan:**

```
✅ Connected to MongoDB Atlas
✅ Setting up indexes...
✅ User indexes created
✅ Course indexes created
✅ Task indexes created
✅ Exam indexes created
✅ Grade indexes created
✅ Transaction indexes created
✅ Habit indexes created
✅ HabitLog indexes created
✅ All indexes created successfully!
```

### 2. (Optional) Seed Sample Data

Untuk development/testing, Anda bisa populate database dengan sample data:

```bash
node scripts/seedData.js
```

**Apa yang dilakukan:**

-   ✅ Membuat sample user
-   ✅ Membuat sample courses
-   ✅ Membuat sample tasks
-   ✅ Membuat sample exams
-   ✅ Membuat sample grades
-   ✅ Membuat sample transactions
-   ✅ Membuat sample habits

⚠️ **Note**: Jangan jalankan di production! Hanya untuk development.

---

## 🚀 Running the Application

### Development Mode

Jalankan backend dan frontend secara terpisah untuk development:

#### Terminal 1 - Backend Server

```bash
cd backend
npm run dev
```

**Output yang diharapkan:**

```
[nodemon] starting `node server.js`
✅ Server running on port 5000
✅ Connected to MongoDB Atlas
✅ Environment: development
✅ Frontend URL: http://localhost:3000
```

Server akan auto-restart setiap ada perubahan code (hot reload).

#### Terminal 2 - Frontend Dev Server

```bash
cd frontend
npm run dev
```

**Output yang diharapkan:**

```
  VITE v5.0.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
  ➜  press h + enter to show help
```

Frontend akan auto-reload setiap ada perubahan code (hot reload).

### Access the Application

1. Buka browser: **http://localhost:3000**
2. Klik **"Login with Google"**
3. Pilih akun Google yang sudah Anda tambahkan sebagai test user
4. Authorize aplikasi
5. ✅ Anda akan redirect ke Dashboard!

---

## 📁 Project Structure

```
studentcal/
│
├── backend/                    # Backend API
│   ├── config/                 # Configuration files
│   │   ├── constants.js        # App constants
│   │   ├── database.js         # MongoDB connection
│   │   └── passport.js         # Google OAuth config
│   │
│   ├── middleware/             # Express middleware
│   │   ├── auth.js             # Authentication middleware
│   │   ├── errorHandler.js     # Error handling
│   │   └── rateLimiter.js      # API rate limiting
│   │
│   ├── models/                 # Mongoose models
│   │   ├── User.js             # User schema
│   │   ├── Course.js           # Course schema
│   │   ├── Task.js             # Task schema
│   │   ├── Exam.js             # Exam schema
│   │   ├── Grade.js            # Grade schema
│   │   ├── Transaction.js      # Transaction schema
│   │   ├── Habit.js            # Habit schema
│   │   └── HabitLog.js         # Daily habit log schema
│   │
│   ├── routes/                 # API routes
│   │   ├── calendar.js         # Google Calendar sync
│   │   ├── courses.js          # Course CRUD
│   │   ├── events.js           # Event CRUD
│   │   ├── exams.js            # Exam CRUD
│   │   ├── grades.js           # Grade CRUD
│   │   ├── habits.js           # Habit tracking
│   │   ├── tasks.js            # Task CRUD
│   │   └── transactions.js     # Finance tracking
│   │
│   ├── scripts/                # Utility scripts
│   │   ├── setupIndexes.js     # 🔧 Setup DB indexes
│   │   ├── seedData.js         # 🌱 Seed sample data
│   │   ├── backup.js           # 💾 Backup database
│   │   └── restore.js          # ♻️ Restore database
│   │
│   ├── utils/                  # Helper utilities
│   │   ├── encryption.js       # Data encryption
│   │   ├── googleCalendar.js   # Calendar API helper
│   │   └── validators.js       # Input validation
│   │
│   ├── .env.example            # Environment template
│   ├── .env                    # 🔐 Your config (create this!)
│   ├── package.json            # Dependencies
│   └── server.js               # Entry point
│
├── frontend/                   # Frontend React app
│   ├── public/                 # Static files
│   │   ├── index.html          # HTML template
│   │   ├── manifest.json       # PWA manifest
│   │   └── robots.txt          # SEO robots
│   │
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── forms/          # Form components
│   │   │   ├── layout/         # Layout components
│   │   │   ├── pages/          # Page components
│   │   │   ├── shared/         # Reusable UI
│   │   │   └── widgets/        # Dashboard widgets
│   │   │
│   │   ├── contexts/           # React contexts
│   │   │   ├── AuthContext.js      # Auth state
│   │   │   ├── NotificationContext.js # Notifications
│   │   │   └── ThemeContext.js     # Theme state
│   │   │
│   │   ├── hooks/              # Custom hooks
│   │   │   ├── useAuth.js          # Auth hook
│   │   │   ├── useFetch.js         # Data fetching
│   │   │   ├── useDebounce.js      # Debounce hook
│   │   │   └── useLocalStorage.js  # LocalStorage hook
│   │   │
│   │   ├── services/           # API services
│   │   │   ├── api.js              # Axios instance
│   │   │   ├── authService.js      # Auth API
│   │   │   ├── coursesService.js   # Courses API
│   │   │   ├── examsService.js     # Exams API
│   │   │   ├── financeService.js   # Finance API
│   │   │   ├── gradesService.js    # Grades API
│   │   │   ├── habitsService.js    # Habits API
│   │   │   └── tasksService.js     # Tasks API
│   │   │
│   │   ├── styles/             # Global styles
│   │   │   ├── animations.css      # Custom animations
│   │   │   ├── modern-animations.css # Web3 animations
│   │   │   ├── tailwind.css        # Tailwind utilities
│   │   │   └── variables.css       # CSS variables
│   │   │
│   │   ├── utils/              # Helper utilities
│   │   │   ├── constants.js        # Frontend constants
│   │   │   ├── formatters.js       # Data formatters
│   │   │   ├── helpers.js          # Helper functions
│   │   │   └── validators.js       # Input validation
│   │   │
│   │   ├── App.jsx             # Root component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global CSS
│   │
│   ├── .eslintrc.js            # ESLint config
│   ├── tailwind.config.js      # Tailwind config
│   ├── vite.config.js          # Vite config
│   └── package.json            # Dependencies
│
├── docs/                       # Documentation
│   └── (API documentation, guides, etc.)
│
└── README.md                   # 📖 This file!
```

---

## 📚 API Documentation

### Base URL

```
Development: http://localhost:5000/api
Production: https://yourdomain.com/api
```

### Authentication

#### Login with Google

```http
GET /auth/google
```

Redirect user ke Google OAuth consent screen.

#### Google Callback

```http
GET /auth/google/callback
```

Callback URL setelah Google authentication berhasil.

#### Get Current User

```http
GET /auth/user
```

Response:

```json
{
    "id": "user_id",
    "email": "user@gmail.com",
    "name": "John Doe",
    "picture": "https://...",
    "googleId": "google_user_id"
}
```

#### Logout

```http
POST /auth/logout
```

### Courses API

#### Get All Courses

```http
GET /api/courses
```

#### Create Course

```http
POST /api/courses
Content-Type: application/json

{
  "name": "Data Structures",
  "code": "CS201",
  "instructor": "Dr. Smith",
  "schedule": [
    {
      "day": "Monday",
      "startTime": "09:00",
      "endTime": "10:30",
      "room": "Room 101"
    }
  ],
  "color": "#8B5CF6"
}
```

#### Update Course

```http
PUT /api/courses/:id
```

#### Delete Course

```http
DELETE /api/courses/:id
```

### Tasks API

#### Get All Tasks

```http
GET /api/tasks
```

Query parameters:

-   `status` - Filter by status (pending/completed)
-   `priority` - Filter by priority (low/medium/high)
-   `dueDate` - Filter by due date

#### Create Task

```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete Assignment",
  "description": "Chapter 5 exercises",
  "dueDate": "2024-12-15",
  "priority": "high",
  "course": "course_id",
  "tags": ["assignment", "programming"]
}
```

#### Update Task

```http
PUT /api/tasks/:id
```

#### Delete Task

```http
DELETE /api/tasks/:id
```

### Exams API

#### Get All Exams

```http
GET /api/exams
```

#### Create Exam

```http
POST /api/exams
Content-Type: application/json

{
  "course": "course_id",
  "title": "Midterm Exam",
  "date": "2024-12-20",
  "time": "14:00",
  "duration": 120,
  "location": "Main Hall",
  "topics": ["Chapter 1-5"]
}
```

### Grades API

#### Get All Grades

```http
GET /api/grades
```

#### Calculate GPA

```http
GET /api/grades/gpa
```

Response:

```json
{
    "gpa": 3.75,
    "totalCredits": 48,
    "breakdown": {
        "A": 10,
        "B+": 5,
        "B": 3
    }
}
```

### Transactions API

#### Get All Transactions

```http
GET /api/transactions
```

Query parameters:

-   `type` - Filter by type (income/expense)
-   `category` - Filter by category
-   `startDate` - Start date
-   `endDate` - End date

#### Create Transaction

```http
POST /api/transactions
Content-Type: application/json

{
  "type": "expense",
  "category": "Food",
  "amount": 50000,
  "description": "Lunch",
  "date": "2024-12-01"
}
```

#### Get Financial Summary

```http
GET /api/transactions/summary
```

Response:

```json
{
    "totalIncome": 5000000,
    "totalExpense": 2500000,
    "balance": 2500000,
    "byCategory": {
        "Food": 800000,
        "Transport": 400000
    }
}
```

### Habits API

#### Get All Habits

```http
GET /api/habits
```

#### Create Habit

```http
POST /api/habits
Content-Type: application/json

{
  "name": "Morning Exercise",
  "description": "30 minutes workout",
  "icon": "🏃",
  "color": "#10B981",
  "frequency": "daily",
  "targetDays": ["Monday", "Wednesday", "Friday"]
}
```

#### Log Habit

```http
POST /api/habits/:id/log
Content-Type: application/json

{
  "date": "2024-12-01",
  "completed": true,
  "notes": "Great session!"
}
```

#### Get Habit Statistics

```http
GET /api/habits/:id/stats
```

Response:

```json
{
    "currentStreak": 15,
    "longestStreak": 30,
    "completionRate": 87.5,
    "totalLogs": 120
}
```

### Google Calendar API

#### Sync All Events

```http
POST /api/calendar/sync
```

#### Get Calendar Events

```http
GET /api/calendar/events
```

Query parameters:

-   `timeMin` - Start datetime (ISO 8601)
-   `timeMax` - End datetime (ISO 8601)

---

## 🔧 Troubleshooting

### MongoDB Connection Issues

**Problem**: `MongoNetworkError: failed to connect`

**Solutions**:

1. Check MONGODB_URI di `.env` sudah benar
2. Pastikan password tidak ada karakter khusus yang belum di-encode
    - Gunakan URL encoder: https://www.urlencoder.org/
3. Check Network Access di MongoDB Atlas
    - Pastikan IP `0.0.0.0/0` sudah ditambahkan
4. Check Database User credentials
    - Username & password harus match

**Problem**: `MongoServerError: bad auth`

**Solutions**:

1. Double check username & password di connection string
2. Pastikan Database User sudah di-create dengan benar
3. Wait 2-3 menit setelah create user (propagation time)

---

### Google OAuth Issues

**Problem**: `redirect_uri_mismatch`

**Solutions**:

1. Check Authorized redirect URIs di Google Cloud Console
2. Pastikan URL EXACT sama dengan `REDIRECT_URI` di `.env`
    - Development: `http://localhost:5000/auth/google/callback`
    - HARUS `http` (bukan `https`) untuk localhost
3. Clear browser cache & cookies
4. Try incognito/private window

**Problem**: `access_denied` atau `Error 403: access_denied`

**Solutions**:

1. Check OAuth consent screen status
2. Pastikan email Anda sudah di-add ke Test Users
3. Jika masih error, try publish app (move to production)
    - OAuth consent screen > "Publish App"

**Problem**: `invalid_client`

**Solutions**:

1. Check `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET` di `.env`
2. Pastikan tidak ada extra spaces atau line breaks
3. Generate new credentials jika perlu

---

### Frontend Issues

**Problem**: `Network Error` atau `CORS error`

**Solutions**:

1. Pastikan backend server sudah running
2. Check `FRONTEND_URL` di backend `.env` = `http://localhost:3000`
3. Check API base URL di `frontend/src/services/api.js`
4. Clear browser cache

**Problem**: Login button tidak berfungsi

**Solutions**:

1. Check browser console untuk error messages
2. Check backend logs untuk errors
3. Pastikan Google OAuth sudah configured dengan benar
4. Try clear cookies & local storage

**Problem**: Styling rusak / tidak muncul

**Solutions**:

1. Check Tailwind CSS sudah installed
    ```bash
    cd frontend
    npm list tailwindcss
    ```
2. Check `tailwind.config.js` sudah benar
3. Restart Vite dev server
    ```bash
    npm run dev
    ```

---

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions**:

**Linux/Mac**:

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

**Windows**:

```cmd
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F
```

Or change port di `backend/.env`:

```bash
PORT=5001  # Use different port
```

---

### npm install Errors

**Problem**: `npm ERR! code ERESOLVE`

**Solutions**:

```bash
# Try with legacy peer deps
npm install --legacy-peer-deps

# Or force
npm install --force

# Or clear cache first
npm cache clean --force
npm install
```

**Problem**: `npm ERR! permission denied`

**Solutions**:

**Linux/Mac** (DON'T use sudo!):

```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

**Windows**:
Run terminal as Administrator

---

### Database Performance Issues

**Problem**: Queries lambat

**Solutions**:

1. Pastikan indexes sudah di-setup
    ```bash
    node scripts/setupIndexes.js
    ```
2. Check MongoDB Atlas monitoring
    - Lihat slow queries
    - Check index usage
3. Optimize queries di code

---

## 📞 Support & Contact

### Documentation

-   📖 Full API Docs: `/docs` folder
-   🎨 Design System: Lihat components di `frontend/src/components`
-   💡 Examples: Check `scripts/seedData.js` untuk sample data

### Need Help?

-   🐛 Report bugs: Open issue di GitHub
-   💬 Questions: Create discussion di GitHub
-   📧 Email: your.email@example.com

### Useful Links

-   MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
-   Google Calendar API: https://developers.google.com/calendar
-   React Docs: https://react.dev/
-   Tailwind CSS: https://tailwindcss.com/docs
-   Vite Docs: https://vitejs.dev/

---

## 📝 License

MIT License - bebas digunakan untuk personal & commercial projects.

---

## 🎉 Congratulations!

Jika Anda sampai di sini, berarti setup sudah complete! 🚀

**Quick Start Checklist**:

-   ✅ Node.js installed
-   ✅ MongoDB Atlas account & cluster created
-   ✅ Google Cloud credentials configured
-   ✅ Dependencies installed (backend & frontend)
-   ✅ `.env` file configured
-   ✅ Database indexes created
-   ✅ Backend server running (port 5000)
-   ✅ Frontend server running (port 3000)
-   ✅ Logged in successfully!

**Next Steps**:

1. 🎨 Customize theme colors di `tailwind.config.js`
2. 📚 Tambah courses pertama Anda
3. ✅ Create tasks & set goals
4. 📊 Track progress & habits
5. 🎯 Achieve your academic goals!

---

<div align="center">

**Made with ❤️ for students**

Happy coding! 💻✨

</div>

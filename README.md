# FixMate — "Fix it fast" 🛠️⚡

FixMate is a high-performance web-based service marketplace connecting customers with verified local skilled workers (plumbers, electricians, carpenters, painters, cleaners, AC technicians, etc.).

## Features & Core User Flows

1. **Customer Flow**:
   - Register & Login (JWT Auth)
   - Browse & Search workers with multi-filter (category, min rating, max price, availability toggle)
   - Detailed public worker profiles with verified badges and ratings
   - Book appointment (future date & time validation)
   - Customer Dashboard with cancellation controls and 1-5 star review modal for completed jobs

2. **Worker Flow**:
   - Register & Login with multi-category selection
   - Profile management: photo upload, profession, experience, bio, rate range, availability toggle
   - Incoming booking request lifecycle (`pending` → `accepted` / `rejected` → `in_progress` → `completed`)
   - Read-only review summary and customer feedback list

3. **Admin Flow**:
   - Admin Portal (`admin` / `admin123`)
   - Verify/Approve pending workers (`is_verified` flag)
   - User Management table (customers & workers) with instant Suspend/Unsuspend action (`is_suspended` flag)
   - System-wide Bookings overview
   - Category Management (add/delete service categories)

---

## Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS v4, React Router v6, Axios, Lucide Icons
- **Backend**: Node.js, Express.js, JWT, bcryptjs, Multer
- **Database**: PostgreSQL / Supabase SQL schema + Built-in local fallback SQLite adapter for instant execution out of the box
- **Image Storage**: Cloudinary (with automatic fallback storage)

---

## Getting Started Locally

### 1. Backend Server Setup
```bash
cd server
npm install
npm run dev
# Server will launch on http://localhost:5000
```

### 2. Frontend Client Setup
```bash
cd client
npm install
npm run dev
# Vite client will launch on http://localhost:5173
```

---

## Seed Accounts for Testing

- **Admin Account**:
  - Username: `admin`
  - Password: `admin123`

- **Demo Verified Workers**:
  - Email: `alex.plumbing@fixmate.com` | Password: `worker123` (Plumbing Pro)
  - Email: `sarah.elec@fixmate.com` | Password: `worker123` (Electrician)

- **Demo Customer Account**:
  - Email: `emily@example.com` | Password: `customer123`

---

## Deployment Guidelines

- **Frontend → Vercel**: Connect the `/client` directory, set environment variable `VITE_API_URL=https://your-express-backend.onrender.com/api`.
- **Backend → Render**: Connect the `/server` directory, set environment variables (`PORT`, `JWT_SECRET`, `DATABASE_URL` / `SUPABASE_URL`, `CLOUDINARY_CLOUD_NAME`).
- **Database → Supabase**: Run the SQL scripts in `/server/db/schema.sql` and `/server/db/seed.sql` in the Supabase SQL Editor.

# EduNova - Full-Stack Learning Management System (LMS)

A modern, production-ready **full-stack LMS** platform with role-based access, real-time enrollment, admin course management, and responsive design.

**Live Demo**  
Frontend: https://edunova-frontend-rtyq.onrender.com  
Backend API: https://edunova-backend-wr3u.onrender.com  

**GitHub Repo**: https://github.com/vikash853/edunova

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express + JWT Authentication
- **Database**: MongoDB Atlas (M0 Free Tier)
- **Deployment**: Render (Frontend: Static Site, Backend: Web Service)
- **Other**: Axios (API calls), bcrypt (password hashing), Mongoose (ODM)

## Key Features

- **Role-Based Access Control** (Student, Instructor, Admin)
  - Students: Browse, enroll, view progress
  - Instructors: Create & manage their courses
  - Admin: Full control (add/edit/delete courses, manage users)
- **JWT Authentication** + Protected Routes
- **Course Enrollment** with duplicate check
- **Responsive UI** (Mobile-first, dark mode support)
- **Admin Dashboard** with course CRUD
- **Real-time feedback** (toasts, loading states)
- **Production-grade deployment** with environment variables & auto CI/CD

## Security Highlights

- Register: Role forced to "student" (no self-promotion to admin)
- Admin created manually in DB (seeded)
- JWT secret in env vars (never committed)
- CORS restricted to live domains only
- Password hashed with bcrypt (salt 12)

## Project Structure
edunova/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Business logic
│   ├── middleware/      # auth, roleCheck
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios instance
│   │   ├── components/  # Reusable UI
│   │   ├── pages/       # Course, Login, Admin, etc.
│   │   └── App.jsx
└── README.md

## How to Run Locally

1. Clone repo:
   ```bash
   git clone https://github.com/vikash853/edunova.git
   cd edunova

This is not just a student project — it's a production-like full-stack application with:

Secure auth & role management
Real deployment pipeline
Responsive & modern UI/UX
Clean code structure & error handling

Ready to discuss architecture, security decisions, deployment trade-offs, or any code part!
Made with ❤️ by Vikash Shukla

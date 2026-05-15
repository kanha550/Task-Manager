TASK MANAGER - FULL-STACK WEB APPLICATION
==========================================

A complete task management web application with role-based access control, project management, and real-time task tracking.

FEATURES
--------

* Authentication & Authorization
  - User signup and login with JWT tokens
  - Role-based access control (Admin/Member)
  - Secure password hashing with bcryptjs

* Project Management
  - Create, read, update, delete projects
  - Invite team members to projects
  - Project ownership and member tracking

* Task Management
  - Create tasks with title, description, priority, and due dates
  - Assign tasks to team members
  - Track task status (TODO, IN_PROGRESS, COMPLETED)
  - Set task priorities (LOW, MEDIUM, HIGH)

* Dashboard & Tracking
  - Real-time task statistics
  - Visual dashboard with task overview
  - Overdue task detection
  - Team member management

TECH STACK
----------

* Backend:
  - Runtime: Node.js
  - Framework: Express.js 5
  - Database: SQLite with Prisma ORM
  - Authentication: JWT (jsonwebtoken)

* Frontend:
  - Framework: React 18
  - Build Tool: Vite
  - Language: TypeScript
  - HTTP Client: Axios
  - Styling: Vanilla CSS

PROJECT STRUCTURE
-----------------

Task Manager/
├── backend/                  # Backend API Server
│   ├── index.js              # Express server setup
│   ├── prisma/               # Database schema and migrations
│   ├── routes/               # API endpoints
│   └── middleware/           # Auth and other middleware
├── frontend/                 # Frontend React Application
│   ├── src/                  # React source code
│   │   ├── components/       # UI Components
│   │   ├── pages/            # Page layouts
│   │   └── utils/            # API client and helpers
│   ├── public/               # Static assets
│   └── index.html            # HTML template
├── README.md                 # Detailed Markdown documentation
├── README.txt                # This file
└── SETUP.md                  # Detailed setup instructions

GETTING STARTED
---------------

1. Prerequisites:
   - Node.js 16+
   - npm or yarn

2. Installation:

   Backend Setup:
   - cd backend
   - npm install
   - Create .env file (see .env.example or README.md)
   - npx prisma migrate dev --name init

   Frontend Setup:
   - cd frontend
   - npm install

3. Running the App:

   - Backend: cd backend && npm run dev (Runs on http://localhost:5000)
   - Frontend: cd frontend && npm run dev (Runs on http://localhost:5173)

API ENDPOINTS (Summary)
-----------------------

* Auth:
  - POST /api/auth/signup
  - POST /api/auth/login

* Projects:
  - GET /api/projects
  - POST /api/projects
  - GET /api/projects/:id
  - PUT /api/projects/:id
  - DELETE /api/projects/:id
  - POST /api/projects/:id/members

* Tasks:
  - GET /api/tasks
  - POST /api/tasks
  - PUT /api/tasks/:id
  - DELETE /api/tasks/:id

LICENSE
-------

This project is provided for educational purposes.

---
Built with React, Express, and Prisma.

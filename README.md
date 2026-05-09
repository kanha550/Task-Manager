# Task Manager - Full-Stack Web Application

A complete task management web application with role-based access control, project management, and real-time task tracking.

## 🚀 Features

### Core Features
- **Authentication & Authorization**
  - User signup and login with JWT tokens
  - Role-based access control (Admin/Member)
  - Secure password hashing with bcryptjs

- **Project Management**
  - Create, read, update, delete projects
  - Invite team members to projects
  - Project ownership and member tracking
  - Multi-user collaboration

- **Task Management**
  - Create tasks with title, description, priority, and due dates
  - Assign tasks to team members
  - Track task status (TODO, IN_PROGRESS, COMPLETED)
  - Set task priorities (LOW, MEDIUM, HIGH)
  - Edit and delete tasks

- **Dashboard & Tracking**
  - Real-time task statistics
  - Visual dashboard with task overview
  - Overdue task detection
  - Task progress tracking
  - Team member management

- **Role-Based Access Control**
  - Admin: Full system access, can manage users
  - Member: Project and task access based on membership
  - Project owner permissions for project management

## 📋 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs for password hashing
- **Environment**: dotenv

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **HTTP Client**: Axios
- **Styling**: CSS

### Database
- **Type**: SQLite
- **Schema Manager**: Prisma
- **Models**: User, Project, ProjectMember, Task

## 🛠️ Project Structure

```
Task Manager/
├── server/
│   ├── index.js                 # Express server setup
│   ├── .env                     # Environment variables
│   ├── prisma.config.ts        # Prisma configuration
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js             # Authentication endpoints
│   │   ├── projects.js         # Project management endpoints
│   │   ├── tasks.js            # Task management endpoints
│   │   └── users.js            # User endpoints
│   └── prisma/
│       ├── schema.prisma       # Database schema
│       └── migrations/         # Database migrations
│
├── src/
│   ├── pages/
│   │   ├── Auth.tsx            # Authentication page
│   │   ├── Dashboard.tsx       # Main dashboard
│   │   └── ProjectDetail.tsx   # Project details page
│   ├── components/
│   │   ├── TaskStats.tsx       # Task statistics component
│   │   ├── QuickActions.tsx    # Quick action buttons
│   │   ├── ProjectList.tsx     # Project listing
│   │   └── TaskBoard.tsx       # Kanban-style task board
│   ├── utils/
│   │   └── api.ts              # API client configuration
│   ├── styles/
│   │   ├── Auth.css            # Auth page styles
│   │   ├── Dashboard.css       # Dashboard styles
│   │   └── ProjectDetail.css   # Project detail styles
│   ├── App.tsx                 # Main app component
│   ├── App.css                 # Global styles
│   └── main.tsx                # Entry point
│
├── index.html                  # HTML template
├── package.json               # Frontend dependencies
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

#### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
```

#### 2. Setup Environment Variables

**Backend (.env):**
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=5000
NODE_ENV="development"
```

#### 3. Initialize Database

```bash
cd server
npx prisma migrate dev --name init
```

This will:
- Create the SQLite database
- Apply migrations
- Generate Prisma client

#### 4. Start the Application

**Terminal 1 - Start Backend Server:**
```bash
cd server
node index.js
```

Server will run on `http://localhost:5000`

**Terminal 2 - Start Frontend Dev Server:**
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📖 API Documentation

### Authentication Endpoints

#### Signup
```
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response: { token, user }
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: { token, user }
```

### Project Endpoints

#### Create Project
```
POST /api/projects
Authorization: Bearer {token}

{
  "name": "Project Name",
  "description": "Project description"
}
```

#### Get All Projects
```
GET /api/projects
Authorization: Bearer {token}
```

#### Get Project Details
```
GET /api/projects/:id
Authorization: Bearer {token}
```

#### Update Project
```
PUT /api/projects/:id
Authorization: Bearer {token}

{
  "name": "Updated Name",
  "description": "Updated description"
}
```

#### Delete Project
```
DELETE /api/projects/:id
Authorization: Bearer {token}
```

#### Add Member to Project
```
POST /api/projects/:id/members
Authorization: Bearer {token}

{ "userId": 2 }
```

#### Remove Member from Project
```
DELETE /api/projects/:id/members/:userId
Authorization: Bearer {token}
```

### Task Endpoints

#### Create Task
```
POST /api/tasks
Authorization: Bearer {token}

{
  "title": "Task Title",
  "description": "Task description",
  "priority": "HIGH",
  "dueDate": "2026-05-15",
  "projectId": 1,
  "assigneeId": 2
}
```

#### Get Project Tasks
```
GET /api/tasks/project/:projectId
Authorization: Bearer {token}
```

#### Get User's Tasks
```
GET /api/tasks/user/my-tasks
Authorization: Bearer {token}
```

#### Get Task Statistics
```
GET /api/tasks
Authorization: Bearer {token}

Response: { stats: { total, todo, inProgress, completed, overdue } }
```

#### Update Task
```
PUT /api/tasks/:id
Authorization: Bearer {token}

{
  "title": "Updated Title",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM",
  "assigneeId": 2
}
```

#### Delete Task
```
DELETE /api/tasks/:id
Authorization: Bearer {token}
```

### User Endpoints

#### Get All Users
```
GET /api/users
Authorization: Bearer {token}
```

#### Get Current User Profile
```
GET /api/users/profile/me
Authorization: Bearer {token}
```

## 🔐 Authentication & Authorization

### Role-Based Access Control

**ADMIN Role:**
- Full system access
- Can manage all projects
- Can manage users
- Can delete any project or task

**MEMBER Role:**
- Can create their own projects
- Can be invited to projects
- Can manage tasks within their projects
- Can view team members

### JWT Token
- Issued upon successful login/signup
- Valid for 7 days
- Includes: user ID, email, role, name
- Must be included in Authorization header: `Bearer {token}`

## 📊 Database Schema

### User Model
```prisma
model User {
  id          Int     @id @default(autoincrement())
  email       String  @unique
  password    String
  name        String
  role        String  @default("MEMBER")  // ADMIN or MEMBER
  tasks       Task[]  @relation("Assignee")
  projects    Project[] @relation("ProjectOwner")
  memberships ProjectMember[]
}
```

### Project Model
```prisma
model Project {
  id          Int     @id @default(autoincrement())
  name        String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  ownerId     Int
  owner       User    @relation("ProjectOwner", fields: [ownerId], references: [id])
  members     ProjectMember[]
  tasks       Task[]
}
```

### Task Model
```prisma
model Task {
  id          Int     @id @default(autoincrement())
  title       String
  description String?
  status      String  @default("TODO")  // TODO, IN_PROGRESS, COMPLETED
  priority    String  @default("MEDIUM") // LOW, MEDIUM, HIGH
  dueDate     DateTime?
  projectId   Int
  project     Project @relation(fields: [projectId], references: [id])
  assigneeId  Int?
  assignee    User?   @relation("Assignee", fields: [assigneeId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🎨 UI Features

### Authentication Page
- Signup form with email validation
- Login form
- Toggle between signup and login
- Error message display
- Secure password handling

### Dashboard
- Welcome message with user role
- Task statistics cards (Total, TODO, In Progress, Completed, Overdue)
- Project creation form
- Project list view
- Quick action buttons
- Logout functionality

### Project Detail Page
- Project information and description
- Task statistics
- Team members list
- Kanban-style task board with 3 columns
- Add/remove team members
- Delete project option

### Task Board
- Drag-and-drop style task visualization
- Status columns (TODO, IN_PROGRESS, COMPLETED)
- Task priority indicators
- Task due dates
- Assignee information
- Quick status update dropdown
- Create new task form

## 🚨 Error Handling

- Input validation on both client and server
- Email format validation
- Password length requirements (minimum 6 characters)
- Duplicate user prevention
- Authorization checks on all protected routes
- Task and project access verification
- Overdue task detection

## 🔄 Workflow

1. **New User Signup**
   - First user automatically becomes ADMIN
   - Subsequent users become MEMBER
   - Email must be unique

2. **Project Creation**
   - Only registered users can create projects
   - Creator becomes project owner
   - Can invite other users

3. **Task Management**
   - Owner and members can create tasks
   - Only owner can delete tasks
   - Members can update task status
   - Tasks track creation and update time

4. **Collaboration**
   - Multiple users can be invited to a project
   - Shared task visibility
   - Real-time statistics

## 🧪 Testing

### Test User Creation
1. Open `http://localhost:5173`
2. Click "Sign Up"
3. Create account (first user = ADMIN)
4. Create second account (MEMBER)
5. Test project creation and task management

## 📝 Example Workflows

### Workflow 1: Team Collaboration
1. Admin creates a project "Website Redesign"
2. Admin invites team members
3. Members create tasks within the project
4. Tasks are assigned to team members
5. Members update task status as they work
6. Dashboard shows real-time progress

### Workflow 2: Personal Tasks
1. User signs up
2. Creates personal project
3. Adds tasks to track
4. Updates task statuses
5. Monitors progress on dashboard

## 🐛 Troubleshooting

### Database Issues
```bash
# Reset database (development only)
cd server
npx prisma migrate reset
```

### Port Already in Use
- Backend uses port 5000
- Frontend uses port 5173
- Change in server `.env` or vite config if needed

### CORS Errors
- Ensure backend is running on http://localhost:5000
- Check that frontend makes requests to correct URL

### Token Expiration
- Tokens valid for 7 days
- Login again after expiration
- Token stored in localStorage

## 🚀 Production Deployment

### Before Deploying
1. Change `JWT_SECRET` to a strong random string
2. Set `NODE_ENV=production`
3. Use a production database (PostgreSQL recommended)
4. Setup HTTPS/SSL
5. Configure CORS for production domain
6. Use environment-specific configuration

### Build Frontend
```bash
npm run build
```

### Environment Variables
```
DATABASE_URL="your-production-db-url"
JWT_SECRET="your-production-secret"
PORT=5000
NODE_ENV="production"
```

## 📄 License

This project is provided as-is for educational purposes.

## 🤝 Contributing

Feel free to extend this application with:
- File attachments for tasks
- Task comments and discussions
- Notifications system
- Task recurrence
- Time tracking
- Advanced filtering
- Export functionality

## 📞 Support

For issues or questions, refer to:
- API documentation above
- Database schema documentation
- Component structure in src/

---

Built with ❤️ using React, Express, and Prisma

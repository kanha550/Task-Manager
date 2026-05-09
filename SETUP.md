# Quick Start Guide

## 🚀 Get the Application Running in 5 Minutes

### Step 1: Install Frontend Dependencies
```bash
npm install
```

### Step 2: Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### Step 3: Initialize the Database
```bash
cd server
npx prisma migrate dev --name init
```

When prompted, press Enter to create the migration.

### Step 4: Start the Backend Server
```bash
# From the server directory
node index.js
```

You should see: `Server is running on port 5000`

### Step 5: Start the Frontend Development Server
Open a new terminal in the root directory:
```bash
npm run dev
```

You should see: `Local: http://localhost:5173/`

### Step 6: Open in Browser
Navigate to: `http://localhost:5173`

## ✅ First Time Setup Checklist

- [ ] Installed frontend dependencies (`npm install`)
- [ ] Installed backend dependencies (`cd server && npm install`)
- [ ] Created database (`npx prisma migrate dev --name init`)
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can access http://localhost:5173

## 📝 First Time Users

1. **Sign Up** (First user becomes ADMIN)
   - Email: test@example.com
   - Password: password123
   - Name: Test User

2. **Create a Project**
   - Click "➕ New Project"
   - Name: My First Project
   - Add description (optional)

3. **Create a Task**
   - Click on the project card
   - Click "➕ New Task"
   - Fill in task details
   - Click "Create Task"

4. **Manage Tasks**
   - Drag tasks between columns (TODO → IN_PROGRESS → COMPLETED)
   - Or use the status dropdown on each task card
   - Assign tasks to team members

## 🔧 Useful Commands

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend
```bash
cd server

# Database management
npx prisma studio   # Open database UI
npx prisma migrate dev --name <name>  # Create new migration
npx prisma migrate reset  # Reset database (DEV ONLY)

# Start server
node index.js
```

## 🐛 Common Issues

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000
# Or change port in server/.env
```

### Database Locked
```bash
cd server
rm dev.db
npx prisma migrate dev --name init
```

### Node Modules Issues
```bash
rm package-lock.json
npm install
```

## 📱 Testing Different Roles

### Test Admin Features
1. Sign up first user (becomes ADMIN automatically)
2. Create projects and manage users

### Test Member Features
1. Open new browser/incognito window
2. Sign up second user (becomes MEMBER)
3. Request admin to add you to a project
4. Test task assignment and updates

## 🚀 Ready to Deploy?

Before deploying to production:
1. Change `JWT_SECRET` in `server/.env`
2. Set `NODE_ENV=production`
3. Use a real database (PostgreSQL recommended)
4. Configure CORS for your domain
5. Build frontend: `npm run build`

## 📚 Next Steps

- Read [README.md](./README.md) for full documentation
- Check API endpoints documentation
- Explore the components in `src/components/`
- Try creating more projects and tasks

## 💡 Tips

- Tasks are sorted by creation date (newest first)
- Overdue tasks show in dashboard stats
- First user signup creates ADMIN role
- All subsequent signups create MEMBER role
- Only project owners can manage team members
- Team members can only see projects they're part of

## 🆘 Still Having Issues?

1. Check that both servers are running (one for API, one for frontend)
2. Verify database was created with `npx prisma migrate dev`
3. Check browser console for errors (F12)
4. Check server logs in the terminal
5. Make sure ports 5000 and 5173 are available

---

Happy task managing! 🎉

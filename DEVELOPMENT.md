# Development Guide

## 📚 Project Architecture

### Frontend Structure
```
src/
├── pages/           # Page components (full-page views)
├── components/      # Reusable components
├── utils/          # Utility functions (API client)
├── styles/         # CSS files
├── App.tsx         # Main app component with routing
└── main.tsx        # Entry point
```

### Backend Structure
```
server/
├── index.js           # Express app & server setup
├── middleware/        # Middleware (auth, validation)
├── routes/            # Route handlers
├── prisma/            # Database schema & migrations
└── .env              # Environment variables
```

## 🔄 How Data Flows

### Signup Flow
```
User fills form → Auth.tsx → authAPI.signup() 
→ POST /api/auth/signup → Express → Prisma (DB) 
→ JWT token → localStorage → App state → Dashboard
```

### Task Update Flow
```
User changes task status → TaskBoard.tsx 
→ tasksAPI.update() → PUT /api/tasks/:id 
→ Express (auth check) → Prisma update 
→ Response → UI refresh
```

## 🚀 Common Development Tasks

### Add a New API Endpoint

1. **Create route handler** in `server/routes/`:
```javascript
router.get('/new-endpoint', auth, async (req, res) => {
  try {
    // Your logic here
    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
});
```

2. **Add to API client** in `src/utils/api.ts`:
```typescript
export const newAPI = {
  getData: () => api.get('/new-endpoint'),
};
```

3. **Use in component**:
```typescript
import { newAPI } from '../utils/api';

const data = await newAPI.getData();
```

### Add a New Component

1. **Create component file** `src/components/MyComponent.tsx`:
```typescript
import React from 'react';

interface MyComponentProps {
  data: any;
  onAction: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ data, onAction }) => {
  return <div>{/* Your JSX */}</div>;
};
```

2. **Import and use** in pages or other components:
```typescript
import { MyComponent } from '../components/MyComponent';

// In another component
<MyComponent data={myData} onAction={handleAction} />
```

### Add a New Page

1. **Create page file** `src/pages/NewPage.tsx`
2. **Add navigation logic** in `App.tsx`
3. **Update view state** to show new page

### Add Database Fields

1. **Update Prisma schema** `server/prisma/schema.prisma`:
```prisma
model Task {
  // ... existing fields
  newField String? // Add new field
}
```

2. **Create migration**:
```bash
cd server
npx prisma migrate dev --name add_new_field
```

3. **Update API** to use new field

## 🎨 Styling

### Global Styles
- Defined in `src/App.css`
- CSS variables for colors in `:root`
- Available variables:
  - `--primary-color`
  - `--secondary-color`
  - `--danger-color`
  - `--warning-color`

### Component Styles
- Each page/component has its own CSS file
- Follow naming convention: `ComponentName.css`
- Use flexbox/grid for layouts
- Mobile-responsive design

### Add New Styles

1. Create `src/styles/NewComponent.css`
2. Import in component: `import '../styles/NewComponent.css'`
3. Apply CSS classes

## 🔐 Security Considerations

### Authentication
- ✅ JWT tokens stored in localStorage
- ✅ Token included in all API requests
- ✅ Server validates token on protected routes
- ⚠️ localStorage is vulnerable to XSS attacks
  - Consider using httpOnly cookies in production

### Password Security
- ✅ Passwords hashed with bcryptjs (10 rounds)
- ✅ Password validation (minimum 6 characters)
- ⚠️ Add stronger password requirements in production

### Authorization
- ✅ Role-based checks (Admin/Member)
- ✅ Project ownership verification
- ✅ Relationship validation (user in project)

### Improvements for Production
1. Use httpOnly cookies for tokens
2. Implement CSRF protection
3. Add rate limiting
4. Validate all input strictly
5. Use HTTPS only
6. Implement request validation middleware

## 🧪 Testing

### Manual Testing Checklist

**Authentication**
- [ ] Signup with valid email
- [ ] Signup rejects invalid email
- [ ] Signup requires password (6+ chars)
- [ ] Login with correct credentials
- [ ] Login rejects wrong password
- [ ] Token persists on page refresh
- [ ] Logout clears token

**Projects**
- [ ] Create project
- [ ] View all projects
- [ ] Edit project (owner only)
- [ ] Delete project (owner only)
- [ ] Add team member
- [ ] Remove team member
- [ ] Non-owner can't modify project

**Tasks**
- [ ] Create task in project
- [ ] Update task status
- [ ] Assign task to user
- [ ] Edit task details
- [ ] Delete task (owner only)
- [ ] View dashboard statistics
- [ ] Filter tasks by project

### Testing Different Roles

**Admin User**
1. Signup (first user = Admin)
2. Create project
3. View admin features

**Member User**
1. Signup in new browser
2. Can only see assigned projects
3. Cannot delete projects
4. Cannot manage team members

## 🚨 Error Handling

### Add Error Handling to Components

```typescript
try {
  const result = await someAPI.call();
  setData(result.data);
} catch (err: any) {
  const message = err.response?.data?.message || 'An error occurred';
  setError(message);
}
```

### Server-side Error Handling

```javascript
try {
  // Your logic
} catch (error) {
  console.error('Operation error:', error);
  res.status(500).json({ message: 'Server error' });
}
```

## 🚀 Performance Optimization

### Frontend
- Use React.memo for heavy components
- Implement loading states
- Lazy load routes when needed
- Minimize re-renders with useCallback

### Backend
- Add database indexes for frequently queried fields
- Implement caching for statistics
- Use pagination for large lists
- Optimize Prisma queries with select/include

### Database
```prisma
// Index frequently queried fields
model Task {
  @@index([projectId])
  @@index([assigneeId])
  @@index([status])
}
```

## 📝 Logging

### Add Logging

**Backend:**
```javascript
console.log('Operation started:', { userId: req.user.id });
console.error('Database error:', error);
```

**Frontend:**
```typescript
console.log('Fetching tasks:', projectId);
console.error('API Error:', error.response?.data);
```

## 🔄 Workflow Improvements

### Add Notifications
1. Create notification component
2. Add notification state to App
3. Call notification on API success/error
4. Display in UI

### Add Filtering
1. Update API to accept filter parameters
2. Add filter UI in component
3. Pass filters to API calls
4. Update results

### Add Search
1. Add search input to components
2. Debounce search input
3. Call search API
4. Display results

## 🐛 Debugging

### Browser DevTools
- Open with F12
- Check Network tab for API calls
- Check Console for errors
- Check localStorage for token

### Server Debugging
```bash
# Check Prisma data
cd server
npx prisma studio

# View server logs in terminal
node index.js
```

### Database Debugging
```bash
# Open Prisma Studio
cd server
npx prisma studio

# Reset database (DEV ONLY)
npx prisma migrate reset
```

## 📚 Useful Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vite Guide](https://vitejs.dev/guide)

## 🎯 Next Features to Build

1. **Notifications System**
   - Task assignment notifications
   - Project invitation notifications

2. **File Attachments**
   - Upload files to tasks
   - Store in server

3. **Task Comments**
   - Add discussion to tasks
   - Comment thread UI

4. **Time Tracking**
   - Track time spent on tasks
   - Generate reports

5. **Advanced Filtering**
   - Filter by priority, assignee, status
   - Save filter presets

6. **Export Reports**
   - Export project data
   - Generate PDF reports

7. **Dark Mode**
   - Toggle dark/light theme
   - Save preference

8. **Recurrent Tasks**
   - Repeat tasks on schedule
   - Automatic creation

---

Happy coding! 🎉

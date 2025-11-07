# Quick Start Guide

This guide will help you get the application running quickly.

## Prerequisites Check

Before starting, ensure you have:
- [ ] Node.js (v16+) installed
- [ ] MongoDB installed locally OR MongoDB Atlas account
- [ ] Git installed
- [ ] A code editor (VS Code recommended)

## Quick Setup (5 minutes)

### Step 1: Install Dependencies

Open **TWO** terminal windows in the project root:

**Terminal 1 - Backend:**
```bash
cd backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Configure Environment

The `.env` files are already created. You just need to update MongoDB connection if needed.

**For MongoDB Atlas (Cloud - Recommended):**
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `backend/.env`:
   ```env
   MONGODB_URI=your-atlas-connection-string
   ```

**For Local MongoDB:**
- No changes needed! Default is `mongodb://localhost:27017/user-network`
- Just make sure MongoDB is running:
  ```bash
  # Windows: MongoDB should auto-start
  # macOS: brew services start mongodb-community
  # Linux: sudo systemctl start mongod
  ```

### Step 3: Start the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
✅ Backend running on http://localhost:5000

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
```
✅ Frontend opens automatically on http://localhost:3000

### Step 4: Test the Application

1. Open browser to http://localhost:3000
2. Click "**+ Add User**" to create your first user
3. Create 2-3 users with different hobbies
4. Drag one user node onto another to create a friendship
5. Try dragging hobbies from the sidebar onto users
6. Watch the popularity scores update!

## Common Issues & Solutions

### Issue: Backend won't start
**Error:** `Cannot connect to MongoDB`

**Solution:**
```bash
# Check if MongoDB is running
# Windows:
services.msc  # Look for MongoDB

# macOS:
brew services list

# Linux:
sudo systemctl status mongod

# Start MongoDB if not running
# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

### Issue: Frontend won't start
**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Option 1: Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Option 2: Use different port
# Set PORT=3001 in frontend/.env
```

### Issue: "Module not found" errors
**Solution:**
```bash
# Delete node_modules and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors in editor
**Solution:**
- Wait for dependencies to install completely
- Restart VS Code
- Run: `npm install` again

## Testing the API

### Option 1: Use the Frontend
The easiest way! Just use the web interface.

### Option 2: Use Postman
1. Import `User_Network_API.postman_collection.json`
2. Collection is ready with all endpoints!

### Option 3: Use cURL
```bash
# Create a user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"Test User","age":25,"hobbies":["Reading","Gaming"]}'

# Get all users
curl http://localhost:5000/api/users

# Get graph data
curl http://localhost:5000/api/graph
```

## Running Tests

```bash
cd backend
npm test
```

Expected output: All tests should pass ✅

## Project Structure Overview

```
cybernauts_Assignment/
├── backend/              # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── models/      # MongoDB schemas
│   │   ├── controllers/ # Business logic
│   │   ├── routes/      # API endpoints
│   │   └── server.ts    # Entry point
│   └── package.json
│
├── frontend/            # React + TypeScript + React Flow
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # State management
│   │   ├── services/    # API client
│   │   └── App.tsx      # Main component
│   └── package.json
│
└── README.md           # Full documentation
```

## Next Steps

### 1. Explore the Features
- ✅ Create multiple users
- ✅ Add hobbies by dragging from sidebar
- ✅ Create friendships by connecting nodes
- ✅ Watch popularity scores update in real-time
- ✅ Try editing and deleting users

### 2. Understand the Business Logic

**Popularity Score Formula:**
```
score = friends count + (shared hobbies with friends × 0.5)
```

**Example:**
- User has 2 friends
- Shares 2 hobbies with Friend 1
- Shares 3 hobbies with Friend 2
- Score = 2 + ((2+3) × 0.5) = 2 + 2.5 = **4.5**

**Deletion Rules:**
- Cannot delete user with active friendships
- Must unlink all friends first

### 3. Review the Code
- Check `backend/src/models/User.ts` for popularity calculation
- See `frontend/src/components/GraphVisualization.tsx` for React Flow
- Look at `backend/src/__tests__/user.test.ts` for test examples

### 4. Read Full Documentation
- **README.md** - Complete guide
- **API_DOCUMENTATION.md** - API reference
- **DEPLOYMENT.md** - How to deploy

## Development Tips

### Backend Development
```bash
cd backend
npm run dev  # Auto-restart on changes
```

### Frontend Development
```bash
cd frontend
npm start  # Hot reload enabled
```

### Building for Production
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
# Serve the 'build' folder
```

## API Endpoints Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |
| POST | `/api/users/:id/link` | Create friendship |
| DELETE | `/api/users/:id/unlink` | Remove friendship |
| GET | `/api/graph` | Get graph data |

## Features Checklist

### Core Features ✅
- [x] CRUD operations for users
- [x] Friendship creation and removal
- [x] Popularity score calculation
- [x] Graph visualization with React Flow
- [x] Draggable hobbies
- [x] User management panel
- [x] Real-time updates
- [x] Error handling

### Bonus Features ✅
- [x] Custom high/low score nodes
- [x] Smooth animations
- [x] Toast notifications
- [x] Search/filter hobbies
- [x] Unit tests (8+ cases)
- [x] TypeScript throughout
- [x] Professional UI/UX

## Performance Notes

### First Load
- Backend: ~2-3 seconds to connect to MongoDB
- Frontend: ~1-2 seconds to compile React

### Subsequent Loads
- API responses: <100ms
- Graph updates: Instant
- UI interactions: Smooth 60fps

## Getting Help

### Documentation
1. README.md - Full project documentation
2. API_DOCUMENTATION.md - API reference
3. DEPLOYMENT.md - Deployment guide

### Debugging
- Check browser console (F12)
- Check backend terminal for errors
- Check MongoDB is running
- Verify .env files are correct

### Common Questions

**Q: Can I use a different database?**
A: Yes, but you'll need to modify the code. MongoDB is recommended.

**Q: How do I add more hobbies?**
A: Edit `frontend/src/context/AppContext.tsx` → `allHobbies` array

**Q: Can I deploy this for free?**
A: Yes! See DEPLOYMENT.md for free tier options.

**Q: How do I add authentication?**
A: You'll need to implement JWT tokens and protect routes.

## Support

For issues:
1. Check this guide
2. Check README.md
3. Review code comments
4. Check error messages
5. Create GitHub issue

## Summary

You should now have:
- ✅ Backend running on http://localhost:5000
- ✅ Frontend running on http://localhost:3000
- ✅ MongoDB connected
- ✅ Working graph visualization
- ✅ All features functional

**Enjoy building relationships! 🌐**

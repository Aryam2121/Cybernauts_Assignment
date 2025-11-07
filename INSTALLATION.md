# 🚀 Installation Guide

Follow these steps to set up and run the Interactive User Relationship & Hobby Network application.

## ⚡ Quick Install (Recommended)

### For Windows Users:
```bash
# Double-click setup.bat
# OR run in terminal:
setup.bat
```

### For macOS/Linux Users:
```bash
# Make script executable:
chmod +x setup.sh

# Run setup:
./setup.sh
```

The setup script will automatically install all dependencies for both backend and frontend.

---

## 📝 Manual Installation

If you prefer to install manually or if the script doesn't work, follow these steps:

### Step 1: Verify Prerequisites

**Check Node.js:**
```bash
node --version
# Should show v16.x.x or higher
```

**Check npm:**
```bash
npm --version
# Should show v8.x.x or higher
```

**If not installed:**
- Download from: https://nodejs.org/
- Install LTS version (recommended)

### Step 2: Install MongoDB

#### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (Free M0 tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Update `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/user-network?retryWrites=true&w=majority
   ```

#### Option B: Local MongoDB

**Windows:**
1. Download: https://www.mongodb.com/try/download/community
2. Run installer (default settings)
3. MongoDB starts automatically as a service
4. No changes needed to `.env`

**macOS:**
```bash
# Install with Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Step 3: Install Backend Dependencies

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Expected output: added 200+ packages
```

**If you see errors:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Step 4: Install Frontend Dependencies

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Expected output: added 1400+ packages
```

**If you see errors:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Step 5: Configure Environment Variables

Environment variables are already configured in `.env` files, but you may need to update them:

#### Backend Configuration (`backend/.env`)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (choose one)
# Option 1: Local MongoDB (default)
MONGODB_URI=mongodb://localhost:27017/user-network

# Option 2: MongoDB Atlas (if using cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/user-network?retryWrites=true&w=majority

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

#### Frontend Configuration (`frontend/.env`)

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 6: Verify Installation

#### Check Backend Installation:
```bash
cd backend
npm run build

# Should compile TypeScript without errors
# Output: Successfully compiled X files
```

#### Check Frontend Installation:
```bash
cd frontend
npm run build

# Should build React app
# Output: The build folder is ready to be deployed
```

---

## 🏃 Running the Application

### Step 1: Start MongoDB (if using local)

**Check if MongoDB is running:**
```bash
# Windows (in PowerShell as Administrator)
Get-Service MongoDB

# macOS
brew services list | grep mongodb

# Linux
sudo systemctl status mongod
```

**Start MongoDB if not running:**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Step 2: Start Backend Server

Open a terminal window:

```bash
# Navigate to backend
cd backend

# Start development server
npm run dev
```

**Expected output:**
```
[nodemon] starting `ts-node src/server.ts`
✅ MongoDB connected successfully
🚀 Server running on port 5000
📍 Environment: development
```

**If you see errors:**
- Check MongoDB is running
- Verify MONGODB_URI in `.env`
- Check if port 5000 is available

### Step 3: Start Frontend Server

Open a **NEW** terminal window:

```bash
# Navigate to frontend
cd frontend

# Start React development server
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view user-network-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.x:3000
```

Browser should automatically open to http://localhost:3000

---

## ✅ Verify Installation

### 1. Check Backend API

Open browser or use cURL:
```bash
# Health check
curl http://localhost:5000/health

# Should return: {"status":"OK","timestamp":"2025-11-07..."}
```

### 2. Check Frontend

1. Browser should show the application at http://localhost:3000
2. You should see:
   - Header: "🌐 User Relationship & Hobby Network"
   - Left sidebar: Hobbies list
   - Center: Empty graph canvas
   - Right sidebar: User panel with "+ Add User" button

### 3. Test Basic Functionality

**Create a user:**
1. Click "+ Add User" button
2. Fill in:
   - Username: "Test User"
   - Age: 25
   - Hobbies: "Reading, Gaming"
3. Click "Create"
4. Should see success notification
5. User appears in right panel
6. User appears as node in graph

**Create friendship:**
1. Create a second user
2. Drag one user node onto another in the graph
3. Should see edge connecting them
4. Popularity scores update

---

## 🧪 Run Tests

### Backend Tests

```bash
cd backend
npm test
```

**Expected output:**
```
PASS  src/__tests__/user.test.ts
  User API Tests
    ✓ should create a new user
    ✓ should fail with invalid data
    ... (10 tests total)

Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
```

### Frontend Tests (if implemented)

```bash
cd frontend
npm test
```

---

## 🛠️ Troubleshooting

### Problem: "Cannot find module" errors

**Solution:**
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Problem: Port already in use

**Backend (Port 5000):**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

**Frontend (Port 3000):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Problem: MongoDB connection failed

**Check connection string:**
```bash
# Test MongoDB connection
mongosh "your-connection-string"

# For local:
mongosh "mongodb://localhost:27017/user-network"
```

**For MongoDB Atlas:**
1. Check username/password is correct
2. Verify IP whitelist (0.0.0.0/0 for development)
3. Ensure network allows connections

### Problem: TypeScript compilation errors

**Solution:**
```bash
# Backend
cd backend
npm install --save-dev typescript @types/node @types/express

# Frontend
cd frontend
npm install --save-dev typescript @types/react @types/react-dom
```

### Problem: CORS errors in browser console

**Solution:**
1. Check `backend/.env` CORS_ORIGIN matches frontend URL
2. Restart backend server after changing .env
3. Clear browser cache

---

## 📊 System Requirements

### Minimum Requirements:
- **OS**: Windows 10, macOS 10.14+, or Linux
- **RAM**: 4GB
- **Disk Space**: 1GB free
- **Node.js**: v16.0.0 or higher
- **MongoDB**: v5.0 or higher

### Recommended Requirements:
- **OS**: Windows 11, macOS 12+, or Ubuntu 20.04+
- **RAM**: 8GB
- **Disk Space**: 2GB free
- **Node.js**: v18.0.0 or higher
- **MongoDB**: v6.0 or higher

---

## 🔄 Updating Dependencies

### Check for updates:
```bash
# Backend
cd backend
npm outdated

# Frontend
cd frontend
npm outdated
```

### Update dependencies:
```bash
# Backend
cd backend
npm update

# Frontend
cd frontend
npm update
```

---

## 🎯 Next Steps

After successful installation:

1. **Read the documentation:**
   - README.md - Complete guide
   - API_DOCUMENTATION.md - API reference
   - QUICK_START.md - Quick tutorial

2. **Import Postman collection:**
   - Import `User_Network_API.postman_collection.json`
   - Test all API endpoints

3. **Explore the code:**
   - `backend/src/models/User.ts` - Database schema
   - `backend/src/controllers/userController.ts` - Business logic
   - `frontend/src/components/GraphVisualization.tsx` - React Flow

4. **Run tests:**
   - `cd backend && npm test`
   - Check test coverage: `npm test -- --coverage`

5. **Consider deployment:**
   - See DEPLOYMENT.md for hosting instructions

---

## 📞 Support

If you encounter issues:

1. Check this guide thoroughly
2. Review error messages carefully
3. Search for similar issues online
4. Check documentation files
5. Create an issue on GitHub (if applicable)

---

## ✨ Success!

You should now have:
- ✅ Backend running on http://localhost:5000
- ✅ Frontend running on http://localhost:3000
- ✅ MongoDB connected and ready
- ✅ All tests passing
- ✅ Full application functionality

**Start creating users and building your network! 🎉**

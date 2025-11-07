# Interactive User Relationship & Hobby Network

A full-stack application that manages users and their relationships using a CRUD API backend, MongoDB database, and React frontend visualized as a dynamic graph using React Flow.

![Project Banner](https://via.placeholder.com/800x200/667eea/ffffff?text=User+Relationship+%26+Hobby+Network)

## 🚀 Features

### Backend (Node.js + Express + TypeScript)
- ✅ Complete CRUD operations for users
- ✅ Friendship management with circular prevention
- ✅ Dynamic popularity score calculation
- ✅ Deletion rules enforcement (must unlink before delete)
- ✅ Comprehensive error handling
- ✅ MongoDB integration
- ✅ Input validation
- ✅ RESTful API design
- ✅ Unit tests with Jest

### Frontend (React + TypeScript + React Flow)
- ✅ Interactive graph visualization
- ✅ Custom node types (High/Low Score)
- ✅ Draggable hobby sidebar
- ✅ User management panel
- ✅ Real-time updates
- ✅ Toast notifications
- ✅ Context API state management
- ✅ Responsive design

### Bonus Features Implemented
- ✅ Custom React Flow nodes with animations
- ✅ Hobby drag-and-drop functionality
- ✅ Comprehensive test coverage
- ✅ Performance optimizations
- ✅ Development mode with nodemon
- ✅ Professional UI/UX

## 📋 Table of Contents
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **Validation**: express-validator
- **Testing**: Jest + Supertest
- **Security**: Helmet, CORS

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Visualization**: React Flow
- **State Management**: Context API
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Styling**: CSS3

## 📦 Prerequisites

Before running this application, ensure you have:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - Or use MongoDB Atlas (cloud) - [Sign up](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** package manager
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd cybernauts_Assignment
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 4. Set Up Environment Variables

#### Backend (.env)
Create a `.env` file in the `backend` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/user-network
CORS_ORIGIN=http://localhost:3000
```

For **MongoDB Atlas** (cloud):
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/user-network?retryWrites=true&w=majority
```

#### Frontend (.env)
Create a `.env` file in the `frontend` directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Option 1: Run Both Servers Separately

#### Start MongoDB (if running locally)
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

#### Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on: `http://localhost:5000`

#### Start Frontend Server
```bash
cd frontend
npm start
```
Frontend will run on: `http://localhost:3000`

### Option 2: Production Build

#### Build Backend
```bash
cd backend
npm run build
npm start
```

#### Build Frontend
```bash
cd frontend
npm run build
# Serve the build folder with a static server
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Users

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/users` | Get all users | - |
| GET | `/users/:id` | Get single user | - |
| POST | `/users` | Create new user | `{ username, age, hobbies }` |
| PUT | `/users/:id` | Update user | `{ username?, age?, hobbies? }` |
| DELETE | `/users/:id` | Delete user | - |

#### Relationships

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/users/:id/link` | Create friendship | `{ friendId }` |
| DELETE | `/users/:id/unlink` | Remove friendship | `{ friendId }` |

#### Graph

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/graph` | Get graph data (nodes + edges) | - |

### Request Examples

#### Create User
```bash
POST http://localhost:5000/api/users
Content-Type: application/json

{
  "username": "John Doe",
  "age": 28,
  "hobbies": ["Reading", "Gaming", "Cooking"]
}
```

#### Link Users (Create Friendship)
```bash
POST http://localhost:5000/api/users/{userId}/link
Content-Type: application/json

{
  "friendId": "friend-uuid-here"
}
```

### Response Examples

#### Success Response (Create User)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "John Doe",
  "age": 28,
  "hobbies": ["Reading", "Gaming", "Cooking"],
  "friends": [],
  "popularityScore": 0,
  "createdAt": "2025-11-07T10:30:00.000Z"
}
```

#### Error Response
```json
{
  "error": "Cannot delete user with active friendships. Please unlink all friends first.",
  "friendCount": 3
}
```

### Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (e.g., duplicate friendship, delete with connections)
- `500` - Internal Server Error

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

### Test Coverage Includes:
- ✅ User creation and validation
- ✅ Friendship creation and removal
- ✅ Popularity score calculation
- ✅ Deletion prevention with active connections
- ✅ Circular friendship prevention
- ✅ Graph data generation

## 📁 Project Structure

```
cybernauts_Assignment/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts          # MongoDB connection
│   │   ├── controllers/
│   │   │   └── userController.ts    # Business logic
│   │   ├── middleware/
│   │   │   └── errorHandler.ts      # Error handling
│   │   ├── models/
│   │   │   └── User.ts              # User schema & model
│   │   ├── routes/
│   │   │   └── userRoutes.ts        # API routes
│   │   ├── __tests__/
│   │   │   └── user.test.ts         # Unit tests
│   │   └── server.ts                # App entry point
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── CustomNode.tsx       # React Flow custom nodes
│   │   │   ├── GraphVisualization.tsx  # Main graph component
│   │   │   ├── HobbySidebar.tsx     # Hobbies panel
│   │   │   └── UserPanel.tsx        # User management panel
│   │   ├── context/
│   │   │   └── AppContext.tsx       # State management
│   │   ├── services/
│   │   │   └── api.ts               # API client
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript types
│   │   ├── App.tsx                  # Main app component
│   │   ├── index.tsx                # React entry point
│   │   └── *.css                    # Styling
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## 🔐 Environment Variables

### Backend Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/user-network` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |

### Frontend Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000/api` |

## 🎯 Business Logic

### Popularity Score Formula
```
popularityScore = number of unique friends + (total hobbies shared with friends × 0.5)
```

**Example:**
- User A has 2 friends
- User A shares 3 hobbies with Friend 1 and 2 hobbies with Friend 2
- Total shared hobbies = 5
- Popularity Score = 2 + (5 × 0.5) = **4.5**

### Deletion Rules
1. A user **cannot** be deleted while still connected as a friend to others
2. User must **unlink all friendships** before deletion
3. System checks both directions of friendships

### Friendship Rules
1. **No self-friendship**: User cannot be friends with themselves
2. **Circular prevention**: A→B and B→A treated as one mutual connection
3. **No duplicates**: Cannot create same friendship twice

## 🚢 Deployment

### Deploy to Render (Backend)

1. Create account on [Render](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Set build command: `cd backend && npm install && npm run build`
5. Set start command: `cd backend && npm start`
6. Add environment variables in Render dashboard

### Deploy to Vercel (Frontend)

1. Install Vercel CLI: `npm i -g vercel`
2. Build frontend:
   ```bash
   cd frontend
   npm run build
   ```
3. Deploy:
   ```bash
   vercel --prod
   ```
4. Set environment variable `REACT_APP_API_URL` to your backend URL

### Deploy to Railway

1. Create account on [Railway](https://railway.app)
2. Create new project
3. Add MongoDB from Railway database
4. Deploy backend and frontend services
5. Set environment variables

## 📊 Features Checklist

### Core Requirements
- [x] CRUD API for users
- [x] MongoDB database integration
- [x] Friendship management (link/unlink)
- [x] Popularity score calculation
- [x] Deletion prevention rules
- [x] React Flow visualization
- [x] Draggable hobbies
- [x] User management UI
- [x] Error handling & validation
- [x] TypeScript implementation

### Bonus Features
- [x] Custom React Flow node types
- [x] Node animations on score change
- [x] Unit tests (8+ test cases)
- [x] Development mode with hot reload
- [x] Toast notifications
- [x] Search/filter hobbies
- [x] Responsive design
- [x] Professional UI/UX

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

## 📝 License

This project is created for the Cybernauts Development Assignment.

## 👤 Author

**Your Name**
- GitHub: [@yourusername]
- Email: your.email@example.com

## 🙏 Acknowledgments

- React Flow for graph visualization
- MongoDB for database
- Express.js for backend framework
- React community for amazing tools

---

**Note**: Make sure MongoDB is running before starting the backend server!

For issues or questions, please open an issue on GitHub.

# Deployment Guide

This guide covers deploying the User Relationship & Hobby Network application to various platforms.

## Table of Contents
1. [MongoDB Setup](#mongodb-setup)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Complete Stack Deployment](#complete-stack-deployment)

---

## MongoDB Setup

### Option 1: MongoDB Atlas (Recommended for Production)

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select your preferred region
   - Click "Create"

3. **Setup Database Access**
   - Go to "Database Access"
   - Add New Database User
   - Set username and password
   - Set permissions to "Read and write to any database"

4. **Setup Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add specific IP addresses

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `user-network`

   Example:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/user-network?retryWrites=true&w=majority
   ```

### Option 2: Local MongoDB

1. **Install MongoDB**
   - Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your OS

2. **Start MongoDB**
   - Windows: MongoDB should auto-start as a service
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

3. **Connection String**
   ```
   mongodb://localhost:27017/user-network
   ```

---

## Backend Deployment

### Deploy to Render

1. **Prepare Repository**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create Render Account**
   - Go to [Render](https://render.com)
   - Sign up with GitHub

3. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your repository
   - Configure:
     - **Name**: user-network-api
     - **Region**: Choose closest to users
     - **Branch**: main
     - **Root Directory**: backend
     - **Runtime**: Node
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Plan**: Free
     - **Health Check Path**: /api/health

4. **Add Environment Variables**
   ```
   NODE_ENV=production
   MONGODB_URI=your-mongodb-atlas-connection-string
   PORT=10000
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL: `https://user-network-api.onrender.com`

### Deploy to Railway

1. **Create Railway Account**
   - Go to [Railway](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add MongoDB**
   - Click "New"
   - Select "Database" → "MongoDB"
   - Copy the connection string from variables

4. **Configure Backend Service**
   - Select the backend service
   - Settings → Environment:
     ```
     NODE_ENV=production
     MONGODB_URI=${{MongoDB.MONGO_URL}}
     PORT=5000
     CORS_ORIGIN=https://your-frontend.vercel.app
     ```
   - Settings → Build & Deploy:
     - **Root Directory**: /backend
     - **Build Command**: npm install && npm run build
     - **Start Command**: npm start

5. **Deploy**
   - Railway auto-deploys on push
   - Get your URL from Settings → Domains

---

## Frontend Deployment

### Deploy to Vercel (Recommended)

1. **Prepare Frontend**
   
   Update `.env` in frontend:
   ```env
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```

2. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Login to Vercel**
   ```bash
   vercel login
   ```

4. **Deploy**
   ```bash
   cd frontend
   vercel --prod
   ```

5. **Configure via Dashboard**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project
   - Settings → Environment Variables:
     - Add `REACT_APP_API_URL`
     - Value: Your backend URL + `/api`
   - Redeploy if needed

### Deploy to Netlify

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod --dir=build
   ```

4. **Configure Environment**
   - Go to Netlify Dashboard
   - Site Settings → Environment Variables
   - Add `REACT_APP_API_URL`

### Deploy with GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/repo-name",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

---

## Complete Stack Deployment

### Option 1: Deploy Everything on Render

1. **Deploy MongoDB** (Use Atlas)

2. **Deploy Backend**
   - Follow Render backend steps above

3. **Deploy Frontend as Static Site**
   - Create new Static Site on Render
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/build`
   - Environment Variables:
     ```
     REACT_APP_API_URL=https://your-backend.onrender.com/api
     ```

### Option 2: Railway (All-in-One)

Railway can host everything in one project:

```
Project/
├── MongoDB (Database)
├── Backend Service
└── Frontend Service (Static)
```

### Option 3: Split Stack (Recommended)

**Best Performance & Reliability:**
- **Database**: MongoDB Atlas
- **Backend**: Render or Railway
- **Frontend**: Vercel or Netlify

---

## Post-Deployment Checklist

### 1. Update CORS
Ensure backend allows requests from frontend domain:
```typescript
// backend/src/server.ts
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://your-frontend.vercel.app',
  credentials: true
}));
```

### 2. Test API Endpoints
```bash
# Health check
curl https://your-backend.onrender.com/health

# Get users
curl https://your-backend.onrender.com/api/users
```

### 3. Test Frontend
- Visit your frontend URL
- Test creating users
- Test creating friendships
- Verify graph visualization works

### 4. Monitor Logs
- **Render**: Dashboard → Logs
- **Railway**: Project → View Logs
- **Vercel**: Project → Deployments → View Logs

### 5. Setup Custom Domain (Optional)

**Vercel:**
```bash
vercel domains add yourdomain.com
```

**Render:**
- Dashboard → Settings → Custom Domains

---

## Environment Variables Summary

### Backend
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/user-network
CORS_ORIGIN=https://frontend-url.vercel.app
```

### Frontend
```env
REACT_APP_API_URL=https://backend-url.onrender.com/api
```

---

## Troubleshooting

### Issue: Frontend can't connect to backend
**Solution:**
1. Check CORS_ORIGIN matches frontend URL
2. Verify REACT_APP_API_URL is correct
3. Check browser console for errors

### Issue: Database connection failed
**Solution:**
1. Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
2. Check connection string is correct
3. Ensure user has proper permissions

### Issue: Build fails
**Solution:**
1. Run `npm install` locally
2. Fix any TypeScript errors
3. Test build locally: `npm run build`

### Issue: Free tier limitations
**Render Free Tier:**
- Services spin down after 15 min of inactivity
- First request may be slow (cold start)

**Solution:** Consider upgrading or use Railway (hobby plan)

---

## Performance Optimization

### 1. Enable Compression
```typescript
import compression from 'compression';
app.use(compression());
```

### 2. Add Caching Headers
```typescript
app.use(express.static('public', {
  maxAge: '1d'
}));
```

### 3. Use CDN for Frontend
- Vercel automatically uses CDN
- Netlify has built-in CDN

### 4. Database Indexing
Already implemented in User model:
```typescript
UserSchema.index({ id: 1 });
UserSchema.index({ username: 1 });
```

---

## Monitoring & Maintenance

### 1. Setup Health Checks
Already implemented:
```typescript
GET /health
```

### 2. Error Tracking
Consider adding:
- [Sentry](https://sentry.io) for error tracking
- [LogRocket](https://logrocket.com) for session replay

### 3. Analytics
- [Google Analytics](https://analytics.google.com)
- [Plausible](https://plausible.io) (privacy-friendly)

---

## Security Best Practices

### 1. Use HTTPS
- All modern platforms enable HTTPS by default
- Ensure no mixed content (HTTP resources on HTTPS page)

### 2. Environment Variables
- Never commit `.env` files
- Use platform-specific secret management

### 3. Rate Limiting
Add to backend:
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 4. Helmet Security Headers
Already implemented in server.ts

---

## Cost Estimation

### Free Tier (Development)
- **MongoDB Atlas**: Free (M0 cluster)
- **Render**: Free (with limitations)
- **Vercel**: Free (hobby projects)
- **Total**: $0/month

### Production (Recommended)
- **MongoDB Atlas**: $9-57/month (M2-M10)
- **Render**: $7-25/month (Starter/Standard)
- **Vercel**: Free-$20/month (Pro if needed)
- **Total**: $16-102/month

---

## Support & Resources

- **MongoDB**: https://docs.mongodb.com
- **Render**: https://render.com/docs
- **Vercel**: https://vercel.com/docs
- **Railway**: https://docs.railway.app

For issues specific to this project, create an issue on GitHub.

# Render Deployment Fix

## Issue
The deployment failed with: `sh: 1: nodemon: not found`

## Root Cause
Render was trying to run `npm run dev` which uses `nodemon` (a development dependency) instead of the production build.

## Solution

### 1. Update Render Build Settings

Go to your Render dashboard and update the service settings:

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

### 2. Environment Variables

Make sure these environment variables are set in Render:

```
NODE_ENV=production
MONGODB_URI=your-mongodb-atlas-connection-string
PORT=10000
CORS_ORIGIN=https://your-frontend-url.onrender.com
```

### 3. Root Directory

Set the **Root Directory** to: `backend`

### 4. Deploy Again

Click "Manual Deploy" → "Deploy latest commit"

## Alternative: Using render.yaml

If you prefer infrastructure as code, the `render.yaml` file is already configured. 

1. Go to Render Dashboard
2. Click "New +" → "Blueprint"
3. Connect your repository
4. Render will automatically detect and use the `render.yaml` configuration

## Verification

Once deployed, check:

1. **Health Check**: `https://your-app.onrender.com/api/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

2. **API Endpoint**: `https://your-app.onrender.com/api/users`
   - Should return: `[]` (empty array if no users)

## Common Issues

### Build Fails
- **Issue**: Dependencies not installing
- **Fix**: Make sure `package.json` is in the `backend` folder

### Server Won't Start
- **Issue**: Missing environment variables
- **Fix**: Add `MONGODB_URI` in Render environment variables

### Connection Timeout
- **Issue**: MongoDB Atlas not allowing Render IPs
- **Fix**: In MongoDB Atlas, go to Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

### Port Binding Error
- **Issue**: App trying to use wrong port
- **Fix**: Make sure your code uses `process.env.PORT` (Render injects this automatically)

## Testing Locally

Before deploying, test the production build locally:

```bash
cd backend
npm run build
npm start
```

This should start the server using the compiled JavaScript from the `dist` folder.

## Next Steps

1. ✅ Fix backend deployment
2. Deploy frontend to Vercel/Netlify/Render
3. Update frontend `REACT_APP_API_URL` with backend URL
4. Test complete application

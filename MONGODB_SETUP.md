# MongoDB Setup for Render Deployment

## Current Issue
```
❌ Error connecting to MongoDB: MongoParseError: Invalid scheme, 
expected connection string to start with "mongodb://" or "mongodb+srv://"
```

## Root Cause
The `MONGODB_URI` environment variable is not set or is invalid in your Render service.

## Solution: Set Up MongoDB Atlas (Free Tier)

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Verify your email

### Step 2: Create a Free Cluster

1. Click **"Build a Database"**
2. Select **"M0 FREE"** tier
3. Choose a cloud provider and region (pick closest to your Render region)
4. Cluster Name: `user-network-cluster`
5. Click **"Create"**

### Step 3: Configure Database Access

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set username: `renderuser` (or any name you prefer)
5. Set password: Generate a secure password and **SAVE IT**
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### Step 4: Configure Network Access

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is required because Render uses dynamic IPs
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Go back to **"Database"** in the sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**
5. Version: **5.5 or later**
6. Copy the connection string - it looks like:
   ```
   mongodb+srv://renderuser:<password>@user-network-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Prepare the Connection String

Replace `<password>` with your actual database user password and add the database name:

```
mongodb+srv://renderuser:YOUR_ACTUAL_PASSWORD@user-network-cluster.xxxxx.mongodb.net/user-network?retryWrites=true&w=majority
```

**Important:** 
- Replace `YOUR_ACTUAL_PASSWORD` with the password you created
- Add `/user-network` before the `?` to specify the database name
- If your password contains special characters, URL encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`
  - `&` → `%26`

### Step 7: Add to Render Environment Variables

1. Go to your Render dashboard
2. Click on your **"user-network-backend"** service
3. Click **"Environment"** in the left sidebar
4. Click **"Add Environment Variable"**
5. Key: `MONGODB_URI`
6. Value: Paste your complete connection string
7. Click **"Save Changes"**

### Step 8: Redeploy

Render will automatically redeploy with the new environment variable. If not:
1. Go to **"Manual Deploy"**
2. Click **"Deploy latest commit"**

## Verification

Once deployed, check the logs. You should see:
```
✅ Connected to MongoDB successfully
🚀 Server running on port 10000
```

## Example Environment Variables in Render

Your Render service should have these environment variables set:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://renderuser:password123@user-network-cluster.xxxxx.mongodb.net/user-network?retryWrites=true&w=majority
PORT=10000
CORS_ORIGIN=https://your-frontend-url.onrender.com
```

## Test Your API

Once the deployment succeeds, test these endpoints:

**Health Check:**
```bash
curl https://your-app-name.onrender.com/api/health
```

Should return:
```json
{"status":"ok","message":"Server is running"}
```

**Get Users:**
```bash
curl https://your-app-name.onrender.com/api/users
```

Should return:
```json
[]
```

## Troubleshooting

### Issue: "Authentication failed"
- **Solution**: Double-check your username and password in the connection string
- Make sure the user has "Read and write" permissions

### Issue: "Connection timeout"
- **Solution**: Verify Network Access allows 0.0.0.0/0
- Wait a few minutes for MongoDB Atlas to propagate the changes

### Issue: "Database not found"
- **Solution**: MongoDB will create the database automatically on first write
- Make sure your connection string includes `/user-network` before the query parameters

### Issue: Still getting "Invalid scheme" error
- **Solution**: Make sure your connection string starts with `mongodb+srv://`
- No extra spaces before or after the connection string
- Value is properly saved in Render environment variables

## Next Steps

After successful deployment:
1. ✅ Backend API is live
2. Deploy frontend to Vercel/Netlify
3. Update frontend `.env` with backend URL
4. Test the complete application

---

**Need Help?**
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Render Docs: https://render.com/docs

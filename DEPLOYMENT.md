# Deployment Guide for GeoShield

This guide explains how to deploy GeoShield to production. Since the app has both a frontend and backend, they need to be deployed separately.

## Architecture

- **Frontend**: Deploy to Netlify
- **Backend**: Deploy to Railway, Render, or similar service

---

## Step 1: Deploy Backend Server

Netlify doesn't support persistent Socket.io servers, so you need a separate hosting service.

### Option A: Railway (Recommended - Free tier available)

1. **Sign up**: Go to [railway.app](https://railway.app) and sign up with GitHub

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your GeoShield repository

3. **Configure Service**:
   - Click on the service
   - Go to "Settings" → "Root Directory"
   - Set to: `server`
   - Go to "Settings" → "Deploy"
   - Build command: `npm install` (or leave empty)
   - Start command: `npm start`

4. **Set Environment Variables**:
   - Go to "Variables" tab
   - Add:
     ```
     PORT=3001
     CLIENT_URL=https://your-netlify-app.netlify.app
     ```
   - Note: You'll update CLIENT_URL after deploying frontend

5. **Get Backend URL**:
   - Railway will give you a URL like: `https://your-app.railway.app`
   - Copy this URL - you'll need it for the frontend

### Option B: Render (Alternative)

1. Go to [render.com](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Settings:
   - **Name**: geoshield-backend
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `PORT=3001`
   - `CLIENT_URL=https://your-netlify-app.netlify.app`
6. Click "Create Web Service"
7. Copy the service URL (e.g., `https://geoshield-backend.onrender.com`)

---

## Step 2: Deploy Frontend to Netlify

### Method 1: Via Netlify Dashboard (Recommended)

1. **Prepare Your Repository**:
   - Make sure your code is pushed to GitHub
   - Ensure `netlify.toml` is in the root directory

2. **Sign up/Login to Netlify**:
   - Go to [app.netlify.com](https://app.netlify.com)
   - Sign up or login (GitHub login recommended)

3. **Create New Site**:
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your GitHub
   - Select your GeoShield repository

4. **Configure Build Settings**:
   Netlify should auto-detect from `netlify.toml`, but verify:
   - **Base directory**: `client`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `client/dist`

5. **Set Environment Variables**:
   - Go to "Site settings" → "Environment variables"
   - Click "Add variable" and add:
     ```
     VITE_API_URL=https://your-backend-url.railway.app
     VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
     ```
   - Replace `your-backend-url.railway.app` with your actual backend URL from Step 1

6. **Deploy**:
   - Click "Deploy site"
   - Wait for build to complete (usually 2-3 minutes)

7. **Get Your Frontend URL**:
   - Netlify will give you a URL like: `https://your-app-name.netlify.app`
   - Copy this URL

8. **Update Backend CORS**:
   - Go back to your backend service (Railway/Render)
   - Update the `CLIENT_URL` environment variable to your Netlify URL:
     ```
     CLIENT_URL=https://your-app-name.netlify.app
     ```
   - Redeploy the backend

### Method 2: Via Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**:
   ```bash
   netlify login
   ```

3. **Initialize**:
   ```bash
   cd client
   netlify init
   ```
   - Choose "Create & configure a new site"
   - Follow the prompts

4. **Set Environment Variables**:
   ```bash
   netlify env:set VITE_API_URL https://your-backend-url.railway.app
   netlify env:set VITE_GOOGLE_MAPS_API_KEY your_google_maps_api_key_here
   ```

5. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

---

## Step 3: Update Environment Variables

After both are deployed, make sure:

1. **Frontend (Netlify)** has:
   - `VITE_API_URL` = your backend URL
   - `VITE_GOOGLE_MAPS_API_KEY` = your Google Maps key

2. **Backend (Railway/Render)** has:
   - `PORT` = 3001 (or let it auto-assign)
   - `CLIENT_URL` = your Netlify URL

---

## Step 4: Test Your Deployment

1. Visit your Netlify URL: `https://your-app.netlify.app`
2. Try to:
   - Sign up/Login
   - Create a help request
   - Check if real-time updates work

---

## Troubleshooting

### Build Fails on Netlify

1. **Check Build Logs**:
   - Go to Netlify → Deploys → Click on failed deploy
   - Look for error messages

2. **Common Issues**:
   - Missing environment variables → Add them in Netlify settings
   - Node version mismatch → Set `NODE_VERSION=18` in netlify.toml
   - Build command error → Check `client/package.json` scripts

### Backend Connection Issues

1. **CORS Errors**:
   - Make sure `CLIENT_URL` in backend matches your Netlify URL exactly
   - Check backend logs for CORS errors

2. **Socket.io Connection Fails**:
   - Verify backend URL is correct in frontend `VITE_API_URL`
   - Check that backend is running and accessible
   - Some hosting services require WebSocket support (Railway and Render support it)

### Environment Variables Not Working

- Netlify: Variables must start with `VITE_` to be accessible in Vite
- Rebuild after adding variables: Netlify needs to rebuild to pick up new env vars
- Check variable names match exactly (case-sensitive)

---

## Custom Domain (Optional)

1. In Netlify Dashboard → Domain settings
2. Click "Add custom domain"
3. Follow the DNS configuration instructions

---

## Continuous Deployment

Both services support automatic deployments:
- **Netlify**: Auto-deploys on push to main branch (default)
- **Railway/Render**: Auto-deploys on push to main branch (default)

Just push to GitHub and both will redeploy automatically!

---

## Cost Estimate

- **Netlify**: Free tier (100GB bandwidth, 300 build minutes/month)
- **Railway**: Free tier ($5 credit/month, enough for small apps)
- **Render**: Free tier (spins down after inactivity, but free)

Total: **$0/month** for small to medium usage!


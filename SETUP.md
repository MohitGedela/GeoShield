# Quick Setup Guide

## Step 1: Create Environment File

Create a `.env` file in the root directory with the following content:

```
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_API_URL=http://localhost:3001
PORT=3001
CLIENT_URL=http://localhost:5173
```

**Important**: Replace `your_google_maps_api_key_here` with your actual Google Maps API key.

## Step 2: Install Dependencies

### Backend
```bash
cd server
npm install
```

### Frontend
```bash
cd client
npm install
```

## Step 3: Run the Application

### Terminal 1 - Start Backend Server
```bash
cd server
npm start
```
Server will run on http://localhost:3001

### Terminal 2 - Start Frontend
```bash
cd client
npm run dev
```
App will run on http://localhost:5173

## Step 4: Open in Browser

Navigate to http://localhost:5173

## Getting a Google Maps API Key

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Library"
4. Search for "Maps JavaScript API" and enable it
5. Go to "APIs & Services" > "Credentials"
6. Click "Create Credentials" > "API Key"
7. Copy the API key and add it to your `.env` file

## Troubleshooting

- **Map not loading**: Make sure you've added a valid Google Maps API key to `.env`
- **Socket.io connection errors**: Ensure the backend server is running on port 3001
- **Port already in use**: Change the PORT in `.env` or kill the process using that port


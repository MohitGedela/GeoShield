# GeoShield - Disaster Response Platform

A real-time web application that coordinates emergency disaster response by connecting survivors who need help with volunteers who can provide help, all visualized on an interactive map.

## Features

- **Survivor Mode**: Request help, check in as safe, find nearby safe zones
- **Volunteer Mode**: View requests, accept missions, track completed missions
- **Coordinator Mode**: Monitor operations, manage resources, view statistics
- **Real-time Updates**: Socket.io for live synchronization
- **Interactive Maps**: Google Maps integration with color-coded markers

## Tech Stack

- Frontend: React + Vite
- Styling: Tailwind CSS
- Maps: Google Maps API
- Real-time: Socket.io
- Backend: Node.js + Express
- State Management: React Context API

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Google Maps API key

### Getting a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Maps JavaScript API"
4. Create credentials (API Key)
5. Copy the API key

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../client
   npm install
   ```

4. Create environment files:
   
   **Client (.env file in `client/` directory):**
   ```bash
   cd client
   # Create .env file with:
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyAhHWeOvNSPwDlVzqd4Sc79wZhhdLMwjgU
   VITE_API_URL=http://localhost:3001
   VITE_PORT=5173
   ```
   
   **Server (.env file in `server/` directory):**
   ```bash
   cd server
   # Create .env file with:
   PORT=3001
   CLIENT_URL=http://localhost:5173
   ```
   
   See `client/.env.example` and `server/.env.example` for reference.

### Running the Application

**Quick Start (Recommended):**

Option 1 - PowerShell Script (Windows):
```powershell
.\start-app.ps1
```


Both methods start backend and frontend servers automatically.


3. Open http://localhost:5173 in your browser



## Sample Data

The application comes preloaded with:
- 8 safe zones in Hamilton, Ontario
- 12 active volunteers with various skills
- Realistic addresses and locations

## Development Notes

- Uses in-memory data storage (no database required for demo)
- Real-time updates via Socket.io WebSocket connections
- Mobile-responsive design
- Color-coded markers for easy visualization

##

Done By: Kabir, Mohit, Lohit, Manasvi

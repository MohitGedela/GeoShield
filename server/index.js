import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { sampleData } from './data.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// In-memory data store
let data = {
  safeZones: [...sampleData.safeZones],
  requests: [...sampleData.requests],
  volunteers: [...sampleData.volunteers],
  checkIns: []
};

// API Routes
app.get('/api/safe-zones', (req, res) => {
  res.json(data.safeZones);
});

app.get('/api/requests', (req, res) => {
  res.json(data.requests);
});

app.get('/api/volunteers', (req, res) => {
  res.json(data.volunteers);
});

app.post('/api/requests', (req, res) => {
  const newRequest = {
    id: `req${Date.now()}`,
    ...req.body,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  data.requests.push(newRequest);
  
  // Emit to all connected clients
  io.emit('newRequest', newRequest);
  
  res.json(newRequest);
});

app.put('/api/requests/:id', (req, res) => {
  const { id } = req.params;
  const index = data.requests.findIndex(r => r.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Request not found' });
  }
  
  data.requests[index] = { ...data.requests[index], ...req.body };
  
  // Emit update to all clients
  io.emit('requestUpdated', data.requests[index]);
  
  res.json(data.requests[index]);
});

app.post('/api/volunteers', (req, res) => {
  const newVolunteer = {
    id: `vol${Date.now()}`,
    ...req.body,
    activeMissions: [],
    completedMissions: 0,
    status: 'Available'
  };
  data.volunteers.push(newVolunteer);
  
  io.emit('volunteerRegistered', newVolunteer);
  res.json(newVolunteer);
});

app.post('/api/check-in', (req, res) => {
  const checkIn = {
    id: `check${Date.now()}`,
    ...req.body,
    timestamp: new Date().toISOString()
  };
  data.checkIns.push(checkIn);
  
  io.emit('checkIn', checkIn);
  res.json(checkIn);
});

app.put('/api/safe-zones/:id', (req, res) => {
  const { id } = req.params;
  const index = data.safeZones.findIndex(sz => sz.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Safe zone not found' });
  }
  
  data.safeZones[index] = { ...data.safeZones[index], ...req.body };
  
  io.emit('safeZoneUpdated', data.safeZones[index]);
  res.json(data.safeZones[index]);
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
  
  // Volunteer accepts a request
  socket.on('acceptRequest', ({ requestId, volunteerId, volunteerName }) => {
    const request = data.requests.find(r => r.id === requestId);
    if (request && request.status === 'Pending') {
      request.status = 'Assigned';
      request.assignedVolunteerId = volunteerId;
      request.assignedVolunteerName = volunteerName;
      
      const volunteer = data.volunteers.find(v => v.id === volunteerId);
      if (volunteer) {
        volunteer.activeMissions.push(requestId);
        volunteer.status = 'Active';
      }
      
      io.emit('requestUpdated', request);
      io.emit('volunteerUpdated', volunteer);
    }
  });
  
  // Mark request as complete
  socket.on('completeRequest', ({ requestId, volunteerId }) => {
    const request = data.requests.find(r => r.id === requestId);
    if (request) {
      request.status = 'Fulfilled';
      request.completedAt = new Date().toISOString();
      
      const volunteer = data.volunteers.find(v => v.id === volunteerId);
      if (volunteer) {
        volunteer.activeMissions = volunteer.activeMissions.filter(id => id !== requestId);
        volunteer.completedMissions += 1;
        if (volunteer.activeMissions.length === 0) {
          volunteer.status = 'Available';
        }
      }
      
      io.emit('requestUpdated', request);
      io.emit('volunteerUpdated', volunteer);
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


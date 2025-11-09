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
  survivors: [],
  coordinators: [],
  checkIns: [],
  messages: [],
  verifications: {} // phone -> { code, expiresAt, userType }
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

app.get('/api/survivors', (req, res) => {
  res.json(data.survivors);
});

app.get('/api/coordinators', (req, res) => {
  res.json(data.coordinators);
});

app.get('/api/users', (req, res) => {
  // Coordinator endpoint to get all users
  res.json({
    volunteers: data.volunteers,
    survivors: data.survivors,
    coordinators: data.coordinators
  });
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

// Phone verification endpoints
app.post('/api/verify/send-code', (req, res) => {
  const { phone, userType } = req.body;
  
  if (!phone || !userType) {
    return res.status(400).json({ error: 'Phone and userType are required' });
  }
  
  // Generate 6-digit verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  data.verifications[phone] = {
    code,
    expiresAt,
    userType
  };
  
  // In production, send SMS here. For demo, we'll return the code
  console.log(`Verification code for ${phone}: ${code}`);
  
  res.json({ 
    success: true, 
    message: 'Verification code sent',
    // In production, remove this. For demo only:
    code: code
  });
});

app.post('/api/verify/verify-code', (req, res) => {
  const { phone, code } = req.body;
  
  if (!phone || !code) {
    return res.status(400).json({ error: 'Phone and code are required' });
  }
  
  const verification = data.verifications[phone];
  
  if (!verification) {
    return res.status(400).json({ error: 'No verification code found for this phone' });
  }
  
  if (Date.now() > verification.expiresAt) {
    delete data.verifications[phone];
    return res.status(400).json({ error: 'Verification code expired' });
  }
  
  if (verification.code !== code) {
    return res.status(400).json({ error: 'Invalid verification code' });
  }
  
  // Verification successful
  delete data.verifications[phone];
  res.json({ success: true, userType: verification.userType });
});

// User registration endpoints
app.post('/api/volunteers', (req, res) => {
  const { phone, verified } = req.body;
  
  if (!verified) {
    return res.status(400).json({ error: 'Phone must be verified' });
  }
  
  // Check if phone already exists
  const existing = data.volunteers.find(v => v.phone === phone);
  if (existing) {
    return res.status(400).json({ error: 'Phone number already registered' });
  }
  
  const newVolunteer = {
    id: `vol${Date.now()}`,
    ...req.body,
    activeMissions: [],
    completedMissions: 0,
    status: 'Available',
    verified: true,
    createdAt: new Date().toISOString()
  };
  delete newVolunteer.verified; // Remove from stored data
  
  data.volunteers.push(newVolunteer);
  
  io.emit('volunteerRegistered', newVolunteer);
  res.json(newVolunteer);
});

app.post('/api/survivors', (req, res) => {
  const { phone, verified } = req.body;
  
  if (!verified) {
    return res.status(400).json({ error: 'Phone must be verified' });
  }
  
  // Check if phone already exists
  const existing = data.survivors.find(s => s.phone === phone);
  if (existing) {
    return res.status(400).json({ error: 'Phone number already registered' });
  }
  
  const newSurvivor = {
    id: `surv${Date.now()}`,
    ...req.body,
    verified: true,
    createdAt: new Date().toISOString()
  };
  delete newSurvivor.verified;
  
  data.survivors.push(newSurvivor);
  
  io.emit('survivorRegistered', newSurvivor);
  res.json(newSurvivor);
});

app.post('/api/coordinators', (req, res) => {
  const { phone, verified } = req.body;
  
  if (!verified) {
    return res.status(400).json({ error: 'Phone must be verified' });
  }
  
  // Check if phone already exists
  const existing = data.coordinators.find(c => c.phone === phone);
  if (existing) {
    return res.status(400).json({ error: 'Phone number already registered' });
  }
  
  const newCoordinator = {
    id: `coord${Date.now()}`,
    ...req.body,
    verified: true,
    createdAt: new Date().toISOString()
  };
  delete newCoordinator.verified;
  
  data.coordinators.push(newCoordinator);
  
  io.emit('coordinatorRegistered', newCoordinator);
  res.json(newCoordinator);
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

// Messaging endpoints
app.post('/api/messages', (req, res) => {
  const { fromCoordinatorId, toUserId, toUserType, message, requestId } = req.body;
  
  const newMessage = {
    id: `msg${Date.now()}`,
    fromCoordinatorId,
    toUserId,
    toUserType, // 'volunteer' or 'survivor'
    message,
    requestId: requestId || null,
    createdAt: new Date().toISOString(),
    read: false
  };
  
  data.messages.push(newMessage);
  
  // Emit to specific user if they're connected
  io.emit('newMessage', newMessage);
  
  res.json(newMessage);
});

app.get('/api/messages/:userId', (req, res) => {
  const { userId } = req.params;
  const userMessages = data.messages.filter(m => m.toUserId === userId);
  res.json(userMessages);
});

app.put('/api/messages/:id/read', (req, res) => {
  const { id } = req.params;
  const message = data.messages.find(m => m.id === id);
  if (message) {
    message.read = true;
    io.emit('messageRead', message);
    res.json(message);
  } else {
    res.status(404).json({ error: 'Message not found' });
  }
});

// Forward alert/request to volunteers
app.post('/api/alerts/forward', (req, res) => {
  const { requestId, volunteerIds, message } = req.body;
  
  const request = data.requests.find(r => r.id === requestId);
  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }
  
  const forwardedAlerts = [];
  
  volunteerIds.forEach(volunteerId => {
    const alert = {
      id: `alert${Date.now()}_${volunteerId}`,
      requestId,
      volunteerId,
      message: message || `New urgent request: ${request.type}`,
      createdAt: new Date().toISOString(),
      read: false
    };
    
    forwardedAlerts.push(alert);
    io.emit('alertForwarded', alert);
  });
  
  res.json({ success: true, alerts: forwardedAlerts });
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
  
  // Coordinator sends message
  socket.on('sendMessage', ({ fromCoordinatorId, toUserId, toUserType, message, requestId }) => {
    const newMessage = {
      id: `msg${Date.now()}`,
      fromCoordinatorId,
      toUserId,
      toUserType,
      message,
      requestId: requestId || null,
      createdAt: new Date().toISOString(),
      read: false
    };
    
    data.messages.push(newMessage);
    io.emit('newMessage', newMessage);
  });
  
  // Forward alert to volunteers
  socket.on('forwardAlert', ({ requestId, volunteerIds, message }) => {
    const request = data.requests.find(r => r.id === requestId);
    if (!request) return;
    
    volunteerIds.forEach(volunteerId => {
      const alert = {
        id: `alert${Date.now()}_${volunteerId}`,
        requestId,
        volunteerId,
        message: message || `New urgent request: ${request.type}`,
        createdAt: new Date().toISOString(),
        read: false
      };
      
      io.emit('alertForwarded', alert);
    });
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


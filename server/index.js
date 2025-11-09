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
  users: [], // Unified users (role: 'user' or 'staff')
  checkIns: [],
  messages: [],
  verifications: {} // phone -> { code, expiresAt }
};

// API Routes
app.get('/api/safe-zones', (req, res) => {
  res.json(data.safeZones);
});

app.get('/api/requests', (req, res) => {
  res.json(data.requests);
});

app.get('/api/users', (req, res) => {
  // Return all users (for staff to view)
  const usersWithoutPasswords = data.users.map(u => {
    const { password, ...userWithoutPassword } = u;
    return userWithoutPassword;
  });
  res.json(usersWithoutPasswords);
});

app.post('/api/requests', (req, res) => {
  const newRequest = {
    id: `req${Date.now()}`,
    ...req.body,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  
  // Update field names for consistency
  if (newRequest.userId) {
    newRequest.survivorId = newRequest.userId;
    const user = data.users.find(u => u.id === newRequest.userId);
    if (user) {
      newRequest.survivorName = user.name;
      newRequest.survivorPhone = user.phone;
    }
  }
  
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
  const { phone } = req.body;
  
  if (!phone) {
    return res.status(400).json({ error: 'Phone is required' });
  }
  
  // Generate 6-digit verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  data.verifications[phone] = {
    code,
    expiresAt
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
  res.json({ success: true });
});

// Authentication endpoints
app.post('/api/auth/signup', (req, res) => {
  const { phone, name, password, role, verified } = req.body;
  
  if (!phone || !name || !password || !role) {
    return res.status(400).json({ error: 'Phone, name, password, and role are required' });
  }
  
  if (!verified) {
    return res.status(400).json({ error: 'Phone must be verified' });
  }
  
  // Check if phone already exists
  const existingByPhone = data.users.find(u => u.phone === phone);
  if (existingByPhone) {
    return res.status(400).json({ error: 'Phone number already registered' });
  }
  
  // Check if name already exists
  const existingByName = data.users.find(u => u.name === name);
  if (existingByName) {
    return res.status(400).json({ error: 'Username already taken' });
  }
  
  // Validate role
  if (role !== 'user' && role !== 'staff') {
    return res.status(400).json({ error: 'Invalid role. Must be "user" or "staff"' });
  }
  
  const newUser = {
    id: `user${Date.now()}`,
    phone,
    name,
    password, // In production, hash this!
    role,
    activeMissions: [],
    completedMissions: 0,
    status: role === 'user' ? 'Available' : 'Active',
    createdAt: new Date().toISOString()
  };
  
  // Add additional fields for users who can volunteer
  if (role === 'user') {
    newUser.skills = [];
    newUser.resources = [];
    newUser.availability = '8am-8pm';
    newUser.lat = 43.2557;
    newUser.lng = -79.8711;
  }
  
  data.users.push(newUser);
  
  // Return user without password
  const { password: _, ...userResponse } = newUser;
  io.emit('userRegistered', userResponse);
  res.json(userResponse);
});

app.post('/api/auth/login', (req, res) => {
  const { name, password } = req.body;
  
  if (!name || !password) {
    return res.status(400).json({ error: 'Name and password are required' });
  }
  
  const user = data.users.find(u => u.name === name);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  if (user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Return user without password
  const { password: _, ...userResponse } = user;
  res.json(userResponse);
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
  const { fromStaffId, toUserId, message, requestId } = req.body;
  
  const newMessage = {
    id: `msg${Date.now()}`,
    fromStaffId,
    toUserId,
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

// Send alert to one or all users
app.post('/api/alerts/send', (req, res) => {
  const { fromStaffId, toUserId, message } = req.body;
  
  // If toUserId is null or 'all', send to all users
  if (!toUserId || toUserId === 'all') {
    const allUsers = data.users.filter(u => u.role === 'user');
    const alerts = allUsers.map(user => ({
      id: `alert${Date.now()}_${user.id}`,
      fromStaffId,
      toUserId: user.id,
      message,
      createdAt: new Date().toISOString(),
      read: false
    }));
    
    alerts.forEach(alert => {
      data.messages.push(alert);
      io.emit('newMessage', alert);
    });
    
    res.json({ success: true, alerts });
  } else {
    // Send to specific user
    const alert = {
      id: `alert${Date.now()}_${toUserId}`,
      fromStaffId,
      toUserId,
      message,
      createdAt: new Date().toISOString(),
      read: false
    };
    
    data.messages.push(alert);
    io.emit('newMessage', alert);
    
    res.json({ success: true, alert });
  }
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
      
      const volunteer = data.users.find(v => v.id === volunteerId && v.role === 'user');
      if (volunteer) {
        volunteer.activeMissions.push(requestId);
        volunteer.status = 'Active';
      }
      
      io.emit('requestUpdated', request);
      if (volunteer) {
        io.emit('userUpdated', volunteer);
      }
    }
  });
  
  // Mark request as complete
  socket.on('completeRequest', ({ requestId, volunteerId }) => {
    const request = data.requests.find(r => r.id === requestId);
    if (request) {
      request.status = 'Fulfilled';
      request.completedAt = new Date().toISOString();
      
      const volunteer = data.users.find(v => v.id === volunteerId && v.role === 'user');
      if (volunteer) {
        volunteer.activeMissions = volunteer.activeMissions.filter(id => id !== requestId);
        volunteer.completedMissions += 1;
        if (volunteer.activeMissions.length === 0) {
          volunteer.status = 'Available';
        }
      }
      
      io.emit('requestUpdated', request);
      if (volunteer) {
        io.emit('userUpdated', volunteer);
      }
    }
  });
  
  // Staff sends message
  socket.on('sendMessage', ({ fromStaffId, toUserId, message, requestId }) => {
    const newMessage = {
      id: `msg${Date.now()}`,
      fromStaffId,
      toUserId,
      message,
      requestId: requestId || null,
      createdAt: new Date().toISOString(),
      read: false
    };
    
    data.messages.push(newMessage);
    io.emit('newMessage', newMessage);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


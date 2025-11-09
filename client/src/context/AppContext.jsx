import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const AppContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error('VITE_API_URL environment variable is required. Please set it in your .env file.');
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [userMode, setUserMode] = useState(null);
  const [safeZones, setSafeZones] = useState([]);
  const [requests, setRequests] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(API_URL);
    setSocket(newSocket);

    // Load initial data
    loadData();

    // Socket event listeners
    newSocket.on('newRequest', (request) => {
      setRequests(prev => {
        // Check if request already exists to avoid duplicates
        const exists = prev.find(r => r.id === request.id);
        if (exists) return prev;
        return [...prev, request];
      });
      if (userMode === 'volunteer' || currentUser?.role === 'user') {
        showToast('New request for help!', 'info');
      }
    });

    newSocket.on('requestUpdated', (request) => {
      setRequests(prev => prev.map(r => r.id === request.id ? request : r));
    });

    newSocket.on('volunteerRegistered', (volunteer) => {
      setVolunteers(prev => [...prev, volunteer]);
    });

    newSocket.on('volunteerUpdated', (volunteer) => {
      setVolunteers(prev => prev.map(v => v.id === volunteer.id ? volunteer : v));
    });

    newSocket.on('checkIn', (checkIn) => {
      showToast('New check-in received', 'info');
    });

    newSocket.on('newMessage', (message) => {
      if (message.toUserId === currentUser?.id) {
        showToast('New message from coordinator', 'info');
      }
    });

    newSocket.on('alertForwarded', (alert) => {
      if (alert.volunteerId === currentUser?.id) {
        showToast('New alert forwarded to you', 'info');
      }
    });

    return () => {
      newSocket.close();
    };
  }, [userMode, currentUser]);

  const loadData = async () => {
    try {
      const [zonesRes, requestsRes] = await Promise.all([
        axios.get(`${API_URL}/api/safe-zones`),
        axios.get(`${API_URL}/api/requests`)
      ]);
      
      setSafeZones(zonesRes.data);
      setRequests(requestsRes.data);
      
      // Get volunteers (users with role 'user')
      const usersRes = await axios.get(`${API_URL}/api/users`);
      const volunteers = usersRes.data.filter(u => u.role === 'user');
      setVolunteers(volunteers);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  };

  const createRequest = async (requestData) => {
    try {
      const requestWithUserId = {
        ...requestData,
        userId: currentUser?.id
      };
      const response = await axios.post(`${API_URL}/api/requests`, requestWithUserId);
      // Don't add to state here - let Socket.io handle it to avoid duplicates
      showToast('Help request submitted successfully', 'success');
      return response.data;
    } catch (error) {
      console.error('Error creating request:', error);
      showToast('Failed to submit request', 'error');
      throw error;
    }
  };

  const acceptRequest = (requestId, volunteerId, volunteerName) => {
    if (socket) {
      socket.emit('acceptRequest', { requestId, volunteerId, volunteerName });
      showToast('Request accepted!', 'success');
    }
  };

  const completeRequest = (requestId, volunteerId) => {
    if (socket) {
      socket.emit('completeRequest', { requestId, volunteerId });
      showToast('Request marked as complete!', 'success');
    }
  };

  const registerVolunteer = async (volunteerData) => {
    try {
      const response = await axios.post(`${API_URL}/api/volunteers`, volunteerData);
      setVolunteers(prev => [...prev, response.data]);
      setCurrentUser(response.data);
      showToast('Registration successful!', 'success');
      return response.data;
    } catch (error) {
      console.error('Error registering volunteer:', error);
      showToast('Registration failed', 'error');
      throw error;
    }
  };

  const checkIn = async (checkInData) => {
    try {
      const response = await axios.post(`${API_URL}/api/check-in`, checkInData);
      showToast('Check-in recorded', 'success');
      return response.data;
    } catch (error) {
      console.error('Error checking in:', error);
      showToast('Check-in failed', 'error');
      throw error;
    }
  };

  const sendVerificationCode = async (phone) => {
    try {
      const response = await axios.post(`${API_URL}/api/verify/send-code`, { phone });
      return response.data;
    } catch (error) {
      console.error('Error sending verification code:', error);
      showToast('Failed to send verification code', 'error');
      throw error;
    }
  };

  const verifyCode = async (phone, code) => {
    try {
      const response = await axios.post(`${API_URL}/api/verify/verify-code`, { phone, code });
      return response.data;
    } catch (error) {
      console.error('Error verifying code:', error);
      showToast(error.response?.data?.error || 'Invalid verification code', 'error');
      throw error;
    }
  };

  const login = async (name, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { name, password });
      setCurrentUser(response.data);
      showToast('Login successful!', 'success');
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      showToast(error.response?.data?.error || 'Login failed', 'error');
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, userData);
      setCurrentUser(response.data);
      showToast('Registration successful!', 'success');
      return response.data;
    } catch (error) {
      console.error('Error signing up:', error);
      showToast(error.response?.data?.error || 'Registration failed', 'error');
      throw error;
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  const sendMessage = async (messageData) => {
    try {
      if (socket) {
        socket.emit('sendMessage', messageData);
        const response = await axios.post(`${API_URL}/api/messages`, messageData);
        return response.data;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('Failed to send message', 'error');
      throw error;
    }
  };

  const sendAlert = async (fromStaffId, toUserId, message) => {
    try {
      const response = await axios.post(`${API_URL}/api/alerts/send`, { fromStaffId, toUserId, message });
      if (socket) {
        socket.emit('sendMessage', { fromStaffId, toUserId, message });
      }
      showToast('Alert sent successfully!', 'success');
      return response.data;
    } catch (error) {
      console.error('Error sending alert:', error);
      showToast('Failed to send alert', 'error');
      throw error;
    }
  };

  const value = {
    userMode,
    setUserMode,
    safeZones,
    requests,
    volunteers,
    socket,
    currentUser,
    setCurrentUser,
    toast,
    createRequest,
    acceptRequest,
    completeRequest,
    registerVolunteer,
    checkIn,
    loadData,
    sendVerificationCode,
    verifyCode,
    getAllUsers,
    sendMessage,
    sendAlert,
    login,
    signup
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};


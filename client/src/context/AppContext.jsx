import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const AppContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
      setRequests(prev => [...prev, request]);
      if (userMode === 'volunteer') {
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

    return () => {
      newSocket.close();
    };
  }, [userMode]);

  const loadData = async () => {
    try {
      const [zonesRes, requestsRes, volunteersRes] = await Promise.all([
        axios.get(`${API_URL}/api/safe-zones`),
        axios.get(`${API_URL}/api/requests`),
        axios.get(`${API_URL}/api/volunteers`)
      ]);
      
      setSafeZones(zonesRes.data);
      setRequests(requestsRes.data);
      setVolunteers(volunteersRes.data);
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
      const response = await axios.post(`${API_URL}/api/requests`, requestData);
      setRequests(prev => [...prev, response.data]);
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
    loadData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};


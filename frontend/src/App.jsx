import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Notifications from './pages/Notifications';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

export const SocketContext = React.createContext();

export default function App() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('/api/notifications');
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();

    socket.on('notification_created', (n) => {
      setNotifications((prev) => [n, ...prev]);
    });

    socket.on('notification_read', ({ id }) => {
      setNotifications((prev) => prev.map(p => p.id === id ? { ...p, read: true } : p));
    });

    socket.on('notifications_read_all', () => {
      setNotifications((prev) => prev.map(p => ({ ...p, read: true })));
    });

    return () => {
      socket.off('notification_created');
      socket.off('notification_read');
      socket.off('notifications_read_all');
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <div className="min-h-screen flex bg-white text-gray-800">
        <Sidebar />
        <div className="flex-1">
          <Header notifications={notifications} />
          <main className="p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/notifications" element={<Notifications />} />
            </Routes>
          </main>
        </div>
      </div>
    </SocketContext.Provider>
  );
}

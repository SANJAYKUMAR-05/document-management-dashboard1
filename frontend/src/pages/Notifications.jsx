import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { SocketContext } from '../App';
import Loader from '../components/Loader';

export default function Notifications(){
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useContext(SocketContext);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/notifications');
      setNotifications(res.data);
    } catch (err) {
    }
    setLoading(false);
  };

  useEffect(()=>{ fetchNotifications(); }, []);

  useEffect(()=>{
    socket.on('notification_created', (note) => setNotifications(prev => [note, ...prev]));
    socket.on('notification_read', ({ id }) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)));
    socket.on('notifications_read_all', () => setNotifications(prev => prev.map(n => ({ ...n, read: true }))));
    return () => {
      socket.off('notification_created');
      socket.off('notification_read');
      socket.off('notifications_read_all');
    };
  }, [socket]);

  const markRead = async (id) => {
    await axios.patch(`/api/notifications/${id}/read`);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = async () => {
    await axios.patch('/api/notifications/read-all');
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <button onClick={markAllRead} className="px-4 py-2 bg-primary-500 text-white rounded">Mark all as read</button>
      </div>
      {loading ? <Loader /> : (
        <div className="space-y-3">
          {notifications.map(note => (
            <div key={note.id} className={`p-4 rounded-md shadow ${note.read ? 'bg-white' : 'bg-primary-50'}`}>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="text-sm font-medium">{note.message}</div>
                  <div className="text-xs text-gray-500 mt-1">{new Date(note.createdAt).toLocaleString()}</div>
                </div>
                {!note.read && <button onClick={()=>markRead(note.id)} className="text-primary-600 text-sm">Mark read</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

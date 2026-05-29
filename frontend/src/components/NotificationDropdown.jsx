import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function NotificationDropdown() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    axios.get('/api/notifications')
      .then((res) => {
        if (mounted) {
          setNotes(res.data);
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const markRead = async (id) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`);
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read: true } : n
        )
      );
    } catch (err) {}
  };

  const markAll = async () => {
    try {
      await axios.patch('/api/notifications/read-all');
      setNotes((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    } catch (err) {}
  };

  if (loading) {
    return (
      <div className="p-4 bg-white rounded shadow w-80">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-96 bg-white shadow rounded">
      <div className="p-3 border-b flex justify-between items-center">
        <div className="font-semibold">Notifications</div>

        <button
          onClick={markAll}
          className="text-sm text-green-600 hover:text-green-700 font-medium"
        >
          Mark all
        </button>
      </div>

      <div className="max-h-64 overflow-auto">
        {notes.length === 0 && (
          <div className="p-4 text-gray-500">
            No notifications
          </div>
        )}

        {notes.map((n) => (
          <div
            key={n.id}
            className={`p-3 border-b ${
              n.read ? 'bg-white' : 'bg-green-50'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="text-sm">{n.message}</div>

              {!n.read && (
                <button
                  onClick={() => markRead(n.id)}
                  className="text-xs text-green-600 hover:text-green-700 font-medium"
                >
                  Mark
                </button>
              )}
            </div>

            <div className="text-xs text-gray-400">
              {new Date(n.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
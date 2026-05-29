import React from 'react';
import NotificationBell from './NotificationBell';

export default function Header({ notifications = [] }) {
  const unread = notifications.filter(n => !n.read).length;

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-primary-500 flex items-center justify-center text-white font-bold">D</div>
        <div>
          <h1 className="text-lg font-semibold">Document Management Dashboard</h1>
          <p className="text-sm text-gray-500">Manage documents, uploads, and notifications</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <NotificationBell unread={unread} />
        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold">
          SK
        </div>
      </div>
    </header>
  );
}

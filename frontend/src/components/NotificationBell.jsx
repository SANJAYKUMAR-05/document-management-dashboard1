import React, { useState } from 'react';
import NotificationDropdown from './NotificationDropdown';

export default function NotificationBell({ unread = 0 }){
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={()=>setOpen(o=>!o)} className="relative focus:outline-none">
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z"/></svg>
        {unread > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{unread}</span>}
      </button>
      {open && <div className="absolute right-0 mt-2 z-20"><NotificationDropdown /></div>}
    </div>
  );
}

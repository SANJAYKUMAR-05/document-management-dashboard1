import React from 'react';
import { NavLink } from 'react-router-dom';

const LinkItem = ({ to, children }) => (
  <NavLink to={to} className={({isActive}) => `block px-4 py-3 rounded-md hover:bg-primary-50 ${isActive ? 'bg-primary-100 text-primary-700' : 'text-gray-700'}`}>
    {children}
  </NavLink>
);

export default function Sidebar(){
  return (
    <aside className="w-64 border-r bg-white">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary-600">DMS</h2>
      </div>
      <nav className="px-4 py-2">
        <LinkItem to="/">Dashboard</LinkItem>
        <LinkItem to="/upload">Uploads</LinkItem>
        <LinkItem to="/notifications">Notifications</LinkItem>
      </nav>
    </aside>
  );
}

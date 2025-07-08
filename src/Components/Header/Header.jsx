// src/components/layout/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  ChevronRight,
  LogOut,
  User,
  LayoutDashboard,
  Bell,
  Settings,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const Header = () => {
  const email = localStorage.getItem('userEmail') || 'guest@example.com';
  const initials = email.charAt(0).toUpperCase();
  const { role, logout } = useUser();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const goToProfile = () => {
    setDropdownOpen(false);
    navigate('/my-profile');
  };

  const goToDashboard = () => {
    setDropdownOpen(false);
    navigate(role === 'candidate' ? '/dashboard' : `/${role}/dashboard`);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (dropdownOpen && window.innerWidth < 768) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [dropdownOpen]);

  return (
    <header className="w-full border-b border-gray-300 shadow-lg py-3 px-4 flex items-center justify-between md:px-6">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <img src="/Logo.png" alt="Logo" className="h-8 md:h-10 w-auto" />
      </div>

      {/* Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-2 focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 text-white font-bold flex items-center justify-center text-sm shadow-md">
            {initials}
          </div>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </button>

        {dropdownOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
              onClick={() => setDropdownOpen(false)}
            />

            {/* Dropdown */}
            <div
              className="fixed md:absolute top-0 md:top-auto right-0 w-screen md:w-64 h-screen md:h-auto mt-0 md:mt-3 bg-white border border-gray-200 rounded-none md:rounded-xl shadow-lg z-50 overflow-y-auto md:overflow-visible animate-fade-in-up"
            >
              <div className="p-4 space-y-2 md:space-y-2">
                <div className="flex justify-end md:hidden mb-2">
                  <button
                    onClick={() => setDropdownOpen(false)}
                    className="text-gray-600 hover:text-black px-2 py-1 text-sm"
                  >
                    ✕
                  </button>
                </div>

                <MenuItem label="Dashboard" Icon={LayoutDashboard} variant="purple" onClick={goToDashboard} />
                <MenuItem label="My Profile" Icon={User} variant="pink" onClick={goToProfile} />
                <MenuItem
                  label="Notifications"
                  Icon={Bell}
                  variant="yellow"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/notifications');
                  }}
                />
                <MenuItem
                  label="Settings"
                  Icon={Settings}
                  variant="indigo"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/settings');
                  }}
                />
                <MenuItem
                  label="Logout"
                  Icon={LogOut}
                  variant="red"
                  textColor="text-red-600"
                  onClick={handleLogout}
                  extra="font-semibold mt-2"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

const MenuItem = ({ label, Icon, onClick, variant, textColor = 'text-gray-700', extra = '' }) => {
  const styles = {
    purple: {
      hover: 'hover:bg-purple-100',
      bg: 'bg-purple-50',
      icon: 'text-purple-700',
    },
    pink: {
      hover: 'hover:bg-pink-100',
      bg: 'bg-pink-50',
      icon: 'text-pink-600',
    },
    yellow: {
      hover: 'hover:bg-yellow-100',
      bg: 'bg-yellow-50',
      icon: 'text-amber-500',
    },
    indigo: {
      hover: 'hover:bg-indigo-100',
      bg: 'bg-indigo-50',
      icon: 'text-indigo-600',
    },
    red: {
      hover: 'hover:bg-red-100',
      bg: 'bg-red-100',
      icon: 'text-red-600',
    },
  };

  const { hover, bg, icon } = styles[variant] || {};

  return (
    <button
      onClick={onClick}
      className={`group flex items-center justify-between text-sm ${textColor} ${hover} p-2 rounded-lg w-full transition ${extra}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-md ${bg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${icon}`} />
        </div>
        {label}
      </div>
      <ChevronRight
        className={`w-4 h-4 ${icon} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition duration-200`}
      />
    </button>
  );
};

export default Header;

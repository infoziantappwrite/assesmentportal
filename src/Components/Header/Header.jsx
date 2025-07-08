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
  /* -------------------------------------------------------------------- */
  /*  User / routing helpers                                              */
  /* -------------------------------------------------------------------- */
  const email      = localStorage.getItem('userEmail') || 'guest@example.com';
  const initials   = email.charAt(0).toUpperCase();
  const { role, logout } = useUser();
  const navigate   = useNavigate();

  /* -------------------------------------------------------------------- */
  /*  Local state                                                         */
  /* -------------------------------------------------------------------- */
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen((p) => !p);

  /* -------------------------------------------------------------------- */
  /*  Route helpers                                                       */
  /* -------------------------------------------------------------------- */
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
    if (role === 'student') navigate('/dashboard');
    else navigate(`/${role}/dashboard`);
  };

  /* -------------------------------------------------------------------- */
  /*  Close on outside click + lock scroll on mobile                      */
  /* -------------------------------------------------------------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll on mobile when dropdown is open
  useEffect(() => {
    if (dropdownOpen && window.innerWidth < 768) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [dropdownOpen]);

  /* ==================================================================== */
  /*  RENDER                                                              */
  /* ==================================================================== */
  return (
    <header className="w-full border-b border-gray-300 shadow-lg py-3 px-4 flex items-center justify-between md:px-6">

      {/* ---------- Logo ------------------------------------------------- */}
      <div className="flex items-center gap-4">
        <img src="/Logo.png" alt="Logo" className="h-8 md:h-10 w-auto" />
      </div>

      {/* ---------- Profile / Dropdown ----------------------------------- */}
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

        {/* ---------- DROPDOWN (mobile = full‑screen fixed) --------------- */}
        {dropdownOpen && (
          <>
            {/* Backdrop for mobile */}
            <div
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
              onClick={() => setDropdownOpen(false)}
            />

            <div
              className="
                fixed md:absolute
                top-0 md:top-auto
                right-0
                w-screen md:w-64
                h-screen md:h-auto
                mt-0 md:mt-3
                bg-white
                border border-gray-200
                rounded-none md:rounded-xl
                shadow-lg
                z-50
                overflow-y-auto md:overflow-visible
                animate-fade-in-up
              "
            >
              <div className="p-4 space-y-2 md:space-y-2">
                {/* Close button (mobile only) */}
                <div className="flex justify-end md:hidden mb-2">
                  <button
                    onClick={() => setDropdownOpen(false)}
                    className="text-gray-600 hover:text-black px-2 py-1 text-sm"
                  >
                    ✕
                  </button>
                </div>

                {/* ---- Dashboard ---- */}
                <MenuItem
                  label="Dashboard"
                  Icon={LayoutDashboard}
                  bg="purple"
                  onClick={goToDashboard}
                />

                {/* ---- My Profile ---- */}
                <MenuItem
                  label="My Profile"
                  Icon={User}
                  bg="pink"
                  onClick={goToProfile}
                />

                {/* ---- Notifications ---- */}
                <MenuItem
                  label="Notifications"
                  Icon={Bell}
                  bg="yellow"
                  iconColor="amber-500"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/notifications');
                  }}
                />

                {/* ---- Settings ---- */}
                <MenuItem
                  label="Settings"
                  Icon={Settings}
                  bg="indigo"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/settings');
                  }}
                />

                {/* ---- Logout ---- */}
                <MenuItem
                  label="Logout"
                  Icon={LogOut}
                  bg="red"
                  textColor="red-600"
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

/* ---------------------------------------------------------------------- */
/*  Reusable menu item component                                          */
/* ---------------------------------------------------------------------- */
const MenuItem = ({
  label,
  Icon,
  onClick,
  bg,
  iconColor,
  textColor = 'gray-700',
  extra = '',
}) => {
  const baseColor = iconColor || `${bg}-600`;
  return (
    <button
      onClick={onClick}
      className={`group flex items-center justify-between text-sm text-${textColor} hover:bg-${bg}-100 p-2 rounded-lg w-full transition ${extra}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-md bg-${bg}-50 flex items-center justify-center`}
        >
          <Icon className={`w-4 h-4 text-${baseColor}`} />
        </div>
        {label}
      </div>
      <ChevronRight
        className={`w-4 h-4 text-${baseColor} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition duration-200`}
      />
    </button>
  );
};

export default Header;

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';


const Header = () => {
  const email = localStorage.getItem('userEmail') || 'guest@example.com';
  const name = localStorage.getItem('userName') || 'Guest User';
  const initials = email.charAt(0).toUpperCase();
  const { role } = useUser();


  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.clear();
    setDropdownOpen(false);
    navigate('/');
    window.location.reload();
  };

  const goToProfile = () => {
    setDropdownOpen(false);
    navigate('/my-profile');
  };

  const goToDashboard = () => {
  setDropdownOpen(false);
  if (role === 'student') {
    navigate('/dashboard');
  } else {
    navigate(`/${role}/dashboard`);
  }
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

  return (
    <header className="w-full border-gray-200 shadow-lg py-3 px-6 flex items-center justify-between">
      {/* Left: Logo */}
      <div className="flex items-center gap-4">
        <img src="/Logo.png" alt="Logo" className="h-10 w-auto" />
      </div>

      {/* Right: Profile Dropdown */}
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

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-3 w-64 bg-blue-50 border border-gray-200 rounded-xl shadow-lg z-50 animate-fade-in-up">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 text-white font-bold flex items-center justify-center text-lg shadow">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{name}</p>
                  <p className="text-xs text-gray-500">{email}</p>
                </div>
              </div>

              <hr className="my-3 border-gray-200" />

              {/* Dashboard */}
              <button
                onClick={goToDashboard}
                className="flex items-center gap-2 text-sm text-gray-700 hover:bg-blue-100 p-2 rounded font-semibold transition w-full"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>

              {/* My Profile */}
              <button
                onClick={goToProfile}
                className="flex items-center gap-2 text-sm text-gray-700 hover:bg-blue-100 p-2 rounded font-semibold transition w-full"
              >
                <User className="w-4 h-4" />
                My Profile
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="mt-1 flex items-center gap-2 text-sm text-red-600 hover:bg-red-200 p-2 rounded font-semibold transition w-full"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

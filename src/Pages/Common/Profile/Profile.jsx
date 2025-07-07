import React, { useState } from 'react';
import { Lock, User as UserIcon, Mail, Shield, BadgeCheck, CheckCircle, Clock, Building2, Users } from 'lucide-react';
import ChangePassword from './ChangePassword';
import Header from '../../../Components/Header/Header';
import Loader from '../../../Components/Loader';
import { useUser } from '../../../context/UserContext';

const Profile = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const { loading, user } = useUser(); // Get loading and user from context

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Show loader until data is ready
  if (loading || !user) {
    return (
      <>
       
        <Loader />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-slate-100 to-teal-100 py-10 px-4">
        <div className="max-w-5xl mx-auto bg-white p-10 rounded-2xl shadow-md border border-gray-200 ring-1 ring-blue-300">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold">
              {getInitials(user?.name)}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-blue-800">Profile</h2>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-800">
            {/* Left column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <UserIcon size={16} /> <strong>Name:</strong> {user.name}
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} /> <strong>Email:</strong> {user.email}
              </div>
              <div className="flex items-center gap-2">
                <Shield size={16} /> <strong>Role:</strong> {user.role}
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck size={16} /> <strong>Status:</strong>{' '}
                {user.is_active ? 'Active' : 'Inactive'}
              </div>

              {/* Assigned Colleges */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building2 size={16} /> <strong>Assigned Colleges:</strong>
                </div>
                <ul className="ml-6 list-disc">
                  {user.assigned_colleges.length > 0
                    ? user.assigned_colleges.map((college, i) => (
                        <li key={i}>{college}</li>
                      ))
                    : <li>None</li>}
                </ul>
              </div>

              {/* Assigned Groups */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Users size={16} /> <strong>Assigned Groups:</strong>
                </div>
                <ul className="ml-6 list-disc">
                  {user.assigned_groups.length > 0
                    ? user.assigned_groups.map((group, i) => (
                        <li key={i}>{group}</li>
                      ))
                    : <li>None</li>}
                </ul>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Permissions */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle size={16} /> <strong>Permissions:</strong>
                </div>
                <ul className="ml-6 list-disc">
                  {Object.entries(user.permissions || {}).map(([key, value]) => (
                    <li key={key}>
                      {key.replace(/_/g, ' ')}:{' '}
                      <span className={value ? 'text-green-600' : 'text-red-600'}>
                        {value ? 'Yes' : 'No'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-2">
                <Clock size={16} /> <strong>Created At:</strong>{' '}
                {new Date(user.createdAt).toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} /> <strong>Updated At:</strong>{' '}
                {new Date(user.updatedAt).toLocaleString()}
              </div>

              {/* Change Password Button */}
              <button
                className="mt-6 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2 px-4 rounded-lg hover:opacity-90 flex items-center gap-2"
                onClick={() => setShowChangePassword(true)}
              >
                <Lock size={16} />
                Change Password
              </button>

              {showChangePassword && (
                <div className="mt-6">
                  <ChangePassword onClose={() => setShowChangePassword(false)} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

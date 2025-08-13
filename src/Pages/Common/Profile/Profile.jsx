import React, { useState, useEffect } from 'react';
import {
  Lock,
  User as UserIcon,
  Mail,
  Shield,
  BadgeCheck,
  CheckCircle,
  Clock,
  Building2,
  Users,
} from 'lucide-react';
import ChangePassword from './ChangePassword';
import Header from '../../../Components/Header/Header';
import Loader from '../../../Components/Loader';
import { useUser } from '../../../context/UserContext';
import { getUser } from '../../../Controllers/authController';

const Profile = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: contextUser } = useUser(); // Fallback to context user

  // Fetch fresh user data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setProfileLoading(true);
        setError(null);
        const userData = await getUser();
        
        if (userData) {
          setProfileUser(userData);
        } else {
          // If API call fails, fallback to context user
          setProfileUser(contextUser);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile data');
        // Fallback to context user if available
        setProfileUser(contextUser);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [contextUser]);

  // Use profileUser if available, otherwise fallback to contextUser
  const user = profileUser || contextUser;

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Show loader while fetching profile data
  if (profileLoading) {
    return <Loader />;
  }

  // Show error message if profile data couldn't be loaded
  if (error && !user) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-slate-100 to-teal-100 py-8 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
            <div className="text-red-600 mb-4">
              <UserIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Profile</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  // Show message if no user data is available
  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-slate-100 to-teal-100 py-8 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
            <UserIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Profile Data</h2>
            <p className="text-gray-600">Unable to load your profile information.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-slate-100 to-teal-100 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 ring-1 ring-blue-300 p-5 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-semibold shadow-md">
              {getInitials(user?.name)}
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-blue-900 leading-tight">
                {user.name}
              </h1>
              <p className="text-xs text-gray-600 capitalize mt-0.5">{user.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 text-gray-900">
            {/* Left column */}
            <section className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={<UserIcon size={18} />} label="Name" value={user.name} />
              <InfoRow icon={<Mail size={18} />} label="Email" value={user.email} />
              <InfoRow icon={<Shield size={18} />} label="Role" value={user.role} />
              <InfoRow
                icon={<BadgeCheck size={18} />}
                label="Status"
                value={
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                      user.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                }
              />
            </div>

              {/* Assigned Colleges */}
              <CardSection title="Assigned Colleges" icon={<Building2 size={18} />}>
                {user.assigned_colleges && user.assigned_colleges.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {user.assigned_colleges.map((college, i) => (
                      <li key={i} className="text-gray-700">
                        {typeof college === 'string' ? college : college.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 italic text-sm">None assigned</p>
                )}
              </CardSection>

              {/* Assigned Groups */}
              <CardSection title="Assigned Groups" icon={<Users size={18} />}>
                {user.assigned_groups && user.assigned_groups.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {user.assigned_groups.map((group) => (
                      <li key={group._id} className="text-gray-700">
                        {group.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 italic text-sm">None assigned</p>
                )}
              </CardSection>
            </section>

            {/* Right column */}
            <section className="space-y-6">
              {/* Permissions */}
              <CardSection
                title="Permissions"
                icon={<CheckCircle size={18} />}
                className="w-full overflow-x-auto"
              >
                <ul className="list-disc list-inside text-sm text-gray-800 leading-relaxed min-w-[300px]">
                  {Object.entries(user.permissions || {}).map(([key, value]) => (
                    <li key={key} className="whitespace-nowrap">
                      {key.replace(/_/g, ' ').replace(/^./, (str) => str.toUpperCase())}:{' '}
                      <span className={value ? 'text-green-600' : 'text-red-600'}>
                        {value ? 'Yes' : 'No'}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardSection>

              {/* Meta */}
              <MetaRow icon={<Clock size={18} />} label="Created At" date={user.createdAt} />
              <MetaRow icon={<Clock size={18} />} label="Updated At" date={user.updatedAt} />

              {/* Change Password Button */}
              <button
                onClick={() => setShowChangePassword(true)}
                className="mt-4 w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2 rounded-lg shadow-md hover:opacity-90 transition duration-200 font-semibold text-sm sm:text-base"
              >
                <Lock size={18} />
                Change Password
              </button>

              {showChangePassword && (
                <div className="mt-6">
                  <ChangePassword onClose={() => setShowChangePassword(false)} />
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-2 text-sm sm:text-base">
    <div className="text-blue-600 mt-0.5">{icon}</div>
    <div className="flex flex-col sm:flex-row sm:items-center">
      <span className="font-semibold">{label}:</span>
      <span className="text-gray-700 sm:ml-1">{value}</span>
    </div>
  </div>
);


const CardSection = ({ title, icon, children, className = '' }) => (
  <div
    className={`bg-gradient-to-tr from-indigo-50 to-white border border-gray-200 rounded-lg p-4 shadow-sm ${className}`}
  >
    <div className="flex items-center mb-2 gap-1.5 text-indigo-700 font-semibold text-base">
      {icon}
      {title}
    </div>
    <div>{children}</div>
  </div>
);

const MetaRow = ({ icon, label, date }) => (
  <div className="flex items-center gap-2 text-gray-700 text-sm sm:text-base font-medium">
    <div className="text-blue-500">{icon}</div>
    <div>
      <span className="font-semibold">{label}:</span> {new Date(date).toLocaleString()}
    </div>
  </div>
);

export default Profile;

import React, { useEffect, useState } from 'react';
import { getUserById, updateUserById, deleteUserById } from '../../../Controllers/userControllers';
import { useParams, useNavigate } from 'react-router-dom';
import { Pencil, Trash2, User2, Check, CheckCircle, XCircle } from 'lucide-react';
import Loader from '../../../Components/Loader';
import ResetUserPassword from './ResetuserPassword';
import UserStatusToggle from './UserStatusToggle';
 import AssignedListCard from './AssignedListCard'; // Adjust path as needed

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const fetchUser = async () => {
    try {
      const res = await getUserById(id);
      setUser(res.data.user);
      console.log(res.data.user);
      setFormData(res.data.user);
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('profile.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          [key]: value,
        },
      }));
    } else if (name.includes('permissions.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [key]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleUpdate = async () => {
    setStatusMessage({ type: '', text: '' });

    const yearValue = parseInt(formData.profile?.year, 10);
    if (!isNaN(yearValue) && yearValue > 4) {
      setStatusMessage({ type: 'error', text: 'Year cannot be greater than 4.' });
      setTimeout(() => setStatusMessage({ type: '', text: '' }), 2300);
      return;
    }

    try {
      await updateUserById(id, formData);
      setStatusMessage({ type: 'success', text: 'User updated successfully!' });
      setTimeout(() => setStatusMessage({ type: '', text: '' }), 2300);
      setEditMode(false);
      fetchUser();
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to update user.' });
      setTimeout(() => setStatusMessage({ type: '', text: '' }), 2300);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUserById(id);
      navigate('/admin/users');
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to delete user.' });
      setTimeout(() => setStatusMessage({ type: '', text: '' }), 2300);
    }
  };

  const renderValue = (val) =>
    val || val === false ? val.toString() : <span className="text-gray-400">-</span>;

  if (!user) return <Loader />;

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* ✅ Status Message */}
        {statusMessage.text && (
          <div
            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 border ${statusMessage.type === 'success'
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
              }`}
          >
            {statusMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {statusMessage.text}
          </div>
        )}

        {/* ✅ Header + Actions */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <User2 className="w-6 h-6 text-blue-600" />
            User Details
          </h2>
          <div className="flex items-center gap-3 flex-wrap">
            <UserStatusToggle
              userId={user._id}
              isActiveInitial={user.is_active}
              onStatusChange={(newStatus) =>
                setFormData((prev) => ({ ...prev, is_active: newStatus }))
              }
            />




            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-1.5 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Deactivate
            </button>

            <ResetUserPassword userId={id} />
          </div>
        </div>

        {/* ✅ Basic Info Card */}
        <div className="rounded-xl shadow bg-white p-4 space-y-6">
          {/* Header row with title and edit/save button */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-blue-600">Basic Info</h3>
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-lg  text-sm">
              {/* Active / Inactive Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="accent-blue-600 w-4 h-4"
                />
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${formData.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                >
                  {formData.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Edit / Save Button */}
              <button
                onClick={() => (editMode ? handleUpdate() : setEditMode(true))}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg shadow transition ${editMode ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
              >
                {editMode ? (
                  <>
                    <Check className="w-4 h-4" />
                    Save
                  </>
                ) : (
                  <>
                    <Pencil className="w-4 h-4" />
                    Edit
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Basic Info Fields */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <label className="text-gray-600 font-medium block mb-1">Name</label>
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              ) : (
                renderValue(user.name)
              )}
            </div>
            <div>
              <label className="text-gray-600 font-medium block mb-1">Email</label>
              {renderValue(user.email)}
            </div>
            <div>
              <label className="text-gray-600 font-medium block mb-1">Role</label>
              {editMode ? (
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                >
                  <option value="admin">Admin</option>
                  <option value="trainer">Trainer</option>
                  <option value="college_rep">College Rep</option>
                  <option value="candidate">Candidate</option>
                </select>
              ) : (
                renderValue(user.role)
              )}
            </div>
          </div>

          {/* Profile Info Header */}
          <h3 className="text-lg font-semibold text-purple-600">Profile Info</h3>

          {/* Profile Fields */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {['phone', 'address', 'department', 'year', 'employee_id', 'designation'].map((field) => (
              <div key={field}>
                <label className="text-gray-600 font-medium block mb-1 capitalize">
                  {field.replace('_', ' ')}
                </label>
                {editMode ? (
                  <input
                    type={field === 'year' ? 'number' : 'text'}
                    name={`profile.${field}`}
                    value={formData?.profile?.[field] || ''}
                    onChange={handleChange}
                    {...(field === 'year' && { min: 1, max: 4 })}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                ) : (
                  renderValue(user.profile?.[field])
                )}
              </div>
            ))}
          </div>
        </div>
        {/* ✅ Permissions */}
        <div className="rounded-xl shadow bg-white p-4">
          <h3 className="text-lg font-semibold mb-4 text-orange-600">Permissions</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(user.permissions || {}).map(([key]) => {
              const label = key.replace(/_/g, ' ');
              return (
                <label
                  key={key}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm shadow-sm ${formData.permissions?.[key]
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-gray-100 text-gray-600 border-gray-300'
                    } ${editMode ? 'cursor-pointer' : 'opacity-60'}`}
                >
                  <input
                    type="checkbox"
                    name={`permissions.${key}`}
                    checked={formData?.permissions?.[key] || false}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="accent-blue-600 w-4 h-4"
                  />
                  {label}
                </label>
              );
            })}
          </div>
        </div>




       

<div className="flex flex-wrap justify-between gap-4">
  <AssignedListCard
    title="Assigned Colleges"
    items={user.assigned_colleges}
    type="college"
    color="green"
  />
  <AssignedListCard
    title="Assigned Groups"
    items={user.assigned_groups}
    type="group"
    color="pink"
  />
</div>



      </div>
    </div>

  );
};

export default UserDetails;

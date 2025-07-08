import React, { useState } from 'react';

import { createUser } from '../../../Controllers/userControllers';
import BulkUploadUser from './BulkUploadUser';
import { UserPlus } from 'lucide-react';


const CreateUser = () => {
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
    is_active: true,
    profile: {
      phone: '',
      designation: '',
    },
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('profile.')) {
      const profileKey = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await createUser(formData);
      setSuccess('User created successfully!');
      setFormData({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
    is_active: true,
    profile: {
      phone: '',
      designation: '',
    },
  });
  
  setTimeout(() => setSuccess(''), 2300);
      
    } catch (err) {
  if (
    err?.response?.data?.message?.includes('E11000') &&
    err?.response?.data?.message?.includes('email')
  ) {
    setError('Email already exists. Please use a different email.');
  } else {
    setError(err?.response?.data?.message || 'Error creating user.');
  }
}

  };

  return (
    <div className='p-4'>
   <div className="p-4 max-w-5xl mx-auto bg-white rounded-xl shadow-lg">
  <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2 mb-6">
    <UserPlus className="w-6 h-6 text-blue-600" />
    Create New User
  </h2>

  {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
  {success && <div className="mb-3 text-sm text-green-600">{success}</div>}

  <form onSubmit={handleSubmit} className="space-y-6 text-gray-700 text-sm">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Name */}
      <div>
        <label className="block font-medium mb-1">Name</label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block font-medium mb-1">Password</label>
        <input
          type="password"
          name="password"
          required
          value={formData.password}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Role */}
      <div>
        <label className="block font-medium mb-1">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="admin">Admin</option>
          <option value="trainer">Trainer</option>
          <option value="college">College</option>
          <option value="candidate">Candidate</option>
        </select>
      </div>

      {/* Phone */}
      <div>
        <label className="block font-medium mb-1">Phone (optional)</label>
        <input
          type="text"
          name="profile.phone"
          value={formData.profile.phone}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Designation */}
      <div>
        <label className="block font-medium mb-1">Designation (optional)</label>
        <input
          type="text"
          name="profile.designation"
          value={formData.profile.designation}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    {/* Active + Submit */}
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 ">
      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          name="is_active"
          checked={formData.is_active}
          onChange={handleChange}
        />
        Active
      </label>

      <button
        type="submit"
        className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all duration-200"
      >
       
        Create User
      </button>
    </div>
  </form>

  {/* Bulk Upload Section */}
  <div className="mt-8">
    <BulkUploadUser />
  </div>
</div>
</div>

  );
};

export default CreateUser;

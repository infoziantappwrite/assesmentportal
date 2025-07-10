import React, { useState } from 'react';
import { createUser } from '../../../Controllers/userControllers';
import { assignCollegeRepresentative } from '../../../Controllers/CollegeController';
import { UserPlus, School, X, Check, Building2 } from 'lucide-react';
import SelectCollegeModal from './SelectCollegeModal';
import BulkUploadUser from './BulkUploadUser';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
    is_active: true,
    assigned_colleges: [],
  });

  const [selectedCollegeName, setSelectedCollegeName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showCollegeModal, setShowCollegeModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Ensure college is selected if role is college
    if (formData.role === 'college_rep' && formData.assigned_colleges.length === 0) {
      setError('Please select a college for the user with "college" role.');
      setTimeout(() => setError(''), 2000);
      return;
    }

    try {
      const res = await createUser(formData);
      const newUser = res?.data?.user;

      // If role is 'college', assign as representative to the selected college
      if (newUser?.role === 'college_rep' && newUser?.assigned_colleges?.length > 0) {
        const collegeId = newUser.assigned_colleges[0];
        const userId = newUser._id;

        try {
          await assignCollegeRepresentative(collegeId, userId);
          setSuccess('Representative assigned to college successfully!');
          setTimeout(() => setError(''), 2000);
          //console.log('Representative assigned to college.');
        } catch (assignError) {
          setError('Failed to assign representative to college.');
          setTimeout(() => setError(''), 2000);
          console.error('Failed to assign representative:', assignError);
        }
      }

      setSuccess('User created successfully!');
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'candidate',
        is_active: true,
        assigned_colleges: [],
      });
      setSelectedCollegeName('');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      if (
        err?.response?.data?.message?.includes('E11000') &&
        err?.response?.data?.message?.includes('email')
      ) {
        setError('Email already exists.');
      } else {
        setError(err?.response?.data?.message || 'Error creating user.');
      }
      setTimeout(() => setError(''), 2000);
    }
  };


  const handleCollegeSelect = ({ id, name }) => {
    setFormData((prev) => ({
      ...prev,
      assigned_colleges: [id],
    }));
    setSelectedCollegeName(name);
    setShowCollegeModal(false);
  };

  return (
    <div className="p-4">
      <div className="p-6 mx-auto bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2 mb-4">
          <UserPlus className="w-6 h-6 text-blue-600" />
          Create User
        </h2>

        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-3 text-sm text-green-600 bg-green-50 border border-green-200 px-4 py-2 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-medium">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-medium">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-medium">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="admin">Admin</option>
                <option value="trainer">Trainer</option>
                <option value="college_rep">College Rep</option>
                <option value="candidate">Candidate</option>
              </select>
            </div>
          </div>

          {/* Status Toggle + College Select + Action Buttons */}
          <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
            {/* Active Toggle */}
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-gray-700">Status:</span>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="sr-only peer"
                />

                <div
                  className={`w-14 h-7 rounded-full flex items-center px-1 transition-colors duration-300 
        ${formData.is_active ? 'bg-green-500' : 'bg-red-500'}
      `}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300
          ${formData.is_active ? 'translate-x-7' : 'translate-x-0'}
        `}
                  />
                </div>

                <span className="ml-3 text-sm font-semibold text-gray-800">
                  {formData.is_active ? 'Active' : 'Inactive'}
                </span>
              </label>
            </div>


            {/* College Info + Select/Change College */}
            {formData.role === 'college_rep' && (
              <div className="flex items-center gap-3">
                {selectedCollegeName && (
                  <div className="flex items-center gap-1 text-sm text-blue-800 font-medium bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
                    <Building2 className="w-4 h-4" />
                    {selectedCollegeName}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setShowCollegeModal(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${selectedCollegeName
                    ? 'bg-yellow-500 hover:bg-yellow-600'
                    : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                  <School className="w-4 h-4" />
                  {selectedCollegeName ? 'Change College' : 'Select College'}
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 ml-auto">
              <button
                type="reset"
                onClick={() => {
                  setFormData({
                    name: '',
                    email: '',
                    password: '',
                    role: 'candidate',
                    is_active: true,
                    assigned_colleges: [],
                  });
                  setSelectedCollegeName('');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Check className="w-4 h-4" />
                Create
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Bulk Upload Section */}
      <div className="p-6 mx-auto bg-white rounded-xl shadow-lg mt-6">
        <BulkUploadUser />
      </div>

      {/* College Modal */}
      {showCollegeModal && (
        <SelectCollegeModal
          onSelect={handleCollegeSelect}
          onClose={() => setShowCollegeModal(false)}
        />
      )}
    </div>
  );
};

export default CreateUser;

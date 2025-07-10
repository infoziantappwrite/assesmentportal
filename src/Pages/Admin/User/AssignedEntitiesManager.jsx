import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getAssignedColleges,
    addAssignedColleges,
    removeAssignedColleges,
    deleteAssignedColleges,
    getAssignedGroups,
    addAssignedGroups,
    removeAssignedGroups,
    deleteAssignedGroups,
} from '../../../Controllers/userControllers';
import { useUser } from "../../../context/UserContext"
import SelectCollegeModal from './SelectCollegeModal';
import SelectGroupModal from './SelectGroupModal';

const AssignedEntitiesManager = ({ userId }) => {
    const [colleges, setColleges] = useState([]);
    const [groups, setGroups] = useState([]);
    const [status, setStatus] = useState('');
    const [showCollegeModal, setShowCollegeModal] = useState(false);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const navigate = useNavigate();
    const { role } = useUser()

    const fetchData = async () => {
        try {
            const [collegeRes, groupRes] = await Promise.all([
                getAssignedColleges(userId),
                getAssignedGroups(userId),
            ]);
            setColleges(collegeRes.data?.assigned_colleges || []);
            setGroups(groupRes.data?.groups || []);
        } catch {
            setStatus('Error fetching assigned data');
        }
    };

    useEffect(() => {
        fetchData();
    }, [userId]);

    useEffect(() => {
        if (status) {
            const timer = setTimeout(() => setStatus(''), 2000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const handleAdd = async (type, selected) => {
        const { id } = selected;
        const isDuplicate =
            type === 'college'
                ? colleges.some((c) => c._id === id)
                : groups.some((g) => g._id === id);

        if (isDuplicate) {
            setStatus(`${type === 'college' ? 'College' : 'Group'} already assigned.`);
            return;
        }

        try {
            if (type === 'college') {
                await addAssignedColleges(userId, [id]);
            } else {
                await addAssignedGroups(userId, [id]);
            }
            setStatus('Added successfully');
            fetchData();
        } catch {
            setStatus('Add failed');
        }
    };

    const handleRemove = async (type, id) => {
        try {
            if (type === 'college') {
                await removeAssignedColleges(userId, [id]);
            } else {
                await removeAssignedGroups(userId, [id]);
            }
            setStatus('Removed successfully');
            fetchData();
        } catch {
            setStatus('Remove failed');
        }
    };

    const handleDeleteAll = async (type) => {
      

        try {
            if (type === 'college') {
                await deleteAssignedColleges(userId);
            } else {
                await deleteAssignedGroups(userId);
            }
            setStatus('Deleted all successfully');
            fetchData();
        } catch {
            setStatus('Delete all failed');
        }
    };

    return (
        <div className="p-4 bg-white shadow rounded-xl space-y-6">
  {/* ✅ Status Alert */}
  {status && (
    <div className="text-sm text-green-700 font-medium border border-green-300 bg-green-50 px-3 py-2 rounded-xl">
      {status}
    </div>
  )}

  {/* ✅ Two Column Responsive Layout */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    {/* ✅ Assigned Colleges */}
    <div className="bg-white border border-gray-200 rounded-xl shadow p-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h3 className="text-lg font-semibold text-green-700">Assigned Colleges</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowCollegeModal(true)}
            className="bg-green-600 text-white px-3 py-1.5 text-sm rounded-lg shadow hover:bg-green-700"
          >
            + Add
          </button>
          <button
            onClick={() => handleDeleteAll('college')}
            className="bg-red-600 text-white px-3 py-1.5 text-sm rounded-lg shadow hover:bg-red-700"
          >
            Delete All
          </button>
        </div>
      </div>

      {colleges.length === 0 ? (
        <p className="text-sm text-gray-500">No colleges assigned.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {colleges.map((college) => (
            <li
              key={college._id}
              className="flex flex-row sm:flex-row justify-between items-start sm:items-center bg-green-50 border border-green-300 px-3 py-2 rounded-lg"
            >
              <span className="text-green-900 font-medium">{college.name}</span>
              <div className="flex gap-3 mt-2 sm:mt-0">
                <button
                  onClick={() => navigate(`/${role}/colleges/${college._id}`)}
                  className="text-blue-600 text-xs underline"
                >
                  View
                </button>
                <button
                  onClick={() => handleRemove('college', college._id)}
                  className="text-red-600 text-xs underline"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* ✅ Assigned Groups */}
    <div className="bg-white border border-gray-200 rounded-xl shadow p-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h3 className="text-lg font-semibold text-pink-700">Assigned Groups</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowGroupModal(true)}
            className="bg-pink-600 text-white px-3 py-1.5 text-sm rounded-lg shadow hover:bg-pink-700"
          >
            + Add
          </button>
          <button
            onClick={() => handleDeleteAll('group')}
            className="bg-red-600 text-white px-3 py-1.5 text-sm rounded-lg shadow hover:bg-red-700"
          >
            Delete All
          </button>
        </div>
      </div>

      {groups.length === 0 ? (
        <p className="text-sm text-gray-500">No groups assigned.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {groups.map((group) => (
            <li
              key={group._id}
              className="flex flex-row sm:flex-row justify-between items-start sm:items-center bg-pink-50 border border-pink-300 px-3 py-2 rounded-lg"
            >
              <span className="text-pink-900 font-medium">{group.name}</span>
              <div className="flex gap-3 mt-2 sm:mt-0">
                <button
                  onClick={() => navigate(`/${role}/groups/${group._id}`)}
                  className="text-blue-600 text-xs underline"
                >
                  View
                </button>
                <button
                  onClick={() => handleRemove('group', group._id)}
                  className="text-red-600 text-xs underline"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>

  {/* ✅ Modals */}
  {showCollegeModal && (
    <SelectCollegeModal
      onSelect={(selected) => handleAdd('college', selected)}
      onClose={() => setShowCollegeModal(false)}
    />
  )}
  {showGroupModal && (
    <SelectGroupModal
      onSelect={(selected) => handleAdd('group', selected)}
      onClose={() => setShowGroupModal(false)}
    />
  )}
</div>

    );
};

export default AssignedEntitiesManager;

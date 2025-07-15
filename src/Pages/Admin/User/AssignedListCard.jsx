import React from 'react';
import { useNavigate } from 'react-router-dom';

const AssignedListCard = ({ title, items, type = 'college', color = 'blue' }) => {
  const navigate = useNavigate();

  const handleView = (id) => {
    if (type === 'college') {
      navigate(`/admin/colleges/${id}`);
    } else if (type === 'group') {
      navigate(`/admin/groups/${id}`);
    }
  };

  return (
    <div className="rounded-xl shadow bg-white p-4 w-full sm:w-[48%]">
      <h3 className={`text-lg font-semibold mb-4 text-${color}-600`}>
        {title}
      </h3>

      {items?.length > 0 ? (
        <ul className="space-y-2 text-sm text-gray-800">
          {items.map((id) => (
            <li key={id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded px-3 py-2">
              <span className="truncate">{id}</span>
              <button
                onClick={() => handleView(id)}
                className="text-blue-600 hover:underline text-xs font-medium"
              >
                View
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-sm">No {type}s assigned</p>
      )}
    </div>
  );
};

export default AssignedListCard;

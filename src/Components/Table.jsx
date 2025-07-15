// components/common/Table.jsx
import React from "react";

const Table = ({ columns = [], data = [], noDataText = "No data found." }) => {    
    
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="p-4 text-left text-gray-600 font-semibold">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-sky-50/40">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="p-4 text-gray-700">
                    {col.render ? col.render(row, rowIndex) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="p-6 text-center text-gray-500">
                {noDataText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

// src/Pages/Admin/Assessment/ViewSections.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSectionsByAssessmentId } from "../../../Controllers/SectionController";
import { ArrowLeft, FileText, Info, Edit } from "lucide-react";
import { useUser } from '../../../context/UserContext';

const ViewSections = () => {
  const { id } = useParams(); // assessment ID
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { role } = useUser();

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await getSectionsByAssessmentId(id);
        setSections(res.data.sections || []);
      } catch (error) {
        console.error("Error fetching sections:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, [id]);

  if (loading) return <div className="p-6">Loading sections...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:underline text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Assessment
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-indigo-700">All Sections</h2>

      {sections.length === 0 ? (
        <p className="text-gray-500 italic">No sections available.</p>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-500" />
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600">{section.description || "No description"}</p>
                  <p className="text-xs mt-1 text-gray-500">Type: {section.type} | Questions: {section.configuration?.question_count}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/${role}/sections/${section._id}`)}
                    className="flex items-center gap-1 text-sm bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md"
                  >
                    <Info className="w-4 h-4" /> View
                  </button>
                  <button
                    onClick={() => navigate(`/${role}/sections/edit/${section._id}`)}
                    className="flex items-center gap-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewSections;

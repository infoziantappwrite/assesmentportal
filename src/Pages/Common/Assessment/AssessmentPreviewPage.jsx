import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { previewAssessment } from "../../../Controllers/AssesmentController";
import Loader from "../../../Components/Loader";

const AssessmentPreviewPage = () => {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await previewAssessment(id);
        setAssessment(res?.data?.assessment);
      } catch (error) {
        console.error("Failed to load preview:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPreview();
  }, [id]);

  if (loading) return <Loader />;
  if (!assessment) return <div className="p-6 text-gray-500">Assessment not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-indigo-700 mb-2">{assessment.title}</h1>
      <p className="text-gray-600 italic mb-4">{assessment.description}</p>

      <div className="bg-white rounded-xl shadow-md p-4 space-y-3">
        <div><strong>Duration:</strong> {assessment.configuration.total_duration_minutes} mins</div>
        <div><strong>Attempts:</strong> {assessment.configuration.max_attempts}</div>
        <div><strong>Passing Marks:</strong> {assessment.scoring.passing_marks}</div>
        <div><strong>Difficulty:</strong> {assessment.difficulty_level}</div>
        <div><strong>Template:</strong> {assessment.is_template ? "Yes" : "No"}</div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Sections</h2>
        {assessment.sections.length === 0 ? (
          <p className="text-sm text-gray-500">No sections available in this assessment.</p>
        ) : (
          <ul className="space-y-2">
            {assessment.sections.map((section, index) => (
              <li key={index} className="bg-gray-100 p-3 rounded-md">
                <strong>{section.name}</strong>
                {/* Optionally display questions */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AssessmentPreviewPage;

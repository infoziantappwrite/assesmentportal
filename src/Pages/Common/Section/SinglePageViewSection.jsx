import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSectionById } from '../../../Controllers/SectionController';
import { bulkImportQuestions } from '../../../Controllers/QuestionController'; // or correct path
import { UploadCloud } from "lucide-react";
import {
  ArrowLeft, FileText, Clock, List, Settings2,
  ShieldCheck, LayoutList, PlusCircle, Pencil
} from 'lucide-react';

const SinglePageViewSection = () => {
  const { id } = useParams(); // section ID from URL
  const navigate = useNavigate();
  const [section, setSection] = useState(null);
  console.log(section);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadSummary, setUploadSummary] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    const fetchSection = async () => {
      try {
        const res = await getSectionById(id);
        setSection(res?.data?.section || null);
      } catch (error) {
        console.error("Error fetching section:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSection();
  }, [id]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setUploadSummary(null);
    setUploadError(null);

    try {
      await bulkImportQuestions(formData).then((res) => {
        setUploadSummary(res?.data || {});
      });
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadError(err?.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-6">Loading section details...</div>;
  if (!section) return <div className="p-6 text-red-600">Section not found.</div>;

  const {
    title,
    description,
    type,
    sequence_order,
    configuration,
    scoring,
    is_active,
    questions,
    createdAt,
    updatedAt
  } = section;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:underline text-sm mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 space-y-6">
        {/* Title & Actions */}
        <div className="flex justify-between flex-wrap gap-3 items-start">
          <h1 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            {title}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/admin/sections/${id}/questions`)}
              className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
            >
              View All Questions
            </button>

            <button
              onClick={() => navigate(`/admin/sections/edit/${id}`)}
              className="px-4 py-2 text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow"
            >
              <Pencil className="w-4 h-4 inline-block mr-1" />
              Edit Section
            </button>
            <button
              onClick={() =>
                navigate(
                  section.type === "code"
                    ? `/admin/sections/${id}/add-question-code`
                    : `/admin/sections/${id}/add-question`
                )
              }
              className="px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
            >
              <PlusCircle className="w-4 h-4 inline-block mr-1" />
              Add Questions
            </button>

            <label className="relative inline-flex items-center px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow cursor-pointer">
              <UploadCloud className="w-4 h-4 mr-1" />
              {uploading ? "Uploading..." : "Bulk Upload"}
              <input
                type="file"
                accept=".csv"  // not .xlsx
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileUpload}
                disabled={uploading}
              />

            </label>

          </div>
        </div>

        <p className="text-gray-700 italic">{description || "No description provided."}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">Type: {type}</span>
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">Order: {sequence_order}</span>
          <span className={`px-3 py-1 rounded-full ${is_active ? "bg-green-100 text-green-700" : "bg-gray-300 text-gray-700"}`}>
            {is_active ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Configuration */}
        <Section title="Configuration">
          <Grid>
            <Card icon={<Clock />} label="Duration">
              {configuration.duration_minutes} mins
            </Card>
            <Card icon={<LayoutList />} label="Question Count">
              {configuration.question_count}
            </Card>
            <Card icon={<Settings2 />} label="Shuffle Questions">
              {configuration.shuffle_questions ? "Yes" : "No"}
            </Card>
            <Card icon={<Settings2 />} label="Allow Skip">
              {configuration.allow_skip ? "Yes" : "No"}
            </Card>
            <Card icon={<Settings2 />} label="Show Palette">
              {configuration.show_question_palette ? "Yes" : "No"}
            </Card>
          </Grid>
        </Section>

        {/* Scoring */}
        <Section title="Scoring">
          <Grid>
            <Card icon={<List />} label="Total Marks">
              {scoring.total_marks}
            </Card>
            <Card icon={<List />} label="Marks/Question">
              {scoring.marks_per_question}
            </Card>
            <Card icon={<ShieldCheck />} label="Negative Marking">
              {scoring.negative_marking ? "Yes" : "No"}
            </Card>
          </Grid>
        </Section>

        {/* No Questions Message */}
        {questions?.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-md text-sm">
            No questions linked to this section yet.{" "}
            <button
              onClick={() => navigate(
                  section.type === "code"
                    ? `/admin/sections/${id}/add-question-code`
                    : `/admin/sections/${id}/add-question`
                )}
              className="underline font-medium hover:text-yellow-900"
            >
              Click here to add questions.
            </button>
          </div>
        )}

        {/* bulk upload */}
        {uploadSummary && (
          <div className="mt-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-sm space-y-1">
            <p className="font-semibold">✅ Upload Summary</p>
            <ul className="list-disc ml-6">
              <li>Total: {uploadSummary.summary?.total}</li>
              <li>Imported: {uploadSummary.summary?.imported}</li>
              <li>Failed: {uploadSummary.summary?.failed}</li>
            </ul>
            {uploadSummary.failed?.length > 0 && (
              <div className="text-red-600 mt-2">⚠️ Some questions failed to import.</div>
            )}
          </div>
        )}

        {uploadError && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded">
            ❌ {uploadError}
          </div>
        )}


        {/* Meta Info */}
        <div className="text-sm text-gray-600 border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <p><strong>Created:</strong> {new Date(createdAt).toLocaleString()}</p>
          <p><strong>Updated:</strong> {new Date(updatedAt).toLocaleString()}</p>
          <p><strong>Questions Linked:</strong> {questions?.length || 0}</p>
        </div>
      </div>
    </div>
  );
};

// Components
const Section = ({ title, children }) => (
  <div>
    <h2 className="text-lg font-bold text-gray-800 mb-3">{title}</h2>
    {children}
  </div>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>
);

const Card = ({ icon, label, children }) => (
  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl shadow-sm hover:shadow-md flex gap-3 items-start">
    <div className="mt-1 text-indigo-600">{icon}</div>
    <div>
      <p className="font-semibold text-gray-800">{label}</p>
      <p className="text-sm text-gray-600">{children}</p>
    </div>
  </div>
);

export default SinglePageViewSection;

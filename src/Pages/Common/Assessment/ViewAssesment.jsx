import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import {
  getAssessmentById,
  deleteAssessment,
  cloneAssessment,
  toggleAssessmentStatus,
  previewAssessment
} from '../../../Controllers/AssesmentController';

import Loader from '../../../Components/Loader';
import { useUser } from '../../../context/UserContext';

import {
  Clock, Settings2, BarChart2, BadgeCheck, CheckCircle, ShieldCheck,
  Shuffle, RefreshCw, Navigation2, Eye, LayoutList, FileQuestion,
  ClipboardCheck, Pencil, Trash2, Copy, ExternalLink
} from 'lucide-react';

const ViewAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const res = await getAssessmentById(id);
        setAssessment(res?.data?.assessment || null);
      } catch (err) {
        console.error("Failed to fetch assessment:", err);
        setError("Unable to load assessment details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAssessment();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this assessment?")) return;
    try {
      await deleteAssessment(id);
      navigate(`/${role}/assessments`);
    } catch (err) {
      alert("Failed to delete assessment.");
      console.error(err);
    }
  };

  const handleClone = async () => {
    try {
      const res = await cloneAssessment(id);
      navigate(`/${role}/assessments/${res.data.clonedAssessment._id}`);
    } catch (err) {
      alert("Failed to clone assessment.");
      console.error(err);
    }
  };

  const handleToggleStatus = async () => {
    try {
      const newStatus = !assessment.is_active;
      await toggleAssessmentStatus(id, newStatus);
      setAssessment(prev => ({ ...prev, is_active: newStatus }));
    } catch (err) {
      alert("Failed to toggle status.");
      console.error(err);
    }
  };

  const handlePreview = () => {
    previewAssessment(id);
    window.open(`/preview/assessment/${id}`, "_blank");
  };

  if (loading) return <Loader />;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!assessment) return <div className="p-6 text-gray-500">Assessment not found.</div>;

  const {
    title, description, difficulty_level, configuration, scoring,
    usage_stats, is_active, is_template, is_shareable, clone_count,
    creator_type, createdAt, updatedAt, sections = []
  } = assessment;

  const usedMarks = sections.reduce((sum, sec) => sum + (sec?.scoring?.total_marks || 0), 0);
  const remainingMarks = scoring.total_marks - usedMarks;
  const { role } = useUser();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-xl space-y-6 border border-gray-200">

        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-2">
              <ClipboardCheck className="w-7 h-7" />
              {title}
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                {is_active ? "Active" : "Inactive"}
              </span>
              {is_template && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">Template</span>
              )}
              {is_shareable && (
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">Shareable</span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleToggleStatus}
              className={`relative w-16 h-8 flex items-center rounded-full transition-colors duration-300 ${is_active ? "bg-green-500" : "bg-gray-400"}`}
              style={{ display: role === 'college_rep' ? 'none' : 'flex' }}
            >
              <span
                className={`absolute left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${is_active ? "translate-x-8" : "translate-x-0"}`}
              ></span>
            </button>

            <button onClick={() => navigate(`/${role}/assessments/edit/${id}`)}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm shadow"
              style={{ display: role === 'college_rep' ? 'none' : 'flex' }}
              >
              <Pencil className="w-4 h-4" /> Edit
            </button>
            <button onClick={handleDelete}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm shadow"
              style={{ display: role === 'college_rep' ? 'none' : 'flex' }}
              >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
            <button onClick={handleClone}
              className="flex items-center gap-2 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm shadow"
              style={{ display: role === 'college_rep' ? 'none' : 'flex' }}
              >
              <Copy className="w-4 h-4" /> Clone
            </button>
            <button onClick={handlePreview}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm shadow">
              <ExternalLink className="w-4 h-4" /> Preview
            </button>
          </div>
        </div>

        <p className="text-gray-700 italic text-sm bg-indigo-50 rounded-md px-4 py-2">
          {description || "No description provided."}
        </p>

        <Section title="Assessment Configuration">
          <Grid>
            <Card icon={<Clock className="text-indigo-600" />} title="Duration">
              {configuration.total_duration_minutes} mins (+{configuration.grace_period_minutes} grace)
            </Card>
            <Card icon={<Settings2 className="text-yellow-600" />} title="Max Attempts">
              {configuration.max_attempts}
            </Card>
            <Card icon={<Shuffle className="text-purple-600" />} title="Shuffle Sections">
              {configuration.shuffle_sections ? "Yes" : "No"}
            </Card>
            <Card icon={<Navigation2 className="text-pink-600" />} title="Section Navigation">
              {configuration.allow_section_navigation ? "Allowed" : "Restricted"}
            </Card>
            <Card icon={<Eye className="text-green-600" />} title="Show Result Immediately">
              {configuration.show_results_immediately ? "Yes" : "No"}
            </Card>
            <Card icon={<RefreshCw className="text-emerald-600" />} title="Allow Retake">
              {configuration.allow_retake ? "Yes" : "No"}
            </Card>
          </Grid>
        </Section>

        <Section title="Scoring Details">
          <Grid>
            <Card icon={<BarChart2 className="text-blue-600" />} title="Total Marks">
              {scoring.total_marks}
            </Card>
            <Card icon={<BadgeCheck className="text-emerald-600" />} title="Passing Marks">
              {scoring.passing_marks}
            </Card>
            <Card icon={<ShieldCheck className="text-red-500" />} title="Negative Marking">
              {scoring.negative_marking ? `Yes (-${scoring.negative_marks_per_wrong})` : "No"}
            </Card>
          </Grid>

          <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
            <p><strong>Used Marks:</strong> {usedMarks}</p>
            <p><strong>Remaining Marks:</strong> {remainingMarks}</p>
            {remainingMarks <= 0 && (
              <p className="text-red-600 mt-2">⚠️ All marks have been used. Cannot add more sections.</p>
            )}
          </div>
        </Section>

        <Section title="Usage Statistics">
          <Grid columns="grid-cols-2 sm:grid-cols-3">
            <Card icon={<LayoutList className="text-indigo-500" />} title="Assignments">
              {usage_stats.total_assignments}
            </Card>
            <Card icon={<FileQuestion className="text-orange-500" />} title="Attempts">
              {usage_stats.total_attempts}
            </Card>
            <Card icon={<CheckCircle className="text-purple-500" />} title="Cloned">
              {clone_count} times
            </Card>
          </Grid>
        </Section>

        <div className="text-sm text-gray-700 border-t pt-4 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Difficulty:</strong> {difficulty_level}</p>
          <p><strong>Creator Type:</strong> {creator_type}</p>
          <p><strong>Created:</strong> {new Date(createdAt).toLocaleString()}</p>
          <p><strong>Last Updated:</strong> {new Date(updatedAt).toLocaleString()}</p>
          <p><strong>Sections:</strong> {sections.length}</p>
        </div>

        <button
          onClick={() => navigate(`/${role}/assessments/${id}/create-section`)}
          disabled={remainingMarks <= 0}
          className={`mt-4 px-4 py-2 text-sm font-medium rounded-lg shadow ${remainingMarks <= 0 ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
          style={{ display: role === 'college_rep' ? 'none' : 'inline' }}
        >
          + Create Section
        </button>

        <button
          onClick={() => navigate(`/${role}/assessments/${id}/sections`)}
          className="mt-4 ml-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow"
        >
          📄 View Sections
        </button>

      </div>
    </div>
  );
};

const Card = ({ icon, title, children }) => (
  <div className="bg-gradient-to-tr from-indigo-50 to-white border border-gray-200 p-4 rounded-xl shadow-sm flex gap-3 items-start">
    <div className="mt-1">{icon}</div>
    <div>
      <p className="font-semibold text-gray-800">{title}</p>
      <p className="text-sm text-gray-600">{children}</p>
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div>
    <h2 className="text-lg font-bold text-gray-800 mb-3">{title}</h2>
    {children}
  </div>
);

const Grid = ({ children, columns = "grid-cols-1 md:grid-cols-2" }) => (
  <div className={`grid ${columns} gap-4`}>{children}</div>
);

export default ViewAssessment;

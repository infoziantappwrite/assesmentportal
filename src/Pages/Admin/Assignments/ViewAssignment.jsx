import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAssignmentById } from '../../../Controllers/AssignmentControllers';
import Loader from '../../../Components/Loader';
import { ArrowLeft, Pencil } from 'lucide-react';

const ViewAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await getAssignmentById(id);
        setAssignment(response.message.assignment);
      } catch (error) {
        console.error('Failed to fetch assignment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [id]);

  if (loading) return <Loader />;
  if (!assignment) return <div className="text-red-500 p-4">Assignment not found.</div>;

  const {
    title,
    description,
    status,
    assigned_by,
    assessment_id,
    schedule,
    settings,
    notification,
    stats,
    target,
  } = assignment;

  const statusColor = status === 'draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700';

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:underline text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        <button
          onClick={() => navigate(`/admin/assignments/edit/${id}`)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </button>
      </div>

      {/* Title Card */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor}`}>
            {status.toUpperCase()}
          </span>
        </div>
        <p className="text-gray-700">{description}</p>
      </div>

      {/* Sections */}
      <Section title="Assessment Info" color="blue">
        <Info label="Assessment" value={`${assessment_id?.title} – ${assessment_id?.description}`} />
        <Info label="Assigned By" value={`${assigned_by?.name} (${assigned_by?.email})`} />
      </Section>

      <Section title="Schedule" color="purple">
        <Grid>
          <Info label="Start Time" value={new Date(schedule?.start_time).toLocaleString()} />
          <Info label="End Time" value={new Date(schedule?.end_time).toLocaleString()} />
          <Info label="Timezone" value={schedule?.timezone} />
          <Info label="Grace Period" value={`${schedule?.grace_period_minutes} minutes`} />
        </Grid>
      </Section>

      <Section title="Assignment Settings" color="green">
        <Grid>
          <Info label="Allow Retake" value={settings?.allow_retake ? 'Yes' : 'No'} />
          <Info label="Max Attempts" value={settings?.max_attempts ?? 'Unlimited'} />
          <Info label="Randomize Questions" value={settings?.randomize_questions ? 'Yes' : 'No'} />
          <Info label="Show Results to Students" value={settings?.show_results_to_students ? 'Yes' : 'No'} />
          <Info label="Results Release Time" value={new Date(settings?.results_release_time).toLocaleString()} />
          <Info label="Proctoring Enabled" value={settings?.proctoring_enabled ? 'Yes' : 'No'} />
        </Grid>
      </Section>

      <Section title="Notification Status" color="indigo">
        <Grid>
          <Info label="Email Sent" value={notification?.email_sent ? 'Yes' : 'No'} />
          <Info label="SMS Sent" value={notification?.sms_sent ? 'Yes' : 'No'} />
        </Grid>
      </Section>

      <Section title="Performance Stats" color="orange">
        <Grid cols={3}>
          <Info label="Total Eligible" value={stats?.total_eligible} />
          <Info label="Started" value={stats?.started_count} />
          <Info label="Completed" value={stats?.completed_count} />
          <Info label="Average Score" value={stats?.average_score} />
          <Info label="Highest Score" value={stats?.highest_score} />
          <Info label="Lowest Score" value={stats?.lowest_score} />
        </Grid>
      </Section>

      <Section title="Target Info" color="pink">
        <Info label="Target Type" value={target?.type} />
        <Info label="Group IDs" value={target?.group_ids.join(', ') || 'None'} />
        <Info label="College IDs" value={target?.college_ids.join(', ') || 'None'} />
        <Info label="Student IDs" value={target?.student_ids.join(', ') || 'None'} />
      </Section>
    </div>
  );
};

// Styled Components

const Section = ({ title, children, color = 'gray' }) => {
  const colorMap = {
    blue: 'border-blue-200 bg-blue-50',
    green: 'border-green-200 bg-green-50',
    purple: 'border-purple-200 bg-purple-50',
    orange: 'border-orange-200 bg-orange-50',
    indigo: 'border-indigo-200 bg-indigo-50',
    pink: 'border-pink-200 bg-pink-50',
    gray: 'border-gray-200 bg-gray-50',
  };

  return (
    <div className={`p-5 rounded-xl border ${colorMap[color]} shadow-sm`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="text-sm text-gray-800">
    <span className="font-medium text-gray-600">{label}:</span> {value}
  </div>
);

const Grid = ({ children, cols = 2 }) => (
  <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-4`}>{children}</div>
);

export default ViewAssignment;

import React from 'react';
import {
  FaUserTie, FaClock, FaCheckCircle
} from 'react-icons/fa';
import { MdQuiz, MdScore, MdGroups } from 'react-icons/md';
import { BsPeopleFill } from 'react-icons/bs';
import { HiOfficeBuilding } from 'react-icons/hi';

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  });

const Card = ({ title, icon, children, gradient = "from-indigo-50 to-white" }) => (
  <div className={`rounded-xl p-5 shadow-sm bg-gradient-to-br ${gradient} border border-gray-300 hover:shadow-lg transition duration-300`}>
    <h3 className="text-[18px] font-semibold text-gray-800 mb-3 flex items-center gap-2">
      <span className="text-[20px]">{icon}</span>
      <span className="tracking-wide">{title}</span>
    </h3>
    <div className="text-[15px] text-gray-700 leading-relaxed">{children}</div>
  </div>
);

const AssignmentDetails = ({ assignment }) => {
  if (!assignment) return null;

  const { assessment_id, schedule, stats, target, description } = assignment;

  const renderTargetCard = () => {
    if (target?.type === 'individuals') {
      return (
        <Card title={`Target Students (${target.student_ids.length})`} icon={<BsPeopleFill className="text-cyan-600" />} gradient="from-cyan-50 to-white">
          <div className="max-h-56 overflow-y-auto pr-2 custom-scroll text-sm">
            <ul className="space-y-1 list-disc list-inside">
              {target.student_ids.map((student) => (
                <li key={student._id}>
                  <span className="font-medium">{student.name}</span> – <span className="text-gray-600">{student.email}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      );
    }

    if (target?.type === 'groups') {
      return (
        <Card title={`Target Groups (${target.group_ids.length})`} icon={<MdGroups className="text-pink-600" />} gradient="from-pink-50 to-white">
          <ul className="space-y-1 list-disc list-inside">
            {target.group_ids.map((group) => (
              <li key={group._id}>
                <span className="font-medium">{group.name}</span>
              </li>
            ))}
          </ul>
        </Card>
      );
    }

    if (target?.type === 'colleges') {
      return (
        <Card title={`Target Colleges (${target.college_ids.length})`} icon={<HiOfficeBuilding className="text-blue-600" />} gradient="from-blue-50 to-white">
          <ul className="space-y-1 list-disc list-inside">
            {target.college_ids.map((college) => (
              <li key={college._id}>
                <span className="font-medium">{college.name}</span>
              </li>
            ))}
          </ul>
        </Card>
      );
    }

    return null;
  };

  return (
    <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      <div className='col-span-3'>
        <Card title="Assessment" icon={<MdQuiz className="text-purple-600" />}>
          <p className="text-[16px] font-semibold">{assessment_id?.title}</p>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </Card>
      </div>

      <Card title="Schedule" icon={<FaClock className="text-amber-600" />} gradient="from-yellow-50 to-white">
        <ul className="space-y-1 text-sm">
          <li><strong>Start:</strong> {formatDate(schedule.start_time)}</li>
          <li><strong>End:</strong> {formatDate(schedule.end_time)}</li>
          <li><strong>Grace Period:</strong> {schedule.grace_period_minutes} mins</li>
          <li><strong>Timezone:</strong> {schedule.timezone}</li>
        </ul>
      </Card>

      <Card title="Assignment Stats" icon={<MdScore className="text-emerald-600" />} gradient="from-emerald-50 to-white">
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <p><strong>Eligible:</strong> {stats.total_eligible}</p>
          <p><strong>Started:</strong> {stats.started_count}</p>
          <p><strong>Completed:</strong> {stats.completed_count}</p>
          <p><strong>Avg Score:</strong> {stats.average_score}</p>
          <p><strong>Highest:</strong> {stats.highest_score}</p>
          <p><strong>Lowest:</strong> {stats.lowest_score}</p>
        </div>
      </Card>

      {renderTargetCard()}
    </div>
  );
};

export default AssignmentDetails;

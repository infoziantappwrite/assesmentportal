import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Code,
  FileText,
  TestTube2,
  BrainCircuit,
} from 'lucide-react';
import {
  getQuestionById,
  deleteQuestion,
} from '../../../Controllers/QuestionController';

const ViewCodingQuestionsInSection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getQuestionById(id);
        setQuestion(res?.data?.question || {});
      } catch (err) {
        console.error('Error fetching question:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete this question?');
    if (!confirm) return;

    try {
      await deleteQuestion(id);
      alert('Question deleted.');
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert('Failed to delete question.');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!question || question.type !== 'CODE') return <div className="p-6 text-red-600">Not found or not a coding question.</div>;

  const coding = question.coding_details || {};

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:underline text-sm"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Questions
      </button>

      {/* Question Meta */}
      <div className="bg-white shadow border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-700">
            {question?.content?.question_text}
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/admin/sections/question/edit/${question._id}`)}
              className="text-yellow-600 hover:text-yellow-800 text-sm flex items-center gap-1"
            >
              <Pencil size={16} /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-700">
          <Info label="Difficulty" value={question.difficulty} />
          <Info label="Marks" value={question.marks} />
          <Info label="Negative Marks" value={question.negative_marks} />
          <Info label="Sequence Order" value={question.sequence_order} />
          <Info label="Status" value={question.is_active ? 'Active' : 'Inactive'} />
        </div>
      </div>

      {/* Problem Details */}
      <Section title="Problem Details" icon={<FileText className="w-5 h-5 text-blue-600" />}>
        <Field label="Problem Statement" value={coding.problem_statement} />
        <Field label="Description" value={coding.problem_description} />
        <Field label="Input Format" value={coding.input_format} />
        <Field label="Output Format" value={coding.output_format} />
        <Field label="Constraints" value={coding.constraints} />
      </Section>

      {/* Complexity */}
      <Section title="Expected Complexity" icon={<BrainCircuit className="w-5 h-5 text-purple-600" />}>
        <Field label="Time Complexity" value={coding.time_complexity_expected} />
        <Field label="Space Complexity" value={coding.space_complexity_expected} />
        <Field label="Tags" value={coding.algorithm_tags?.join(', ') || '-'} />
      </Section>

      {/* Sample Test Cases */}
      <Section title="Sample Test Cases" icon={<TestTube2 className="w-5 h-5 text-yellow-600" />}>
        {coding.sample_test_cases?.map((test, idx) => (
          <div key={idx} className="border border-gray-200 rounded p-3 mb-3 bg-gray-50">
            <p><strong>Input:</strong> {test.input}</p>
            <p><strong>Output:</strong> {test.output}</p>
            {test.explanation && <p><strong>Explanation:</strong> {test.explanation}</p>}
          </div>
        ))}
      </Section>

      {/* Hidden Test Cases */}
      <Section title="Hidden Test Cases" icon={<TestTube2 className="w-5 h-5 text-red-600" />}>
        {coding.hidden_test_cases?.map((test, idx) => (
          <div key={idx} className="border border-gray-200 rounded p-3 mb-3 bg-gray-50">
            <p><strong>ID:</strong> {test.test_case_id}</p>
            <p><strong>Input:</strong> {test.input}</p>
            <p><strong>Expected Output:</strong> {test.expected_output}</p>
            <p><strong>Marks:</strong> {test.marks_weightage}</p>
            <p><strong>Time Limit:</strong> {test.time_limit_ms} ms</p>
            <p><strong>Memory Limit:</strong> {test.memory_limit_mb} MB</p>
          </div>
        ))}
      </Section>

      {/* Starter Code */}
      <Section title="Starter Code" icon={<Code className="w-5 h-5 text-green-600" />}>
        {coding.supported_languages?.map((langObj, idx) => (
          <div key={idx} className="space-y-1 mb-4">
            <p className="font-medium text-gray-700">{langObj.language}</p>
            <pre className="bg-gray-100 border border-gray-200 rounded p-3 text-sm overflow-auto whitespace-pre-wrap">
              {langObj.starter_code}
            </pre>
          </div>
        ))}
      </Section>

      {/* Explanation */}
      <Section title="Explanation" icon={<FileText className="w-5 h-5 text-gray-600" />}>
        <p className="text-gray-700">{question.explanation || '-'}</p>
      </Section>
    </div>
  );
};

// Utilities
const Section = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="bg-gray-100 p-2 rounded-full">{icon}</div>
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </div>
    <div className="space-y-3">{children}</div>
  </div>
);

const Field = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-600 font-medium">{label}</p>
    <div className="text-gray-800">{value || '-'}</div>
  </div>
);

const Info = ({ label, value }) => (
  <div>
    <p className="text-gray-500 text-xs">{label}</p>
    <p className="font-medium text-gray-800">{value ?? '-'}</p>
  </div>
);

export default ViewCodingQuestionsInSection;

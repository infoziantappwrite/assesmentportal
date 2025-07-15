import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  Pencil,
  Trash2,
  Save,
  X,
} from 'lucide-react';
import {
  getQuestionById,
  deleteQuestion,
  updateQuestion,
} from '../../../Controllers/QuestionController';

const ViewSingleQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    question_text: '',
    marks: 0,
    difficulty: '',
    explanation: '',
    options: [],
    correct_answers: [],
  });

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await getQuestionById(id);
        const data = res?.data?.question || {};
        setQuestion(data);
        setFormData({
          question_text: data?.content?.question_text || '',
          marks: data?.marks || 0,
          difficulty: data?.difficulty || '',
          explanation: data?.explanation || '',
          options: data?.options || [],
          correct_answers: data?.correct_answers || [],
        });
      } catch (error) {
        console.error('Error fetching question:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  const handleUpdate = async () => {
  try {
    const updatedData = {
      type: question.type, // must send type
      sequence_order: question.sequence_order, // must send this
      content: { question_text: formData.question_text },
      marks: Number(formData.marks),
      difficulty: formData.difficulty,
      explanation: formData.explanation,
      options: formData.options,
      correct_answers: formData.correct_answers,
    };

    console.log("Updating with:", updatedData);
    const res = await updateQuestion(id, updatedData);
    setQuestion(res?.data?.question || {});
    setIsEditing(false);
    alert('Question updated successfully.');
  } catch (err) {
    console.error(err);
    alert('Failed to update question.');
  }
};

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

  const handleOptionTextChange = (index, newText) => {
    const newOptions = [...formData.options];
    newOptions[index].text = newText;
    setFormData({ ...formData, options: newOptions });
  };

  const handleCorrectAnswerChange = (optionId) => {
    if (question.type === 'single_correct') {
      setFormData({ ...formData, correct_answers: [optionId] });
    } else {
      const current = new Set(formData.correct_answers);
      current.has(optionId) ? current.delete(optionId) : current.add(optionId);
      setFormData({ ...formData, correct_answers: Array.from(current) });
    }
  };

  if (loading) return <div className="p-6">Loading question...</div>;
  if (!question) return <div className="p-6 text-red-600">Question not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:underline text-sm mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 space-y-6">
        {/* Header & Actions */}
        <div className="flex justify-between items-start">
          <div className="w-full">
            {isEditing ? (
              <input
                className="text-xl font-bold text-indigo-700 w-full border border-gray-300 rounded px-3 py-2"
                value={formData.question_text}
                onChange={(e) =>
                  setFormData({ ...formData, question_text: e.target.value })
                }
              />
            ) : (
              <h1 className="text-2xl font-bold text-indigo-700">
                {question?.content?.question_text || 'Untitled Question'}
              </h1>
            )}
            <p className="text-sm text-gray-500 italic mt-1">
              Section: {question?.section_id?.description || '-'}
            </p>
          </div>

          <div className="flex gap-3 mt-1">
            {isEditing ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="text-green-600 hover:text-green-800 flex items-center gap-1 text-sm"
                >
                  <Save size={16} /> Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-600 hover:text-gray-800 flex items-center gap-1 text-sm"
                >
                  <X size={16} /> Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-yellow-600 hover:text-yellow-800 flex items-center gap-1 text-sm"
                >
                  <Pencil size={16} /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <h3 className="text-md font-semibold text-gray-800">Options:</h3>
          <ul className="space-y-2">
            {formData.options.map((opt, idx) => {
              const isCorrect = formData.correct_answers.includes(opt.option_id);
              return (
                <li
                  key={opt.option_id}
                  className={`p-3 rounded-lg border flex items-start gap-2 ${
                    isCorrect
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => isEditing && handleCorrectAnswerChange(opt.option_id)}
                    className="mt-1"
                  >
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {isEditing ? (
                    <input
                      type="text"
                      value={opt.text}
                      className="flex-1 border rounded px-2 py-1 text-sm"
                      onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                    />
                  ) : (
                    <span>{opt.text}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-700">
          <Info
            label="Marks"
            value={
              isEditing ? (
                <input
                  type="number"
                  className="border rounded px-2 py-1 w-full"
                  value={formData.marks}
                  onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                />
              ) : (
                question.marks
              )
            }
          />
          <Info
            label="Difficulty"
            value={
              isEditing ? (
                <select
                  className="border rounded px-2 py-1 w-full"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              ) : (
                question.difficulty
              )
            }
          />
          <Info label="Type" value={question.type} />
          <Info label="Negative Marks" value={question.negative_marks} />
          <Info label="Sequence Order" value={question.sequence_order} />
          <Info label="Status" value={question.is_active ? 'Active' : 'Inactive'} />
        </div>

        {/* Explanation */}
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-1">Explanation:</h3>
          {isEditing ? (
            <textarea
              rows={3}
              className="border rounded w-full px-3 py-2 text-sm"
              value={formData.explanation}
              onChange={(e) =>
                setFormData({ ...formData, explanation: e.target.value })
              }
            />
          ) : (
            <p className="text-gray-600">{question.explanation || '-'}</p>
          )}
        </div>

        {/* Meta */}
        <div className="text-xs text-gray-500 pt-4 border-t">
          <p>Created At: {new Date(question.createdAt).toLocaleString()}</p>
          <p>Last Updated: {new Date(question.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

// Info helper
const Info = ({ label, value }) => (
  <div>
    <span className="text-gray-500">{label}</span>
    <div className="font-medium text-gray-800">{value ?? '-'}</div>
  </div>
);

export default ViewSingleQuestion;

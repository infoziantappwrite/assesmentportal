import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestionsBySection } from '../../../Controllers/QuestionController';
import { Eye, Pencil, ArrowLeft } from 'lucide-react';

const ViewQuestionsInSection = () => {
  const { id } = useParams(); // Section ID
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  console.log(questions);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await getQuestionsBySection(id);
        setQuestions(res?.data?.questions || []);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading questions...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:underline text-sm mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Section
      </button>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-indigo-700">
            Questions in this Section
          </h2>
        </div>

        {/* Conditional Rendering */}
        {questions.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-md text-sm">
            No questions found in this section.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 rounded-md overflow-hidden">
              <thead className="bg-gray-50 text-gray-800 text-left">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Difficulty</th>
                  <th className="px-4 py-3">Marks</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, index) => (
                  <tr
                    key={q._id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">{q.title || '-'}</td>
                    <td className="px-4 py-3 capitalize">{q.type || '-'}</td>
                    <td className="px-4 py-3 capitalize">{q.difficulty || '-'}</td>
                    <td className="px-4 py-3 uppercase">{q.marks || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-4">
                        <button
                          onClick={() => navigate(`/admin/questions/view/${q._id}`)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Eye size={16} /> View
                        </button>
                        <button
                          onClick={() => navigate(`/admin/questions/edit/${q._id}`)}
                          className="text-yellow-600 hover:text-yellow-800 flex items-center gap-1"
                        >
                          <Pencil size={16} /> Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewQuestionsInSection;

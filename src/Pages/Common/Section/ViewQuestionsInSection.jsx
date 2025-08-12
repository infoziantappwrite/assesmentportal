import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestionsBySection } from '../../../Controllers/QuestionController';
import { Eye, ArrowLeft } from 'lucide-react';
import Table from '../../../Components/Table';
import { useUser } from '../../../context/UserContext';

const ViewQuestionsInSection = () => {
  const { id } = useParams(); // Section ID
  const navigate = useNavigate();
  const { role } = useUser();
  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await getQuestionsBySection(id);
        console.log(res);

        setQuestions(res?.data?.questions || []);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [id]);

  const columns = [
    {
      label: '#',
      render: (_, i) => <span className="font-medium text-gray-800">{i + 1}</span>,
    },
    {
      label: 'Title',
      render: (row) => <span>{row.content?.question_text || '-'}</span>
    },
    {
      label: 'Type',
      render: (row) => <span className="capitalize text-gray-600">{row.type || '-'}</span>,
    },
    {
      label: 'Difficulty',
      render: (row) => <span className="capitalize text-gray-600">{row.difficulty || '-'}</span>,
    },
    {
      label: 'Marks',
      render: (row) => <span className="text-gray-700">{row.marks || '-'}</span>,
    },
    {
      label: 'Actions',
      render: (row) => (
        <button
          onClick={() =>
            navigate(
              row.type === "coding"
                ? `/${role}/sections/question/coding/${row._id}`
                : `/${role}/sections/question/${row._id}`
            )
          }
          className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
        >
          <Eye size={16} />
          View
        </button>
      ),
    }

  ];

  if (loading) {
    return <div className="p-6 text-gray-500">Loading questions...</div>;
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

      <div className="p-6 rounded-xl  space-y-6">
        <h2 className="text-xl font-semibold text-indigo-700 mb-2">Questions in this Section</h2>

        <Table columns={columns} data={questions} noDataText="No questions found in this section." />
      </div>
    </div>
  );
};

export default ViewQuestionsInSection;

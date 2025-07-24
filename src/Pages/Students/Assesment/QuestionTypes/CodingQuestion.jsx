import React, { useEffect, useState } from 'react';
import {
  FileText,
  Download,
  Upload,
  AlertCircle,
  Target,
  Tag,
  FlaskConical,
  Timer,
  MemoryStick,
  Info,
  ShieldQuestion,
  Code2,
  ChevronDown,
  ChevronRight,
  Terminal,
  Cpu,
  Clock,
  Award,
  HardDrive,
  Hash
} from 'lucide-react';
import { getCodingQuestionById } from '../../../../Controllers/QuestionController';
import SolutionSection from './SolutionSection';
import ErrorBoundary from '../../../../Components/ErrorBoundary';
import {questionVisited,} from '../../../../Controllers/SubmissionController';


const CodingQuestion = ({
  question,
  refreshSectionStatus,
  answerStatus
}) => {
  const submissionId = localStorage.getItem('submission_id');
  //console.log(answerStatus)
  const [answer, setAnswer] = useState('');
  const [fullDetails, setFullDetails] = useState(null);
  const [activeSection, setActiveSection] = useState('problem');
  const [expandedTestCases, setExpandedTestCases] = useState({sample: true,hidden: false});
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  
  // Safety check for required props
  

  // Function to handle answer changes
  const handleAnswerChange = (questionId, newAnswer) => {
    setAnswer(newAnswer);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getCodingQuestionById(question._id);
        setFullDetails(res.data?.codingQuestion);
        //console.log(fullDetails)
        // Set default language if available
        if (res.data?.codingQuestion?.supported_languages?.length) {
          setSelectedLanguage(res.data.codingQuestion.supported_languages[0].language);
        }
      } catch (error) {
        console.error('Failed to fetch coding question details:', error);
      }
    };

    fetchDetails();
  }, [question._id]);

  // Load existing answer if any
  useEffect(() => {
  const loadExistingAnswer = async () => {
    try {
      if (!answerStatus) {
        // Answer not available yet, mark as visited
        await questionVisited({
          submissionID: submissionId,
          sectionID: question.section_id,
          questionID: question._id,
          type: question.type,
          isMarkedForReview: false,
          isSkipped: true,
        });
      } else {
        // Set code and language from saved answer
        setAnswer(answerStatus.code_solution || '');
        if (answerStatus) {
          console.log(answerStatus.programming_language)
          setSelectedLanguage(answerStatus.programming_language);
        }
      }
    } catch  {
      //console.error('Failed to load or visit question:', error);
    }
  };

  loadExistingAnswer();
}, [question._id, submissionId, answerStatus]);


  const toggleTestCase = (type) => {
    setExpandedTestCases(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!fullDetails) return <div className="text-center py-10">Loading question details...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{question.content?.question_text}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <Target className="w-3 h-3 mr-1" /> {fullDetails.difficulty_level}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              <Hash className="w-3 h-3 mr-1" /> {question.marks} marks
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors ${activeSection === section.id
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <section.icon className="w-4 h-4" />
            {section.title}
          </button>
        ))}
      </div>

      {/* Problem Section */}
      {activeSection === 'problem' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-500" />
              Problem Statement
            </h2>
            <div className="prose prose-sm max-w-none text-gray-700">
              <p>{fullDetails.problem_statement}</p>
              {fullDetails.problem_description && (
                <p className="mt-2">{fullDetails.problem_description}</p>
              )}
            </div>
          </div>

          {fullDetails.algorithm_tags?.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {fullDetails.algorithm_tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {tag.replace(/"/g, '')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input/Output Section */}
      {activeSection === 'io' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <Download className="w-5 h-5 text-indigo-500" />
              Input Format
            </h2>
            <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap">{fullDetails.input_format}</pre>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <Upload className="w-5 h-5 text-indigo-500" />
              Output Format
            </h2>
            <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap">{fullDetails.output_format}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Constraints Section */}
      {activeSection === 'constraints' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-indigo-500" />
              Constraints
            </h2>
            <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap">{fullDetails.constraints}</pre>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                <Timer className="w-4 h-4" />
                Time Complexity
              </h3>
              <p className="text-gray-800 font-mono">
                {fullDetails.time_complexity_expected || 'Not specified'}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                <MemoryStick className="w-4 h-4" />
                Space Complexity
              </h3>
              <p className="text-gray-800 font-mono">
                {fullDetails.space_complexity_expected || 'Not specified'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Test Cases Section */}
      {activeSection === 'testcases' && (
        <div className="space-y-6">
          {/* Sample Test Cases */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleTestCase('sample')}
              className="w-full flex items-center justify-between px-6 py-4 text-left font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FlaskConical className="w-5 h-5 text-yellow-500" />
                <span>Sample Test Cases</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {fullDetails.sample_test_cases?.length || 0} cases
                </span>
              </div>
              {expandedTestCases.sample ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedTestCases.sample && (
              <div className="px-6 pb-6 space-y-4">
                {fullDetails.sample_test_cases?.map((tc, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                      <h4 className="font-medium text-gray-700">Sample Case {index + 1}</h4>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Input</p>
                        <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                          {tc.input}
                        </pre>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Output</p>
                        <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                          {tc.output}
                        </pre>
                      </div>
                      {tc.explanation && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Explanation</p>
                          <p className="text-sm text-gray-700">{tc.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hidden Test Cases */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleTestCase('hidden')}
              className="w-full flex items-center justify-between px-6 py-4 text-left font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShieldQuestion className="w-5 h-5 text-red-500" />
                <span>Hidden Test Cases</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {fullDetails.hidden_test_cases?.length || 0} cases
                </span>
              </div>
              {expandedTestCases.hidden ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedTestCases.hidden && (
              <div className="px-6 pb-6 space-y-4">
                {fullDetails.hidden_test_cases?.map((tc, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                      <h4 className="font-medium text-gray-700">Hidden Case {index + 1}</h4>
                      <span className="text-xs font-mono text-gray-500">ID: {tc.test_case_id}</span>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Input</p>
                          <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                            {tc.input}
                          </pre>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Expected Output</p>
                          <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                            {tc.expected_output}
                          </pre>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-3 pt-2">
                        <div className="text-center">
                          <p className="text-xs font-medium text-gray-500">Time Limit</p>
                          <p className="text-sm font-medium text-gray-800 flex items-center justify-center gap-1">
                            <Clock className="w-4 h-4" /> {tc.time_limit_ms}ms
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-medium text-gray-500">Memory Limit</p>
                          <p className="text-sm font-medium text-gray-800 flex items-center justify-center gap-1">
                            <HardDrive className="w-4 h-4" /> {tc.memory_limit_mb}MB
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-medium text-gray-500">Weightage</p>
                          <p className="text-sm font-medium text-gray-800 flex items-center justify-center gap-1">
                            <Award className="w-4 h-4" /> {tc.marks_weightage}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Solution Section */}
      {activeSection === 'solution' && (
        <ErrorBoundary>
          <SolutionSection
            question={question}
            answer={answer}
            onAnswerChange={handleAnswerChange}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            fullDetails={fullDetails}
            submissionId={submissionId}
            refreshSectionStatus={refreshSectionStatus}
          />
        </ErrorBoundary>
      )}
    </div>
  );
};

const sections = [
  { id: 'problem', title: 'Problem', icon: FileText },
  { id: 'io', title: 'Input/Output', icon: Terminal },
  { id: 'constraints', title: 'Constraints', icon: Cpu },
  { id: 'testcases', title: 'Test Cases', icon: FlaskConical },
  { id: 'solution', title: 'Your Solution', icon: Code2 }
];

export default CodingQuestion;
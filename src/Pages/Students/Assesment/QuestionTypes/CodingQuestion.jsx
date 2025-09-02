import React, { useEffect, useState } from 'react';
import {
  Download,
  Upload,
  AlertCircle,
  Target,
  Tag,
  FlaskConical,
  Timer,
  MemoryStick,
  Info,
  Hash
} from 'lucide-react';
import { getCodingQuestionById } from '../../../../Controllers/QuestionController';
import SolutionSection from './SolutionSection';
import ErrorBoundary from '../../../../Components/ErrorBoundary';
import { questionVisited, } from '../../../../Controllers/SubmissionController';
import { getAnsweredStatus } from '../../../../Controllers/SubmissionController';


const CodingQuestion = ({
  question,
  refreshSectionStatus,
  answerStatus,
  questionIndex,
  layout
}) => {
  const submissionId = localStorage.getItem('submission_id');
  //console.log(answerStatus)
  const [answer, setAnswer] = useState('');
  const [fullDetails, setFullDetails] = useState(null);

  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false); // null = loading


  // Safety check for required props


  // Function to handle answer changes
  const handleAnswerChange = (questionId, newAnswer) => {
    setAnswer(newAnswer);
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await getAnsweredStatus(submissionId, question._id);
        if(res.isAlreadyExecuted === true){
          setIsAnswerSubmitted(true);
        } else{
          setIsAnswerSubmitted(false);
        }

        
      } catch (err) {
        console.error("Error fetching status:", err);
        
      }
    };

    if (submissionId && question._id) {
      fetchStatus();
    }
  }, [submissionId, question._id]);


  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getCodingQuestionById(question._id);
        setFullDetails(res.data?.codingQuestion);
        //console.log(fullDetails)
        // Set default language if available
        if (!answerStatus?.programming_language) {
          if (res.data?.codingQuestion?.supported_languages?.length) {
            setSelectedLanguage(res.data.codingQuestion.supported_languages[0].language);
          }
        }
      } catch (error) {
        console.error('Failed to fetch coding question details:', error);
      }
    };

    fetchDetails();
  }, [question._id]);

  // Load existing answer if any - FIXED: Clear state immediately on question change
  useEffect(() => {
    const loadExistingAnswer = async () => {
      try {
        // CRITICAL FIX: Always clear answer state first when question changes
        setAnswer('');
        
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
          if (answerStatus?.programming_language) {
            //console.log(answerStatus.programming_language)
            setSelectedLanguage(answerStatus.programming_language);
          }
        }
      } catch {
        //console.error('Failed to load or visit question:', error);
      }
    };

    loadExistingAnswer();
  }, [question._id, submissionId, answerStatus]);




  if (!fullDetails) return <div className="text-center py-10">Loading question details...</div>;

  return (
    <div >
      {/* Header */}
      <div
        className={`grid gap-4 ${layout === 'left-info' ? 'lg:grid-cols-2' : 'lg:grid-cols-5'
          } md:grid-cols-2`}
      >



        <div className='col-span-2 bg-white border border-gray-200 rounded-xl p-2 '>
          <div className=" h-[90vh] overflow-y-auto p-3 space-y-6">

            {/* Header Section */}
            <div>
              <h2 className="mb-2 font-semibold text-lg text-gray-800">
                Q{questionIndex + 1}. {question.content.question_text}
              </h2>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <Target className="w-3 h-3 mr-1" /> {fullDetails.difficulty_level}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <Hash className="w-3 h-3 mr-1" /> {question.marks} marks
                </span>
              </div>
            </div>

            {/* Problem Statement */}
            <div className="border-t border-gray-300 pt-4 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-500" />
                Problem Statement
              </h2>
              <div className="prose prose-sm max-w-none text-gray-700">
                <p>{fullDetails.problem_statement}</p>
                {fullDetails.problem_description && <p className="mt-2">{fullDetails.problem_description}</p>}
              </div>
              {fullDetails.algorithm_tags?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-gray-500" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {fullDetails.algorithm_tags.map((tag, i) => (
                      <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {tag.replace(/"/g, '')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input / Output Section */}
            <div className="grid md:grid-cols-2 gap-6 border-t border-gray-300 pt-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-2">
                  <Download className="w-5 h-5 text-indigo-500" />
                  Input Format
                </h2>
                <pre className="bg-gray-50 text-gray-700 p-3 text-sm rounded whitespace-pre-wrap">
                  {fullDetails.input_format}
                </pre>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-2">
                  <Upload className="w-5 h-5 text-indigo-500" />
                  Output Format
                </h2>
                <pre className="bg-gray-50 text-gray-700 p-3 text-sm rounded whitespace-pre-wrap">
                  {fullDetails.output_format}
                </pre>
              </div>
            </div>

            {/* Constraints Section */}
            <div className="border-t border-gray-300 pt-4 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-indigo-500" />
                Constraints
              </h2>
              <pre className="bg-gray-50 text-gray-700 p-3 text-sm rounded whitespace-pre-wrap">
                {fullDetails.constraints}
              </pre>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1">
                    <Timer className="w-4 h-4" /> Time Complexity
                  </h3>
                  <p className="text-sm text-gray-800 font-mono">
                    {fullDetails.time_complexity_expected || 'Not specified'}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1">
                    <MemoryStick className="w-4 h-4" /> Space Complexity
                  </h3>
                  <p className="text-sm text-gray-800 font-mono">
                    {fullDetails.space_complexity_expected || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Sample Test Cases */}
            <div className="border-t border-gray-300 pt-4 space-y-4">
              <div className="flex items-center gap-3 text-gray-800 font-medium">
                <FlaskConical className="w-5 h-5 text-yellow-500" />
                Sample Test Cases
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {fullDetails.sample_test_cases?.length || 0} cases
                </span>
              </div>
              {fullDetails.sample_test_cases?.map((tc, index) => (
                <div key={index} className="space-y-3 border border-gray-200 rounded-xl p-4">
                  <h4 className="font-medium text-gray-700">Sample Case {index + 1}</h4>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Input</p>
                    <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">{tc.input}</pre>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Output</p>
                    <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">{tc.output}</pre>
                  </div>
                  {tc.explanation && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Explanation</p>
                      <p className="text-sm text-gray-700">{tc.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>


        {/* Solution Section */}
        <div className='col-span-3'>
          <div >
            <ErrorBoundary>
              <SolutionSection
                question={question}
                // if code is changed it calls onAnswerChange, which sets `answer` and passes down, but
                // child has `stableAnswer` and manages its own state, but also stableAnswer is changed to `answer`.
                answer={answer}
                onAnswerChange={handleAnswerChange}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                fullDetails={fullDetails}
                submissionId={submissionId}
                refreshSectionStatus={refreshSectionStatus}
              />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
};



export default CodingQuestion;
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCodingQuestionById,
  updateCodingQuestion,
  deleteCodingQuestion,
} from "../../../Controllers/QuestionController";
import {
  Pencil,
  Trash2,
  Save,
  XCircle,
  Code2,
  LayoutList,
  Brain,
  LoaderCircle,
  TestTube2,
  EyeOff,
  Code,
  Clock,
  MemoryStick,
  CheckCircle2,
  X,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const Toast = ({ message, type, onClose }) => {
  const bgColor = {
    success: "bg-green-50 border border-green-200 text-green-800",
    error: "bg-red-50 border border-red-200 text-red-800",
  };

  return (
    <div className={`fixed top-6 right-6 p-4 rounded-lg shadow-lg ${bgColor[type]} max-w-md z-50 flex items-start animate-fade-in`}>
      <div className="flex-shrink-0 mt-0.5">
        {type === "success" ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <X className="h-5 w-5 text-red-500" />
        )}
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-gray-500 focus:outline-none"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

const ViewCodingQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    problem: true,
    sample: true,
    hidden: true,
    languages: true,
    evaluation: true,
    metadata: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await getCodingQuestionById(id);
        const data = res?.data?.codingQuestion;
        setQuestion(data);
        setFormData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching coding question:", err);
        showToast("Failed to load question. Please try again.", "error");
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (parentField, index, field, value) => {
    setFormData(prev => {
      const updatedArray = [...prev[parentField]];
      updatedArray[index] = {
        ...updatedArray[index],
        [field]: value
      };
      return {
        ...prev,
        [parentField]: updatedArray
      };
    });
  };

  const handleSave = async () => {
    try {
      await updateCodingQuestion(id, formData);
      const refreshed = await getCodingQuestionById(id);
      const updatedData = refreshed?.data?.codingQuestion;
      setQuestion(updatedData);
      setFormData(updatedData);
      setIsEditing(false);
      showToast("Question updated successfully!", "success");
    } catch (err) {
      console.error("Error updating coding question:", err);
      showToast("Failed to update question. Please try again.", "error");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteCodingQuestion(id);
        showToast("Question deleted successfully!", "success");
        setTimeout(() => navigate(-1), 1000);
      } catch (err) {
        console.error("Error deleting coding question:", err);
        showToast("Failed to delete question. Please try again.", "error");
      }
    }
  };

  const addSampleTestCase = () => {
    setFormData(prev => ({
      ...prev,
      sample_test_cases: [
        ...prev.sample_test_cases,
        { input: "", output: "", explanation: "" }
      ]
    }));
  };

  const addHiddenTestCase = () => {
    setFormData(prev => ({
      ...prev,
      hidden_test_cases: [
        ...prev.hidden_test_cases,
        { 
          test_case_id: `hidden_${Date.now()}`,
          input: "",
          expected_output: "",
          marks_weightage: 1,
          time_limit_ms: 1000,
          memory_limit_mb: 256
        }
      ]
    }));
  };

  const removeTestCase = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addSupportedLanguage = () => {
    setFormData(prev => ({
      ...prev,
      supported_languages: [
        ...prev.supported_languages,
        { language_id: `lang_${Date.now()}`, language: "", starter_code: "" }
      ]
    }));
  };

  const removeSupportedLanguage = (index) => {
    setFormData(prev => ({
      ...prev,
      supported_languages: prev.supported_languages.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-indigo-600">
        <div className="text-center">
          <LoaderCircle className="animate-spin h-12 w-12 mx-auto mb-4" />
          <p className="text-lg font-medium">Loading Question...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-6 max-w-md">
          <Code2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Question Not Found</h3>
          <p className="text-gray-500 mb-4">The requested coding question could not be found.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Code2 className="text-indigo-600" size={28} />
            <span>Coding Question</span>
            <span className="text-sm font-normal bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full ml-2">
              {formData?.difficulty_level || "No difficulty set"}
            </span>
          </h1>
          <p className="text-gray-500 mt-1">
            {formData?.problem_statement?.substring(0, 100)}{formData?.problem_statement?.length > 100 ? "..." : ""}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {!isEditing ? (
            <>
              <ActionButton 
                color="indigo" 
                onClick={() => setIsEditing(true)} 
                icon={<Pencil size={18} />}
              >
                Edit Question
              </ActionButton>
              <ActionButton 
                color="red" 
                onClick={handleDelete} 
                icon={<Trash2 size={18} />}
              >
                Delete
              </ActionButton>
            </>
          ) : (
            <>
              <ActionButton 
                color="green" 
                onClick={handleSave} 
                icon={<Save size={18} />}
              >
                Save Changes
              </ActionButton>
              <ActionButton
                color="gray"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(question);
                }}
                icon={<XCircle size={18} />}
              >
                Discard Changes
              </ActionButton>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Problem Section */}
        <SectionCard 
          title="Problem Details" 
          icon={<LayoutList size={18} />} 
          color="bg-indigo-50 border-indigo-100" 
          isExpanded={expandedSections.problem}
          onToggle={() => toggleSection('problem')}
        >
          <div className="space-y-4">
            <Field 
              label="Problem Statement" 
              name="problem_statement" 
              value={formData?.problem_statement} 
              onChange={handleChange} 
              isEditing={isEditing} 
              textarea 
            />
            <Field 
              label="Problem Description" 
              name="problem_description" 
              value={formData?.problem_description} 
              onChange={handleChange} 
              isEditing={isEditing} 
              textarea 
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field 
                label="Input Format" 
                name="input_format" 
                value={formData?.input_format} 
                onChange={handleChange} 
                isEditing={isEditing} 
                textarea 
              />
              <Field 
                label="Output Format" 
                name="output_format" 
                value={formData?.output_format} 
                onChange={handleChange} 
                isEditing={isEditing} 
                textarea 
              />
            </div>
            <Field 
              label="Constraints" 
              name="constraints" 
              value={formData?.constraints} 
              onChange={handleChange} 
              isEditing={isEditing} 
              textarea 
            />
          </div>
        </SectionCard>

        {/* Sample Test Cases */}
        <SectionCard 
          title="Sample Test Cases" 
          icon={<TestTube2 size={18} />} 
          color="bg-blue-50 border-blue-100" 
          isExpanded={expandedSections.sample}
          onToggle={() => toggleSection('sample')}
        >
          <div className="space-y-6">
            {formData?.sample_test_cases?.map((testCase, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 relative">
                {isEditing && (
                  <button 
                    onClick={() => removeTestCase('sample_test_cases', index)}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                    title="Remove test case"
                  >
                    <X size={16} />
                  </button>
                )}
                <div className="space-y-3">
                  <Field 
                    label="Input" 
                    name={`sample_test_cases[${index}].input`} 
                    value={testCase.input} 
                    onChange={(e) => handleNestedChange('sample_test_cases', index, 'input', e.target.value)} 
                    isEditing={isEditing} 
                    textarea 
                  />
                  <Field 
                    label="Output" 
                    name={`sample_test_cases[${index}].output`} 
                    value={testCase.output} 
                    onChange={(e) => handleNestedChange('sample_test_cases', index, 'output', e.target.value)} 
                    isEditing={isEditing} 
                    textarea
                  />
                  <Field 
                    label="Explanation" 
                    name={`sample_test_cases[${index}].explanation`} 
                    value={testCase.explanation} 
                    onChange={(e) => handleNestedChange('sample_test_cases', index, 'explanation', e.target.value)} 
                    isEditing={isEditing} 
                    textarea 
                  />
                </div>
              </div>
            ))}
            {isEditing && (
              <button
                onClick={addSampleTestCase}
                className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg border border-dashed border-blue-200 hover:bg-blue-100 transition flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add Sample Test Case
              </button>
            )}
          </div>
        </SectionCard>

        {/* Hidden Test Cases */}
        <SectionCard 
          title="Hidden Test Cases" 
          icon={<EyeOff size={18} />} 
          color="bg-purple-50 border-purple-100" 
          isExpanded={expandedSections.hidden}
          onToggle={() => toggleSection('hidden')}
        >
          <div className="space-y-6">
            {formData?.hidden_test_cases?.map((testCase, index) => (
              <div key={testCase.test_case_id || index} className="bg-white p-4 rounded-lg border border-gray-200 relative">
                {isEditing && (
                  <button 
                    onClick={() => removeTestCase('hidden_test_cases', index)}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                    title="Remove test case"
                  >
                    <X size={16} />
                  </button>
                )}
                <div className="space-y-3">
                  <Field 
                    label="Test Case ID" 
                    name={`hidden_test_cases[${index}].test_case_id`} 
                    value={testCase.test_case_id} 
                    onChange={(e) => handleNestedChange('hidden_test_cases', index, 'test_case_id', e.target.value)} 
                    isEditing={isEditing} 
                    disabled={!isEditing}
                  />
                  <Field 
                    label="Input" 
                    name={`hidden_test_cases[${index}].input`} 
                    value={testCase.input} 
                    onChange={(e) => handleNestedChange('hidden_test_cases', index, 'input', e.target.value)} 
                    isEditing={isEditing} 
                    textarea 
                  />
                  <Field 
                    label="Expected Output" 
                    name={`hidden_test_cases[${index}].expected_output`} 
                    value={testCase.expected_output} 
                    onChange={(e) => handleNestedChange('hidden_test_cases', index, 'expected_output', e.target.value)} 
                    isEditing={isEditing} 
                    textarea
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Field 
                      label="Marks Weightage" 
                      name={`hidden_test_cases[${index}].marks_weightage`} 
                      value={testCase.marks_weightage} 
                      onChange={(e) => handleNestedChange('hidden_test_cases', index, 'marks_weightage', e.target.value)} 
                      isEditing={isEditing} 
                      type="number"
                      min="1"
                    />
                    <Field 
                      label="Time Limit (ms)" 
                      name={`hidden_test_cases[${index}].time_limit_ms`} 
                      value={testCase.time_limit_ms} 
                      onChange={(e) => handleNestedChange('hidden_test_cases', index, 'time_limit_ms', e.target.value)} 
                      isEditing={isEditing} 
                      type="number"
                      min="100"
                    />
                    <Field 
                      label="Memory Limit (MB)" 
                      name={`hidden_test_cases[${index}].memory_limit_mb`} 
                      value={testCase.memory_limit_mb} 
                      onChange={(e) => handleNestedChange('hidden_test_cases', index, 'memory_limit_mb', e.target.value)} 
                      isEditing={isEditing} 
                      type="number"
                      min="16"
                    />
                  </div>
                </div>
              </div>
            ))}
            {isEditing && (
              <button
                onClick={addHiddenTestCase}
                className="w-full py-2 bg-purple-50 text-purple-600 rounded-lg border border-dashed border-purple-200 hover:bg-purple-100 transition flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add Hidden Test Case
              </button>
            )}
          </div>
        </SectionCard>

        {/* Supported Languages */}
        <SectionCard 
          title="Supported Languages" 
          icon={<Code size={18} />} 
          color="bg-yellow-50 border-yellow-100" 
          isExpanded={expandedSections.languages}
          onToggle={() => toggleSection('languages')}
        >
          <div className="space-y-6">
            {formData?.supported_languages?.map((lang, index) => (
              <div key={lang.language_id || index} className="bg-white p-4 rounded-lg border border-gray-200 relative">
                {isEditing && (
                  <button 
                    onClick={() => removeSupportedLanguage(index)}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                    title="Remove language"
                  >
                    <X size={16} />
                  </button>
                )}
                <div className="space-y-3">
                  <Field 
                    label="Language" 
                    name={`supported_languages[${index}].language`} 
                    value={lang.language} 
                    onChange={(e) => handleNestedChange('supported_languages', index, 'language', e.target.value)} 
                    isEditing={isEditing} 
                  />
                  <Field 
                    label="Starter Code" 
                    name={`supported_languages[${index}].starter_code`} 
                    value={lang.starter_code} 
                    onChange={(e) => handleNestedChange('supported_languages', index, 'starter_code', e.target.value)} 
                    isEditing={isEditing} 
                    textarea 
                  />
                </div>
              </div>
            ))}
            {isEditing && (
              <button
                onClick={addSupportedLanguage}
                className="w-full py-2 bg-yellow-50 text-yellow-600 rounded-lg border border-dashed border-yellow-200 hover:bg-yellow-100 transition flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add Supported Language
              </button>
            )}
          </div>
        </SectionCard>

        {/* Evaluation Criteria */}
        <SectionCard 
          title="Evaluation Criteria" 
          icon={<Brain size={18} />} 
          color="bg-green-50 border-green-100" 
          isExpanded={expandedSections.evaluation}
          onToggle={() => toggleSection('evaluation')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field 
              label="Time Complexity" 
              name="time_complexity_expected" 
              value={formData?.time_complexity_expected} 
              onChange={handleChange} 
              isEditing={isEditing} 
            />
            <Field 
              label="Space Complexity" 
              name="space_complexity_expected" 
              value={formData?.space_complexity_expected} 
              onChange={handleChange} 
              isEditing={isEditing} 
            />
            <Field 
              label="Difficulty Level" 
              name="difficulty_level" 
              value={formData?.difficulty_level} 
              onChange={handleChange} 
              isEditing={isEditing} 
            />
            <Field 
              label="Algorithm Tags (comma separated)" 
              name="algorithm_tags" 
              value={formData?.algorithm_tags?.join(', ')} 
              onChange={(e) => {
                const tags = e.target.value.split(',').map(tag => tag.trim());
                setFormData(prev => ({
                  ...prev,
                  algorithm_tags: tags
                }));
              }} 
              isEditing={isEditing} 
            />
          </div>
        </SectionCard>

        {/* Metadata */}
        <SectionCard 
          title="Metadata" 
          icon={<Clock size={18} />} 
          color="bg-gray-50 border-gray-100" 
          isExpanded={expandedSections.metadata}
          onToggle={() => toggleSection('metadata')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field 
              label="Created At" 
              name="createdAt" 
              value={new Date(formData?.createdAt).toLocaleString()} 
              isEditing={false} 
            />
            <Field 
              label="Updated At" 
              name="updatedAt" 
              value={new Date(formData?.updatedAt).toLocaleString()} 
              isEditing={false} 
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

const SectionCard = ({ title, icon, children, color, isExpanded, onToggle }) => (
  <div className={`rounded-xl border ${color} overflow-hidden`}>
    <button
      onClick={onToggle}
      className={`w-full px-5 py-4 text-left flex items-center justify-between font-medium ${isExpanded ? 'border-b' : ''}`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span>{title}</span>
      </div>
      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
    </button>
    {isExpanded && (
      <div className="p-5">
        {children}
      </div>
    )}
  </div>
);

const Field = ({ label, name, value, onChange, isEditing, type = "text", textarea = false, disabled = false, min }) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {isEditing ? (
        textarea ? (
          <textarea
            name={name}
            value={value ?? ""}
            onChange={onChange}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm min-h-[100px]"
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            disabled={disabled}
            min={min}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
          />
        )
      ) : (
        <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-800 whitespace-pre-wrap min-h-[40px]">
          {value || <span className="text-gray-400">—</span>}
        </div>
      )}
    </div>
  );
};

const ActionButton = ({ onClick, icon, children, color = "indigo" }) => {
  const baseColor = {
    indigo: "bg-indigo-600 text-white hover:bg-indigo-700",
    red: "bg-red-600 text-white hover:bg-red-700",
    green: "bg-green-600 text-white hover:bg-green-700",
    gray: "bg-gray-200 text-gray-700 hover:bg-gray-300",
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md flex items-center gap-2 font-medium transition ${baseColor[color]} shadow-sm hover:shadow-md`}
    >
      {icon} {children}
    </button>
  );
};

export default ViewCodingQuestion;
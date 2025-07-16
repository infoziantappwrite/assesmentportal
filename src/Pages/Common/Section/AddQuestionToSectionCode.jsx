import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createQuestionInSection,
  addTestCasesToCodingQuestion,
} from "../../../Controllers/QuestionController";
import {
  ArrowLeft, FileText, PlusCircle, Code2, Beaker, ShieldCheck,
  Hash, Star, ListOrdered, Settings, FileCode, TestTube2, ChevronDown, X
} from "lucide-react";

const LANGUAGE_IDS = {
  java: 62,
  cpp: 54,
  c: 50,
  python3: 71,
  javascript: 63,
};

const DEFAULT_STARTER_CODE = {
  python3: "def is_prime(n): pass",
  javascript: "function isPrime(n) {}",
  java: "public class Main { static boolean isPrime(int n) { return false; } }",
  cpp: "bool isPrime(int n) { return false; }",
  c: "bool isPrime(int n) { return false; }",
};

const AddQuestionToSectionCode = () => {
  const { id: sectionID } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: "coding",
    content: {
      question_text: "",
      question_html: "",
      images: [],
      attachments: [],
    },
    difficulty: "medium",
    sequence_order: 1,
    marks: 5,
    coding_details: {
      problem_statement: "",
      problem_description: "",
      input_format: "",
      output_format: "",
      constraints: "",
      sample_test_cases: [
        { input: "", output: "", explanation: "" }
      ],
      hidden_test_cases: [
        { test_case_id: "", input: "", expected_output: "" }
      ],
      supported_languages: [
        {
          language: "python3",
          starter_code: DEFAULT_STARTER_CODE["python3"],
          language_id: 71,
        }
      ],
      difficulty_level: "medium",
      algorithm_tags: [""],
      time_complexity_expected: "",
      space_complexity_expected: "",
    },
  });

  const [activeSection, setActiveSection] = useState("basic");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e, path = []) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      let target = updated;
      for (const key of path) target = target[key];
      target[name] = value;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const ps = formData.coding_details.problem_statement.trim();
      if (ps.length < 5) {
        alert("Problem statement must be at least 5 characters.");
        return;
      }

      const submissionData = {
        ...formData,
        coding_details: {
          ...formData.coding_details,
          algorithm_tags: formData.coding_details.algorithm_tags
            .filter(tag => tag.trim() !== "")
            .map(tag => `"${tag.replace(/"/g, '')}"`),
          sample_test_cases: formData.coding_details.sample_test_cases.filter(
            tc => tc.input.trim() !== "" && tc.output.trim() !== ""
          ),
          hidden_test_cases: formData.coding_details.hidden_test_cases.filter(
            tc => tc.input.trim() !== "" && tc.expected_output.trim() !== ""
          )
        }
      };

      const res = await createQuestionInSection(sectionID, submissionData);
      const questionId = res?.question?._id;
      if (questionId) {
        await addTestCasesToCodingQuestion(questionId, {
          sampleTestCases: submissionData.coding_details.sample_test_cases,
          hiddenTestCases: submissionData.coding_details.hidden_test_cases,
          supportedLanguages: submissionData.coding_details.supported_languages,
        });
        setSuccessMessage("Question added successfully!");
        setTimeout(() => navigate(`/admin/sections/${sectionID}/questions`), 1500);
      }
    } catch (err) {
      console.error("Failed to submit coding question", err);
      alert(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setFormData(prev => ({
      ...prev,
      coding_details: {
        ...prev.coding_details,
        supported_languages: [{
          language: lang,
          language_id: LANGUAGE_IDS[lang],
          starter_code: DEFAULT_STARTER_CODE[lang] || "",
        }]
      }
    }));
  };

  const addTestCase = (type) => {
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      if (type === 'sample') {
        newData.coding_details.sample_test_cases.push({
          input: "", output: "", explanation: ""
        });
      } else {
        newData.coding_details.hidden_test_cases.push({
          test_case_id: "", input: "", expected_output: ""
        });
      }
      return newData;
    });
  };

  const removeTestCase = (type, index) => {
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      if (type === 'sample') {
        newData.coding_details.sample_test_cases.splice(index, 1);
      } else {
        newData.coding_details.hidden_test_cases.splice(index, 1);
      }
      return newData;
    });
  };

  const sections = [
    { id: "basic", title: "Basic Info", icon: Settings },
    { id: "problem", title: "Problem Details", icon: FileText },
    { id: "testcases", title: "Test Cases", icon: TestTube2 },
    { id: "language", title: "Language Config", icon: FileCode }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Back to Questions</span>
        </button>
        {successMessage && (
          <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-2 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {successMessage}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Add Coding Question</h1>
              <p className="text-indigo-100">Create a comprehensive coding challenge</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors ${activeSection === section.id ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <section.icon className="w-4 h-4" />
                {section.title}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Info Section */}
          {activeSection === "basic" && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Star className="w-4 h-4 text-indigo-500" /> Marks
                  </label>
                  <input 
                    type="number" 
                    name="marks" 
                    value={formData.marks}
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition"
                    min="1"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <ListOrdered className="w-4 h-4 text-indigo-500" /> Sequence Order
                  </label>
                  <input 
                    type="number" 
                    name="sequence_order" 
                    value={formData.sequence_order}
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition"
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-indigo-500" /> Difficulty
                  </label>
                  <div className="relative">
                    <select 
                      name="difficulty_level" 
                      value={formData.coding_details.difficulty_level}
                      onChange={(e) => handleChange(e, ["coding_details"])} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition appearance-none"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Question Text</label>
                <textarea 
                  name="question_text" 
                  value={formData.content.question_text}
                  onChange={(e) => handleChange(e, ["content"])} 
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition"
                  placeholder="Enter the question text that will be displayed to students..."
                />
              </div>
            </div>
          )}

          {/* Problem Details Section */}
          {activeSection === "problem" && (
            <div className="space-y-6">
              {[
                "problem_statement", "problem_description", "input_format", "output_format",
                "constraints", "time_complexity_expected", "space_complexity_expected"
              ].map(field => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {field.replace(/_/g, " ")}
                  </label>
                  <textarea 
                    name={field} 
                    value={formData.coding_details[field]}
                    onChange={(e) => handleChange(e, ["coding_details"])}
                    rows={field.includes('statement') || field.includes('description') ? 4 : 2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition"
                  />
                </div>
              ))}
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Algorithm Tags</label>
                <div className="flex flex-wrap gap-2">
                  {formData.coding_details.algorithm_tags
                    .filter(tag => tag.trim() !== "")
                    .map((tag, index) => (
                      <div key={index} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full flex items-center gap-2">
                        {tag}
                        <button
                          type="button"
                          onClick={() => {
                            const newTags = [...formData.coding_details.algorithm_tags];
                            newTags.splice(index, 1);
                            setFormData(prev => ({
                              ...prev,
                              coding_details: {
                                ...prev.coding_details,
                                algorithm_tags: newTags
                              }
                            }));
                          }}
                          className="text-indigo-400 hover:text-indigo-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  <input
                    type="text"
                    className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition"
                    placeholder="Add tag (press enter)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        e.preventDefault();
                        setFormData(prev => ({
                          ...prev,
                          coding_details: {
                            ...prev.coding_details,
                            algorithm_tags: [...prev.coding_details.algorithm_tags, e.target.value.trim()]
                          }
                        }));
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Test Cases Section */}
          {activeSection === "testcases" && (
            <div className="space-y-8">
              {/* Sample Test Cases */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                    <Beaker className="w-5 h-5 text-yellow-500" />
                    Sample Test Cases
                  </h3>
                  <button
                    type="button"
                    onClick={() => addTestCase('sample')}
                    className="text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1 rounded-lg flex items-center gap-1"
                  >
                    <PlusCircle className="w-4 h-4" /> Add Case
                  </button>
                </div>
                
                {formData.coding_details.sample_test_cases.map((testCase, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 space-y-4 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Sample Case #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeTestCase('sample', index)}
                        className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                      >
                        <X className="w-4 h-4" /> Remove
                      </button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      {['input', 'output', 'explanation'].map(field => (
                        <div key={field} className="space-y-1">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {field}
                          </label>
                          <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition"
                            value={testCase[field]}
                            onChange={(e) => {
                              const updated = JSON.parse(JSON.stringify(formData));
                              updated.coding_details.sample_test_cases[index][field] = e.target.value;
                              setFormData(updated);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Hidden Test Cases */}
              <div className="space-y-4 pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-red-500" />
                    Hidden Test Cases
                  </h3>
                  <button
                    type="button"
                    onClick={() => addTestCase('hidden')}
                    className="text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1 rounded-lg flex items-center gap-1"
                  >
                    <PlusCircle className="w-4 h-4" /> Add Case
                  </button>
                </div>
                
                {formData.coding_details.hidden_test_cases.map((testCase, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 space-y-4 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Hidden Case #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeTestCase('hidden', index)}
                        className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                      >
                        <X className="w-4 h-4" /> Remove
                      </button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      {['test_case_id', 'input', 'expected_output'].map(field => (
                        <div key={field} className="space-y-1">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {field.replace(/_/g, ' ')}
                          </label>
                          <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition"
                            value={testCase[field]}
                            onChange={(e) => {
                              const updated = JSON.parse(JSON.stringify(formData));
                              updated.coding_details.hidden_test_cases[index][field] = e.target.value;
                              setFormData(updated);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Language Configuration */}
          {activeSection === "language" && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Language</label>
                  <div className="relative">
                    <select
                      value={formData.coding_details.supported_languages[0].language}
                      onChange={handleLanguageChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition appearance-none"
                    >
                      {Object.keys(LANGUAGE_IDS).map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Starter Code</label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <textarea
                      rows="10"
                      className="w-full px-4 py-2 font-mono text-sm border-0 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition"
                      value={formData.coding_details.supported_languages[0].starter_code}
                      onChange={(e) => {
                        const updated = JSON.parse(JSON.stringify(formData));
                        updated.coding_details.supported_languages[0].starter_code = e.target.value;
                        setFormData(updated);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation and Submit */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <div className="flex gap-3">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`px-4 py-2 text-sm rounded-lg flex items-center gap-2 ${activeSection === section.id ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <section.icon className="w-4 h-4" />
                  {section.title}
                </button>
              ))}
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Submit Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestionToSectionCode;
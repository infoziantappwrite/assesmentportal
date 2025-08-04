import React, { useEffect, useState } from "react";
import { ClipboardList, Users, CalendarDays, Settings } from "lucide-react";
import { createAssignment } from "../../../Controllers/AssignmentControllers";
import { getallAssesment } from "../../../Controllers/AssesmentController";
import SelectCollegeModal from "../../Admin/User/SelectCollegeModal";
import SelectGroupModal from "../../Admin/User/SelectGroupModal";
import SelectStudentModal from "../../Admin/User/SelectStudentModal";

const CreateAssignment = () => {
  const [assessments, setAssessments] = useState([]);
  const [showCollegeModal, setShowCollegeModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);

  const [formData, setFormData] = useState({
    assessmentId: "",
    title: "",
    description: "",
    targetType: "",
    assignedColleges: [],
    assignedGroups: [],
    assignedStudents: [],
    schedule: {
      start_time: "",
      end_time: "",
      timezone: "Asia/Kolkata",
    },
    settings: {
      allow_retake: false,
      max_attempts: 1,
      randomize_questions: false,
      show_results_to_students: false,
      results_release_time: "",
      proctoring_enabled: false,
    },
  });


  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getallAssesment()
      .then((res) => setAssessments(res?.assessments || []))
      .catch((err) => console.error("Failed to fetch assessments", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("schedule.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        schedule: { ...prev.schedule, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Basic required field validation
    if (!formData.assessmentId) {
      return setMessage("Please select an assessment.");
    }
    if (!formData.title.trim()) {
      return setMessage("Assignment title is required.");
    }
    if (!formData.targetType) {
      return setMessage("Please select a target type.");
    }
    if (
      (formData.targetType === "colleges" && formData.assignedColleges.length === 0) ||
      (formData.targetType === "groups" && formData.assignedGroups.length === 0) ||
      (formData.targetType === "individuals" && formData.assignedStudents.length === 0)
    ) {
      return setMessage(`Please assign at least one ${formData.targetType.slice(0, -1)}.`);
    }
    if (!formData.schedule.start_time || !formData.schedule.end_time) {
      return setMessage("Start and end time are required.");
    }

    const now = new Date().getTime();
    const start = new Date(formData.schedule.start_time).getTime();
    const end = new Date(formData.schedule.end_time).getTime();

    if (start <= now) {
      return setMessage("Start time must be in the future.");
    }

    if (end <= start) {
      return setMessage("End time must be after start time.");
    }

    setLoading(true);

    const target = { type: formData.targetType };
    if (formData.targetType === "colleges") {
      target.college_ids = formData.assignedColleges.map((c) => c.id);
    } else if (formData.targetType === "groups") {
      target.group_ids = formData.assignedGroups.map((g) => g.id);
    } else if (formData.targetType === "individuals") {
      target.student_ids = formData.assignedStudents.map((s) => s.id);
    }

    const payload = {
      assessmentID: formData.assessmentId,
      title: formData.title.trim(),
      description: formData.description.trim(),
      target,
      schedule: {
    start_time: start,
    end_time: end,
    timezone: formData.schedule.timezone,
  },
      settings: {
    ...formData.settings,
    results_release_time: formData.settings.results_release_time
      ? new Date(formData.settings.results_release_time).getTime()
      : null,
  },
      
    };

    console.log(payload);

    try {
      await createAssignment(payload);
      setMessage("Assignment created successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to create assignment.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-600">
          Create New Assignment
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Assignment Info */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex gap-2 text-blue-600">
              <ClipboardList className="w-5 h-5 mt-1" /> Assignment Info
            </h2>
            <label className="block mb-1">Assessment</label>
            <select
              name="assessmentId"
              value={formData.assessmentId}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg mb-4"
              required
            >
              <option value="">-- Select Assessment --</option>
              {assessments.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.title}
                </option>
              ))}
            </select>

            <label className="block mb-1">Assignment Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg mb-4"
              required
            />

            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
          </div>

          {/* Target Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex gap-2 text-pink-600">
              <Users className="w-5 h-5 mt-1" /> Target
            </h2>

            <label className="block mb-1">Target Type</label>
            <select
              name="targetType"
              value={formData.targetType}
              onChange={handleChange}
              className="w-full mb-4 border border-gray-300 p-3 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              required
            >
              <option value="">-- Select Target Type --</option>
              <option value="colleges" className="text-blue-600 font-semibold"> Colleges</option>
              <option value="groups" className="text-pink-600 font-semibold"> Groups</option>
              <option value='individuals' className="text-green-600 font-semibold"> Students</option>
            </select>


            {formData.targetType === "colleges" && (
              <>
                <button
                  type="button"
                  onClick={() => setShowCollegeModal(true)}
                  className="px-4  py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Select Colleges
                </button>
                <ul className="mt-2 space-y-1 text-sm">
                  {formData.assignedColleges.map((c, i) => (
                    <li key={c.id} className="bg-blue-50 p-2 rounded flex justify-between">
                      {c.name}
                      <button
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            assignedColleges: prev.assignedColleges.filter((_, idx) => idx !== i),
                          }))
                        }
                        className="text-red-500 text-xs"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {formData.targetType === "groups" && (
              <>
                <button
                  type="button"
                  onClick={() => setShowGroupModal(true)}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  Select Groups
                </button>
                <ul className="mt-2 space-y-1 text-sm">
                  {formData.assignedGroups.map((g, i) => (
                    <li key={g.id} className="bg-pink-50 p-2 rounded flex justify-between">
                      {g.name}
                      <button
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            assignedGroups: prev.assignedGroups.filter((_, idx) => idx !== i),
                          }))
                        }
                        className="text-red-500 text-xs"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {formData.targetType === 'individuals' && (
              <>
                <button
                  type="button"
                  onClick={() => setShowStudentModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Select Students
                </button>
                <ul className="mt-2 space-y-1 text-sm">
                  {formData.assignedStudents.map((s, i) => (
                    <li key={s.id} className="bg-green-50 p-2 rounded flex justify-between">
                      {s.name}
                      <button
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            assignedStudents: prev.assignedStudents.filter((_, idx) => idx !== i),
                          }))
                        }
                        className="text-red-500 text-xs"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          {/* Assignment Settings */}
          {/* Assignment Settings */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-indigo-600 flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              Assignment Settings
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Allow Retake */}
              <label className="flex items-center gap-3 border border-gray-300 p-3 rounded-lg shadow-sm">
                <input
                  type="checkbox"
                  checked={formData.settings.allow_retake}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      settings: { ...prev.settings, allow_retake: e.target.checked },
                    }))
                  }
                  className="accent-indigo-600 w-5 h-5"
                />
                <span className="text-sm text-gray-800">Allow Retake</span>
              </label>
              {/* Proctoring Enabled */}
              <label className="flex items-center gap-3 border border-gray-300 p-3 rounded-lg shadow-sm">
                <input
                  type="checkbox"
                  checked={formData.settings.proctoring_enabled}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      settings: { ...prev.settings, proctoring_enabled: e.target.checked },
                    }))
                  }
                  className="accent-indigo-600 w-5 h-5"
                />
                <span className="text-sm text-gray-800">Proctoring Enabled</span>
              </label>



              {/* Randomize Questions */}
              <label className="flex items-center gap-3 border border-gray-300 p-3 rounded-lg shadow-sm">
                <input
                  type="checkbox"
                  checked={formData.settings.randomize_questions}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      settings: { ...prev.settings, randomize_questions: e.target.checked },
                    }))
                  }
                  className="accent-indigo-600 w-5 h-5"
                />
                <span className="text-sm text-gray-800">Randomize Questions</span>
              </label>

              {/* Show Results to Students */}
              <label className="flex items-center gap-3 border border-gray-300 p-3 rounded-lg shadow-sm">
                <input
                  type="checkbox"
                  checked={formData.settings.show_results_to_students}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      settings: { ...prev.settings, show_results_to_students: e.target.checked },
                    }))
                  }
                  className="accent-indigo-600 w-5 h-5"
                />
                <span className="text-sm text-gray-800">Show Results to Students</span>
              </label>

              {/* Results Release Time */}
              <div className="flex flex-col border border-gray-300 p-3 rounded-lg shadow-sm">
                <label className="text-sm text-gray-800 mb-1 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-gray-500" />
                  Results Release Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.settings.results_release_time}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      settings: { ...prev.settings, results_release_time: e.target.value },
                    }))
                  }
                  className="border border-gray-300 rounded-lg p-2 text-sm"
                />
              </div>

              {/* Max Attempts */}
              <div className="flex flex-col border border-gray-300 p-3 rounded-lg shadow-sm">
                <label className="text-sm text-gray-800 mb-1 flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  Max Attempts
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.settings.max_attempts}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      settings: { ...prev.settings, max_attempts: parseInt(e.target.value) },
                    }))
                  }
                  className="border border-gray-300 rounded-lg p-2 text-sm w-24"
                />
              </div>


            </div>
          </div>



          {/* Schedule */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex gap-2 text-purple-600">
              <CalendarDays className="w-5 h-5" /> Schedule
            </h2>

            <label className="block mb-1">Start Time</label>
            <input
              type="datetime-local"
              name="schedule.start_time"
              value={formData.schedule.start_time}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg mb-4"
              required
            />

            <label className="block mb-1">End Time</label>
            <input
              type="datetime-local"
              name="schedule.end_time"
              value={formData.schedule.end_time}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              ← Go Back
            </button>
            <div className="flex gap-4">

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Assignment"}
              </button>
            </div>
          </div>

          {message && (
            <p
              className={`mt-4 text-sm text-center ${message.includes("success") ? "text-green-600" : "text-red-600"}`}
            >
              {message}
            </p>
          )}
        </form>
      </div>

      {/* Modals */}
      {showCollegeModal && (
        <SelectCollegeModal
          onSelect={(list) => {
            const safeList = Array.isArray(list) ? list : [list];
            setFormData((prev) => ({
              ...prev,
              assignedColleges: [
                ...prev.assignedColleges,
                ...safeList.filter(
                  (item) => !prev.assignedColleges.some((c) => c.id === item.id)
                ),
              ],
            }));
          }}

          onClose={() => setShowCollegeModal(false)}
        />
      )}

      {showGroupModal && (
        <SelectGroupModal
          onSelect={(list) => {
            const safeList = Array.isArray(list) ? list : [list]; // ✅ Ensure it's always an array
            setFormData((prev) => ({
              ...prev,
              assignedGroups: [
                ...prev.assignedGroups,
                ...safeList.filter(
                  (item) => !prev.assignedGroups.some((g) => g.id === item.id)
                ),
              ],
            }));
          }}

          onClose={() => setShowGroupModal(false)}
        />
      )}

      {showStudentModal && (
        <SelectStudentModal
          onSelect={(list) => {
            const safeList = Array.isArray(list) ? list : [list]; // ensure it's an array
            setFormData((prev) => ({
              ...prev,
              assignedStudents: [
                ...prev.assignedStudents,
                ...safeList.filter(
                  (item) => !prev.assignedStudents.some((s) => s.id === item.id)
                ),
              ],
            }));
          }}
          onClose={() => setShowStudentModal(false)}
        />
      )}
    </div>
  );
};

export default CreateAssignment;
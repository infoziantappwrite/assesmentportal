import React, { useState } from "react";
import { Eye, PlusCircle, Search } from "lucide-react";
import MapTest from "./MapTest";
import ViewAssignmentModal from "./ViewAssignmentModal";
import Table from "../../Components/Table"; // ⬅️ Import reusable table

const testOptions = [
  { id: 1, title: "Full Stack Developer Assessment" },
  { id: 2, title: "Frontend Assessment" },
  { id: 3, title: "Database Skills Test" },
];

const colleges = ["ABC College", "XYZ University", "PQR Institute"];
const batches = ["Batch 1", "Batch 2", "Batch 3"];

const initialAssignments = [
  {
    id: 1,
    testTitle: "Full Stack Developer Assessment",
    college: "ABC College",
    batches: ["Batch 1", "Batch 3"],
    startDate: "2025-07-10T10:00",
    endDate: "2025-07-10T12:00",
  },
  {
    id: 2,
    testTitle: "Frontend Assessment",
    college: "XYZ University",
    batches: ["Batch 2"],
    startDate: "2025-07-12T14:00",
    endDate: "2025-07-12T16:00",
  },
];

const Assignments = () => {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [showMapModal, setShowMapModal] = useState(false);
  const [viewAssignment, setViewAssignment] = useState(null);
  const [selectedTestId, setSelectedTestId] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [mappedStartDate, setMappedStartDate] = useState("");
  const [mappedEndDate, setMappedEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCollege, setFilterCollege] = useState("all");

  const toggleBatch = (batch) => {
    setSelectedBatches((prev) =>
      prev.includes(batch) ? prev.filter((b) => b !== batch) : [...prev, batch]
    );
  };

  const handleMapSubmit = () => {
    if (!selectedTestId || !selectedCollege || !mappedStartDate || !mappedEndDate || selectedBatches.length === 0) {
      alert("Please fill in all fields.");
      return;
    }
    const selectedTest = testOptions.find((t) => t.id === parseInt(selectedTestId));
    const newAssignment = {
      id: assignments.length + 1,
      testTitle: selectedTest.title,
      college: selectedCollege,
      batches: selectedBatches,
      startDate: mappedStartDate,
      endDate: mappedEndDate,
    };
    setAssignments((prev) => [...prev, newAssignment]);
    handleCloseMap();
  };

  const handleCloseMap = () => {
    setShowMapModal(false);
    setSelectedTestId("");
    setSelectedCollege("");
    setSelectedBatches([]);
    setMappedStartDate("");
    setMappedEndDate("");
  };

  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch =
      a.testTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.college.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCollege = filterCollege === "all" || a.college === filterCollege;
    return matchesSearch && matchesCollege;
  });

  const tableColumns = [
    { label: "id", accessor: "id", render: (row, idx) => idx + 1 },
    { label: "Test", accessor: "testTitle" },
    { label: "College", accessor: "college" },
    {
      label: "Batches",
      accessor: "batches",
      render: (row) => row.batches.join(", ")
    },
    {
      label: "Schedule",
      accessor: "schedule",
      render: (row) => `${new Date(row.startDate).toLocaleString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true
      })} to ${new Date(row.endDate).toLocaleString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true
      })}`
    },
    {
      label: "Actions",
      accessor: "actions",
      render: (row) => (
        <button
          onClick={() => setViewAssignment(row)}
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
        >
          <Eye className="w-4 h-4" /> View
        </button>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-purple-50 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              Assignments
            </h1>
            <p className="text-gray-500 mt-1">Manage test assignments to students or groups.</p>
          </div>
          <button
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold px-5 py-3 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
            onClick={() => setShowMapModal(true)}
          >
            <PlusCircle className="w-5 h-5" />
            New Assignment
          </button>
        </header>

        {/* 🔍 Filter and Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 w-full sm:max-w-md">
            <Search className="text-gray-400 w-5 h-5 absolute ml-3" />
            <input
              type="text"
              placeholder="Search by test or college..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <select
              value={filterCollege}
              onChange={(e) => setFilterCollege(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Colleges</option>
              {colleges.map((c, idx) => (
                <option key={idx} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ✅ Reusable Table */}
        <Table columns={tableColumns} data={filteredAssignments} />
      </div>

      {/* Map Modal */}
      {showMapModal && (
        <MapTest
          mapTest={{ title: "New Assignment" }}
          handleCloseMap={handleCloseMap}
          colleges={colleges}
          batches={batches}
          selectedCollege={selectedCollege}
          selectedBatches={selectedBatches}
          toggleBatch={toggleBatch}
          mappedStartDate={mappedStartDate}
          mappedEndDate={mappedEndDate}
          setSelectedCollege={setSelectedCollege}
          setMappedStartDate={setMappedStartDate}
          setMappedEndDate={setMappedEndDate}
          handleMapSubmit={handleMapSubmit}
        >
          {/* Test Dropdown */}
          <div className="px-5 pt-2">
            <label className="block text-sm font-semibold mb-2 text-gray-700">Select Test</label>
            <select
              value={selectedTestId}
              onChange={(e) => setSelectedTestId(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500 px-3 py-2"
            >
              <option value="">-- Select a Test --</option>
              {testOptions.map((t) => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </div>
        </MapTest>
      )}

      {/* View Modal */}
      {viewAssignment && (
        <ViewAssignmentModal
          assignment={viewAssignment}
          onClose={() => setViewAssignment(null)}
        />
      )}
    </div>
  );
};

export default Assignments;

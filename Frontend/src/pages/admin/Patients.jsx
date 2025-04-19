import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaUser,
  FaSearch,
  FaFilter,
  FaTrash,
  FaEdit,
  FaEye,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaVenusMars,
} from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import EntityDetailsModal from "../../Components/Modals/Common/EntityDetailsModal";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [showDetails, setShowDetails] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [patients, searchTerm, genderFilter, ageFilter]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER}admin/getAllUsers`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        setPatients(data.users || []);
        setFilteredPatients(data.users || []);
      } else {
        toast.error(data.message || "Failed to fetch patients");
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Error loading patients");

      // For development/demo - use dummy data
      const dummyPatients = [
        {
          _id: "1",
          name: "Alice Johnson",
          email: "alice.johnson@example.com",
          phone: "9876543210",
          age: "32",
          gender: "female",
          status: "active",
        },
        {
          _id: "2",
          name: "Michael Brown",
          email: "michael.brown@example.com",
          phone: "9876543211",
          age: "45",
          gender: "male",
          status: "active",
        },
        {
          _id: "3",
          name: "Emily Davis",
          email: "emily.davis@example.com",
          phone: "9876543212",
          age: "28",
          gender: "female",
          status: "inactive",
        },
      ];
      setPatients(dummyPatients);
      setFilteredPatients(dummyPatients);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let results = [...patients];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (patient) =>
          patient.name?.toLowerCase().includes(term) ||
          patient.email?.toLowerCase().includes(term) ||
          patient.phone?.includes(term)
      );
    }

    // Apply gender filter
    if (genderFilter !== "all") {
      results = results.filter((patient) => patient.gender === genderFilter);
    }

    // Apply age filter
    if (ageFilter !== "all") {
      if (ageFilter === "0-18") {
        results = results.filter((patient) => parseInt(patient.age) <= 18);
      } else if (ageFilter === "19-40") {
        results = results.filter(
          (patient) => parseInt(patient.age) > 18 && parseInt(patient.age) <= 40
        );
      } else if (ageFilter === "41-65") {
        results = results.filter(
          (patient) => parseInt(patient.age) > 40 && parseInt(patient.age) <= 65
        );
      } else if (ageFilter === "65+") {
        results = results.filter((patient) => parseInt(patient.age) > 65);
      }
    }

    setFilteredPatients(results);
  };

  const handleDelete = (patientId) => {
    confirmAlert({
      title: "Delete Patient",
      message:
        "Are you sure you want to delete this patient? All associated records will also be removed.",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const { data } = await axios.post(
                `${import.meta.env.VITE_SERVER}admin/deleteUser`,
                {
                  userToBeDeletedId: patientId,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );

              if (data.success) {
                toast.success("Patient deleted successfully");
                fetchPatients();
              } else {
                toast.error(data.message || "Failed to delete patient");
              }
            } catch (error) {
              console.error("Error deleting patient:", error);
              toast.error("Error deleting patient");
            }
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const renderTableView = () => (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Patient
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact Info
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Age
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Gender
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredPatients.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                No patients found
              </td>
            </tr>
          ) : (
            filteredPatients.map((patient) => (
              <tr key={patient._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                      <FaUser className="text-green-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {patient.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{patient.email}</div>
                  <div className="text-sm text-gray-500">{patient.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {patient.age} years
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 capitalize">
                    {patient.gender}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      patient.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {patient.status || "active"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowDetails(patient._id)}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleDelete(patient._id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPatients.length === 0 ? (
        <div className="col-span-full text-center py-8 text-gray-500">
          No patients found
        </div>
      ) : (
        filteredPatients.map((patient) => (
          <div
            key={patient._id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-5 border-b">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <FaUser className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {patient.name}
                    </h3>
                    <div className="flex items-center mt-1">
                      <FaVenusMars className="text-gray-500 mr-1" />
                      <span className="text-sm text-gray-600 capitalize">
                        {patient.gender}
                      </span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-sm text-gray-600">
                        {patient.age} years
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    patient.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {patient.status || "active"}
                </span>
              </div>
            </div>

            <div className="px-5 py-3 border-b space-y-2">
              <div className="flex items-center">
                <FaEnvelope className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">{patient.email}</span>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">{patient.phone}</span>
              </div>
            </div>

            <div className="p-3 flex justify-between items-center bg-gray-50">
              <button
                onClick={() => setShowDetails(patient._id)}
                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium flex items-center"
              >
                <FaEye className="mr-1" /> Details
              </button>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleDelete(patient._id)}
                  className="text-red-600 hover:text-red-900 p-1"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-[92vh] p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Patient Management
        </h1>
        <p className="text-gray-600">
          View and manage all patients in the system
        </p>
      </header>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center">
              <label
                htmlFor="gender-filter"
                className="mr-2 text-sm font-medium text-gray-700"
              >
                <FaFilter className="inline mr-1" /> Gender:
              </label>
              <select
                id="gender-filter"
                className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="flex items-center">
              <label
                htmlFor="age-filter"
                className="mr-2 text-sm font-medium text-gray-700"
              >
                <FaCalendarAlt className="inline mr-1" /> Age:
              </label>
              <select
                id="age-filter"
                className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value)}
              >
                <option value="all">All Ages</option>
                <option value="0-18">0-18 years</option>
                <option value="19-40">19-40 years</option>
                <option value="41-65">41-65 years</option>
                <option value="65+">65+ years</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 ml-2">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded ${
                  viewMode === "table"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
                title="Table View"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("card")}
                className={`p-2 rounded ${
                  viewMode === "card"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
                title="Card View"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {filteredPatients.length} out of {patients.length} patients
          </div>
          <button
            onClick={fetchPatients}
            className="bg-blue-50 text-blue-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Patient List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : viewMode === "table" ? (
        renderTableView()
      ) : (
        renderCardView()
      )}

      {/* Patient Details Modal */}
      <EntityDetailsModal
        isOpen={!!showDetails}
        onClose={() => setShowDetails(null)}
        entity={patients.find((p) => p._id === showDetails)}
        entityType="patient"
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Patients;

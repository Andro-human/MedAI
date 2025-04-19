import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaUserMd,
  FaSearch,
  FaFilter,
  FaTrash,
  FaEdit,
  FaEye,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaGraduationCap,
  FaBriefcase,
} from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import EntityDetailsModal from "../../Components/Modals/Common/EntityDetailsModal";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [showDetails, setShowDetails] = useState(null);
  const [specializations, setSpecializations] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [doctors, searchTerm, specializationFilter, experienceFilter]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER}admin/getAllDoctors`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        setDoctors(data.doctors || []);
        setFilteredDoctors(data.doctors || []);

        // Extract unique specializations for filter
        const uniqueSpecializations = [
          ...new Set(data.doctors.map((doc) => doc.specialization)),
        ].filter(Boolean);
        setSpecializations(uniqueSpecializations);
      } else {
        toast.error(data.message || "Failed to fetch doctors");
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Error loading doctors");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let results = [...doctors];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (doc) =>
          doc.name?.toLowerCase().includes(term) ||
          doc.email?.toLowerCase().includes(term) ||
          doc.specialization?.toLowerCase().includes(term)
      );
    }

    // Apply specialization filter
    if (specializationFilter !== "all") {
      results = results.filter(
        (doc) => doc.specialization === specializationFilter
      );
    }

    // Apply experience filter
    if (experienceFilter !== "all") {
      if (experienceFilter === "0-5") {
        results = results.filter((doc) => parseInt(doc.experience) <= 5);
      } else if (experienceFilter === "6-10") {
        results = results.filter(
          (doc) =>
            parseInt(doc.experience) > 5 && parseInt(doc.experience) <= 10
        );
      } else if (experienceFilter === "11+") {
        results = results.filter((doc) => parseInt(doc.experience) > 10);
      }
    }

    setFilteredDoctors(results);
  };

  const handleDelete = (doctorId) => {
    confirmAlert({
      title: "Delete Doctor",
      message:
        "Are you sure you want to delete this doctor? All appointments with this doctor will also be affected.",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const { data } = await axios.post(
                `${import.meta.env.VITE_SERVER}admin/deleteUser`,
                {
                  userToBeDeletedId: doctorId,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );

              if (data.success) {
                toast.success("Doctor deleted successfully");
                fetchDoctors();
              } else {
                toast.error(data.message || "Failed to delete doctor");
              }
            } catch (error) {
              console.error("Error deleting doctor:", error);
              toast.error("Error deleting doctor");
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
              Doctor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact Info
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Specialization
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Experience
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredDoctors.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                No doctors found
              </td>
            </tr>
          ) : (
            filteredDoctors.map((doctor) => (
              <tr key={doctor._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaUserMd className="text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        Dr. {doctor.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {doctor.education}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{doctor.email}</div>
                  <div className="text-sm text-gray-500">{doctor.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {doctor.specialization}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {doctor.experience} years
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowDetails(doctor._id)}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleDelete(doctor._id)}
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
      {filteredDoctors.length === 0 ? (
        <div className="col-span-full text-center py-8 text-gray-500">
          No doctors found
        </div>
      ) : (
        filteredDoctors.map((doctor) => (
          <div
            key={doctor._id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-5 border-b">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <FaUserMd className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Dr. {doctor.name}
                    </h3>
                    <p className="text-sm text-gray-600">{doctor.education}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    doctor.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {doctor.status || "active"}
                </span>
              </div>
            </div>

            <div className="px-5 py-3 border-b">
              <div className="text-sm font-medium text-gray-700 mb-1">
                Specialization:
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {doctor.specialization}
                </span>
                <span className="ml-3 text-sm text-gray-600">
                  {doctor.experience} years of experience
                </span>
              </div>
            </div>

            <div className="px-5 py-3 border-b space-y-2">
              <div className="flex items-center">
                <FaEnvelope className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">{doctor.email}</span>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">{doctor.phone}</span>
              </div>
            </div>

            <div className="p-3 flex justify-between items-center bg-gray-50">
              <button
                onClick={() => setShowDetails(doctor._id)}
                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium flex items-center"
              >
                <FaEye className="mr-1" /> Details
              </button>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleDelete(doctor._id)}
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
          Doctor Management
        </h1>
        <p className="text-gray-600">
          View and manage all doctors in the system
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
              placeholder="Search by name, email, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center">
              <label
                htmlFor="specialization-filter"
                className="mr-2 text-sm font-medium text-gray-700"
              >
                <FaFilter className="inline mr-1" /> Specialization:
              </label>
              <select
                id="specialization-filter"
                className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
              >
                <option value="all">All</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <label
                htmlFor="experience-filter"
                className="mr-2 text-sm font-medium text-gray-700"
              >
                <FaBriefcase className="inline mr-1" /> Experience:
              </label>
              <select
                id="experience-filter"
                className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="0-5">0-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="11+">11+ years</option>
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
            Showing {filteredDoctors.length} out of {doctors.length} doctors
          </div>
          <button
            onClick={fetchDoctors}
            className="bg-blue-50 text-blue-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Doctor List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : viewMode === "table" ? (
        renderTableView()
      ) : (
        renderCardView()
      )}

      {/* Doctor Details Modal */}
      <EntityDetailsModal
        isOpen={!!showDetails}
        onClose={() => setShowDetails(null)}
        entity={doctors.find((d) => d._id === showDetails)}
        entityType="doctor"
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Doctors;

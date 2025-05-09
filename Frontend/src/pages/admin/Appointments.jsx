import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaCalendarAlt,
  FaSearch,
  FaFilter,
  FaUserMd,
  FaUser,
  FaClock,
  FaTrash,
  FaEdit,
  FaEye,
} from "react-icons/fa";
import RescheduleModal from "../../Components/Modals/Appointments/RescheduleModal";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import AppointmentDetailsModal from "../../Components/Modals/Appointments/AppointmentDetailsModal";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [showDetails, setShowDetails] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [appointments, searchTerm, statusFilter, dateFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER}api/admin/getAllAppointments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        setAppointments(data.appointments || []);
        setFilteredAppointments(data.appointments || []);
      } else {
        toast.error(data.message || "Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Error loading appointments");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let results = [...appointments];
    results = results.map((app) => {
      const today = new Date();
      return {
        ...app,
        status: new Date(app.date) < today ? "completed" : "scheduled",
      };
    });

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (app) =>
          app.doctor?.name?.toLowerCase().includes(term) ||
          app.patient?.name?.toLowerCase().includes(term) ||
          app.doctor?.specialization?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      results = results.filter((app) => app.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      if (dateFilter === "today") {
        results = results.filter(
          (app) => new Date(app.date).toISOString().split("T")[0] === todayStr
        );
      } else if (dateFilter === "upcoming") {
        results = results.filter((app) => new Date(app.date) > today);
      } else if (dateFilter === "past") {
        results = results.filter((app) => new Date(app.date) < today);
      }
    }

    setFilteredAppointments(results);
  };

  const handleDelete = (appointmentId) => {
    confirmAlert({
      title: "Cancel Appointment",
      message: "Are you sure you want to delete this appointment?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const { data } = await axios.post(
                `${
                  import.meta.env.VITE_SERVER
                }api/appointment/cancel-appointment/`,
                {
                  appointmentId,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );

              if (data.success) {
                toast.success("Appointment deleted successfully");
                fetchAppointments();
              } else {
                toast.error(data.message || "Failed to delete appointment");
              }
            } catch (error) {
              console.error("Error deleting appointment:", error);
              toast.error("Error deleting appointment");
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

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleSuccess = () => {
    fetchAppointments();
    setIsRescheduleModalOpen(false);
  };

  const formatDateTime = (dateStr, timeStr) => {
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Format time to 12-hour format if not already
    let formattedTime = timeStr;
    if (!timeStr.includes("AM") && !timeStr.includes("PM")) {
      const timeParts = timeStr.split(":");
      let hours = parseInt(timeParts[0], 10);
      const minutes = timeParts[1];
      const period = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      formattedTime = `${hours}:${minutes} ${period}`;
    }

    return `${formattedDate} at ${formattedTime}`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "scheduled":
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            Scheduled
          </span>
        );
      case "completed":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Completed
          </span>
        );
    }
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
              Patient
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date & Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredAppointments.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                No appointments found
              </td>
            </tr>
          ) : (
            filteredAppointments.map((appointment) => (
              <tr key={appointment._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaUserMd className="text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        Dr. {appointment.doctor?.name || "Unknown Doctor"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.doctor?.specialization || "Specialist"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                      <FaUser className="text-green-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.patient?.name || "Unknown Patient"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.patient?.email || ""}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDateTime(appointment.date, appointment.timeslot)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(appointment.status || "scheduled")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowDetails(appointment._id)}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleReschedule(appointment)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="Reschedule"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(appointment._id)}
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
      {filteredAppointments.length === 0 ? (
        <div className="col-span-full text-center py-8 text-gray-500">
          No appointments found
        </div>
      ) : (
        filteredAppointments.map((appointment) => (
          <div
            key={appointment._id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-5 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">
                    Dr. {appointment.doctor?.name || "Unknown Doctor"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {appointment.doctor?.specialization || "Specialist"}
                  </p>
                </div>
                {getStatusBadge(appointment.status || "scheduled")}
              </div>
            </div>

            <div className="px-5 py-3 border-b">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {appointment.patient?.name || "Unknown Patient"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {appointment.patient?.email || ""}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-b">
              <div className="flex items-center">
                <FaCalendarAlt className="text-blue-500 mr-2" />
                <span className="text-sm text-gray-600">
                  {formatDateTime(appointment.date, appointment.timeslot)}
                </span>
              </div>
            </div>

            <div className="p-3 flex justify-between items-center bg-gray-50">
              <button
                onClick={() => setShowDetails(appointment._id)}
                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium flex items-center"
              >
                <FaEye className="mr-1" /> Details
              </button>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleReschedule(appointment)}
                  className="text-blue-600 hover:text-blue-900 p-1"
                  title="Reschedule"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(appointment._id)}
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
          Appointment Management
        </h1>
        <p className="text-gray-600">
          View and manage all appointments in the system
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
              placeholder="Search by doctor, patient or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center">
              <label
                htmlFor="status-filter"
                className="mr-2 text-sm font-medium text-gray-700"
              >
                <FaFilter className="inline mr-1" /> Status:
              </label>
              <select
                id="status-filter"
                className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center">
              <label
                htmlFor="date-filter"
                className="mr-2 text-sm font-medium text-gray-700"
              >
                <FaCalendarAlt className="inline mr-1" /> Date:
              </label>
              <select
                id="date-filter"
                className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
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
            Showing {filteredAppointments.length} out of {appointments.length}{" "}
            appointments
          </div>
          <button
            onClick={fetchAppointments}
            className="bg-blue-50 text-blue-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Appointment List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : viewMode === "table" ? (
        renderTableView()
      ) : (
        renderCardView()
      )}

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        isOpen={!!showDetails}
        onClose={() => setShowDetails(null)}
        appointment={appointments.find((a) => a._id === showDetails)}
        onReschedule={handleReschedule}
        onDelete={handleDelete}
        formatDateTime={formatDateTime}
        getStatusBadge={getStatusBadge}
      />

      {/* Reschedule Modal */}
      {isRescheduleModalOpen && (
        <RescheduleModal
          isOpen={isRescheduleModalOpen}
          onClose={() => setIsRescheduleModalOpen(false)}
          appointment={selectedAppointment}
          onReschedule={handleRescheduleSuccess}
        />
      )}
    </div>
  );
}

export default Appointments;

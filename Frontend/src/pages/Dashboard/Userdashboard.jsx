import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  FaCalendarCheck,
  FaHistory,
  FaUserMd,
  FaCalendarAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import RescheduleModal from "../../Components/Dashboard/Appointments/RescheduleModal";

function Userdashboard() {
  const { user } = useSelector((state) => state.auth);
  const [appointments, setAppointments] = useState([]);
  // const [doctorMap, setDoctorMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const navigate = useNavigate();
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const formatTimeTo12Hour = (time) => {
    if (!time) return "";
    
    if (time.includes('AM') || time.includes('PM')) {
      return time;
    }
    
    const timeParts = time.split(':');
    let hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1];
    
    // Determine AM/PM and convert hours
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12 for 12 AM
    
    // Format with leading zero for minutes
    return `${hours}:${minutes} ${period}`;
  };

  const fetchDoctorAppointments = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_SERVER}appointment/get-doctor-appointment`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER}appointment/get-patient-appointment`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id && user?.role === "user") {
      fetchAppointments();
    }
    if (user?._id && user?.role === "doctor") {
      fetchDoctorAppointments();
    }
  }, [user]);

  // Process appointment data to include doctor information
  const users = appointments.map((appointment) => {
    const userDetails = user?.role === "user" ? appointment.doctor : appointment.patient || {};
    return {
      ...appointment,
        ...(user.role === "user" && {
          doctorName: userDetails.name || "Unknown Doctor",
          specialization: userDetails.specialization || "General",
        }),
        ...(user.role === "doctor" && {
          patientName: userDetails.name || "Unknown Patient",
        }),
      date: appointment.date,
      timeslot: formatTimeTo12Hour(appointment.timeslot),
      age: userDetails.age,
      gender: userDetails.gender,
    };
  });

  const upcomingAppointments = users.filter(
    (app) => new Date(app.date) >= new Date()
  );

  const pastAppointments = users.filter(
    (app) => new Date(app.date) < new Date()
  );

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };
  
  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setIsRescheduleModalOpen(true);
  };

  const handleDelete = (appointmentId) => {
    confirmAlert({
      title: 'Cancel Appointment',
      message: 'Are you sure you want to cancel this appointment?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const { data } = await axios.post(`${import.meta.env.VITE_SERVER}appointment/cancel-appointment/`, 
                {
                  appointmentId,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                });
              if (data.success) {
                toast.success(data.message);
                window.location.reload();
              } else {
                toast.error(data.message);
              }
            } catch (error) {
              console.error(error);
              toast.error("Failed to cancel appointment");
            }
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  const handleRescheduleSuccess = () => {
    window.location.reload();
  };

  return (
    <div className="bg-gray-50 min-h-[92vh] p-4 md:p-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Welcome back, {user?.name || "Patient"}!
        </h1>
        <p className="text-gray-600 mt-2">
          {user?.role === "user" ? "Here's a summary of your medical appointments and health journey" : "Here's a summary of your appointments"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <FaCalendarCheck className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Upcoming Appointments</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {upcomingAppointments.length}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <FaHistory className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Past Appointments</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {pastAppointments.length}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <FaUserMd className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">{user?.role === "user" ? "Different users" : "Different Patients"}</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {/* Get unique count of doctor IDs from appointments */}
                {Array.from(new Set(appointments.map(app => user?.role === "user" ? app.doctor?._id : app.patient?._id))).filter(Boolean).length}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-lg mr-4">
              <FaCalendarAlt className="text-orange-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Appointments</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {users.length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="flex border-b">
          <button
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === "upcoming"
                ? "text-blue-600 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Appointments
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === "past"
                ? "text-blue-600 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("past")}
          >
            Past Appointments
          </button>
        </div>

        {/* Appointment List */}
        <div className="p-4 md:p-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-12 h-12 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {activeTab === "upcoming" && (
                <>
                  {upcomingAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No upcoming appointments</p>
                      {user?.role === "user" && (
                        <button onClick={() => navigate("/book-appointment")} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                          Book New Appointment
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {upcomingAppointments.map((appointment) => (
                        <div
                          key={appointment._id}
                          className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 flex flex-col md:flex-row md:items-center"
                        >
                          <div className="flex-1">
                            <div className="flex gap-4">
                            <h3 className="font-semibold text-lg text-gray-800">
                              {user?.role === "user" ? appointment.doctorName : appointment.patientName}
                            </h3>
                            <p className="text-sm text-gray-700 mt-1">
                              {appointment.age}
                            </p>
                            </div>
                            <div className="flex gap-4">
                            <p className="text-sm text-gray-500">
                              {appointment.gender}
                            </p>
                            {user?.role === "user" && <p className="text-sm text-gray-500">
                              {appointment.specialization}
                            </p>}
                            </div>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center gap-y-2 sm:gap-x-4 mt-2 text-gray-600">
                              <div className="flex items-center">
                                <FaCalendarAlt className="text-blue-500 mr-2" />
                                <span>{formatDate(appointment.date)}</span>
                              </div>
                              <div className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-blue-500 mr-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span>{appointment.timeslot}</span>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                                    "scheduled"
                                )}`}
                              >
                                Scheduled
                              </span>
                            </div>
                          </div>
                          <div className="mt-4 md:mt-0 flex gap-2">
                            <button 
                              onClick={() => handleReschedule(appointment)} 
                              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm transition-colors"
                            >
                              Reschedule
                            </button>
                            <button 
                              onClick={() => handleDelete(appointment._id)} 
                              className="border border-red-300 hover:bg-red-50 text-red-600 py-2 px-4 rounded-lg text-sm transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === "past" && (
                <>
                  {pastAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No past appointments</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {pastAppointments.map((appointment) => (
                        <div
                          key={appointment._id}
                          className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex flex-col md:flex-row md:items-center">
                          <div className="flex-1">
                            <div className="flex gap-4">
                            <h3 className="font-semibold text-lg text-gray-800">
                              {user?.role === "user" ? appointment.doctorName : appointment.patientName}
                            </h3>
                            <p className="text-sm text-gray-700 mt-1">
                              {appointment.age}
                            </p>
                            </div>
                            <div className="flex gap-4">
                            <p className="text-sm text-gray-500">
                              {appointment.gender}
                            </p>
                           {user?.role === "user" && <p className="text-sm text-gray-500">
                              {appointment.specialization}
                            </p>}
                            </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-y-2 sm:gap-x-4 mt-2 text-gray-600">
                                <div className="flex items-center">
                                  <FaCalendarAlt className="text-blue-500 mr-2" />
                                  <span>{formatDate(appointment.date)}</span>
                                </div>
                                <div className="flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-blue-500 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <span>{appointment.timeslot}</span>
                                </div>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                                    "completed"
                                  )}`}
                                >
                                  Completed
                                </span>
                              </div>
                            </div>
                            <div className="mt-4 md:mt-0">
                              <button onClick={() => navigate(`/chat/${user?.role === "user" ? appointment.doctor._id : appointment.patient._id}`)} className="bg-white border border-blue-500 text-blue-600 py-2 px-4 rounded-lg text-sm transition-colors hover:bg-blue-50">
                                Chat with {user?.role === "user" ? "Doctor" : "Patient"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

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

export default Userdashboard;

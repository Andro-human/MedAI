import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaGraduationCap,
  FaBriefcase,
  FaVenusMars,
} from "react-icons/fa";

function BookAppointment() {
  const { user } = useSelector((state) => state.auth);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [specializations] = useState([
    "General Medicine",
    "Cardiology",
    "Dermatology",
    "Orthopedics",
    "Neurology",
    "Pediatrics",
    "Gynecology",
    "Ophthalmology",
    "ENT specialist",
    "Psychiatry",
    "Dentistry",
  ]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Available time slots for the selected date
  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
  ];

  // Fetch doctors by specialization
  const fetchDoctors = async (specialization) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER}appointment/get-Doctor`,
        { specialization },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message || "Failed to fetch doctors");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching doctors");
    } finally {
      setLoading(false);
    }
  };

  // Handle specialization selection
  const handleSpecializationSelect = (specialization) => {
    setSelectedSpecialization(specialization);
    fetchDoctors(specialization);
    setStep(2);
  };

  // Handle doctor selection
  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(3);
  };

  // Handle date selection
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Handle time selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // Calculate minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Calculate maximum date (3 months from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split("T")[0];
  };

  // Book appointment
  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast.error("Please select all appointment details");
      return;
    }

    try {
      setLoading(true);

      // Combine date and time for appointment
      const timeString = selectedTime.replace(
        /(\d+):(\d+) (AM|PM)/,
        (match, hour, minute, period) => {
          let hours = parseInt(hour);
          if (period === "PM" && hours < 12) hours += 12;
          if (period === "AM" && hours === 12) hours = 0;
          return `${hours.toString().padStart(2, "0")}:${minute}:00`;
        }
      );

      const appointmentDateTime = new Date(`${selectedDate}T${timeString}`);

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER}appointment/create-appointment`,
        {
          doctor: selectedDoctor._id,
          date: appointmentDateTime,
          patient: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message || "Appointment booked successfully");
        setBookingSuccess(true);
      } else {
        toast.error(data.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error booking appointment");
    } finally {
      setLoading(false);
    }
  };

  // Reset the form
  const handleReset = () => {
    setSelectedSpecialization("");
    setSelectedDoctor(null);
    setSelectedDate("");
    setSelectedTime("");
    setBookingSuccess(false);
    setStep(1);
  };

  // Render the appointment booking steps
  const renderSteps = () => {
    switch (step) {
      case 1:
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Select a Specialization
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {specializations.map((specialization) => (
                <div
                  key={specialization}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
                  onClick={() => handleSpecializationSelect(specialization)}
                >
                  <h3 className="font-medium text-gray-800">
                    {specialization}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Specialists in {specialization.toLowerCase()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-6">
              <button
                onClick={() => setStep(1)}
                className="text-blue-600 hover:text-blue-800 font-medium mr-4"
              >
                ← Back to Specializations
              </button>
              <h2 className="text-xl font-semibold text-gray-800">
                Choose a Doctor - {selectedSpecialization}
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-12 h-12 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : doctors.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  No doctors available for this specialization
                </p>
                <button
                  onClick={() => setStep(1)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Choose Another Specialization
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {doctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleDoctorSelect(doctor)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center md:mr-6 mb-4 md:mb-0">
                        <FaUserMd className="text-blue-600 text-2xl" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Dr. {doctor.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {selectedSpecialization}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                          <div className="flex items-center text-gray-600 text-sm">
                            <FaGraduationCap className="text-blue-500 mr-2" />
                            <span>{doctor.education || "MBBS"}</span>
                          </div>
                          <div className="flex items-center text-gray-600 text-sm">
                            <FaBriefcase className="text-blue-500 mr-2" />
                            <span>{doctor.experience || 0} years exp.</span>
                          </div>
                          <div className="flex items-center text-gray-600 text-sm">
                            <FaVenusMars className="text-blue-500 mr-2" />
                            <span>{doctor.gender || "Not specified"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <button className="bg-white border border-blue-500 text-blue-600 py-2 px-4 rounded-lg text-sm hover:bg-blue-50 transition-colors">
                          Select
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-6">
              <button
                onClick={() => setStep(2)}
                className="text-blue-600 hover:text-blue-800 font-medium mr-4"
              >
                ← Back to Doctors
              </button>
              <h2 className="text-xl font-semibold text-gray-800">
                Choose Date & Time
              </h2>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <FaUserMd className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Dr. {selectedDoctor?.name}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedSpecialization}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-blue-500 mr-2" />
                    Select Date
                  </div>
                </label>
                <input
                  type="date"
                  className="w-full bg-white border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={getMinDate()}
                  max={getMaxDate()}
                  value={selectedDate}
                  onChange={handleDateChange}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  <div className="flex items-center">
                    <FaClock className="text-blue-500 mr-2" />
                    Select Time Slot
                  </div>
                </label>
                {selectedDate ? (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {timeSlots.map((time) => (
                      <div
                        key={time}
                        className={`text-center py-2 px-1 rounded-lg text-sm cursor-pointer border ${
                          selectedTime === time
                            ? "bg-blue-500 text-white border-blue-500"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                        onClick={() => handleTimeSelect(time)}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 border border-gray-200 rounded-lg">
                    <p className="text-gray-500">Please select a date first</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleBookAppointment}
                disabled={!selectedDate || !selectedTime || loading}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  "Book Appointment"
                )}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-[80vh] p-4 md:p-6">
      {bookingSuccess ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Appointment Booked Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Your appointment with Dr. {selectedDoctor?.name} is scheduled for{" "}
            {selectedDate} at {selectedTime}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleReset}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Book Another Appointment
            </button>
            <button
              onClick={() => (window.location.href = "/userdashboard")}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Go to My Appointments
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Book an Appointment
            </h1>
            <p className="text-gray-600">
              Follow the steps below to schedule your appointment
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-sm font-medium ${
                  step >= 1 ? "text-blue-600" : "text-gray-500"
                }`}
              >
                Specialization
              </span>
              <span
                className={`text-sm font-medium ${
                  step >= 2 ? "text-blue-600" : "text-gray-500"
                }`}
              >
                Doctor
              </span>
              <span
                className={`text-sm font-medium ${
                  step >= 3 ? "text-blue-600" : "text-gray-500"
                }`}
              >
                Schedule
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          {renderSteps()}
        </>
      )}
    </div>
  );
}

export default BookAppointment;

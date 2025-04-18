import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCalendarAlt, FaClock, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
const RescheduleModal = ({ isOpen, onClose, appointment, onReschedule }) => {
  const user = useSelector((state) => state.user);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [fetchingTimeSlots, setFetchingTimeSlots] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset the form when modal opens
    if (isOpen) {
      setSelectedDate("");
      setSelectedTime("");
      setAvailableTimeSlots([]);
    }
  }, [isOpen]);

  // Handle date selection
  const handleDateChange = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedTime("");
    
    if (date) {
      await fetchAvailableTimeSlots(date);
    }
  };

  // Handle time selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // Fetch available time slots
  const fetchAvailableTimeSlots = async (date) => {
    const doctorId = user?.role === "user" ? appointment?.doctor?._id : appointment?.doctor;
    try {
      setFetchingTimeSlots(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER}appointment/get-available-timeslots`,
        { 
          doctorId,
          date 
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      if (data.success) {
        setAvailableTimeSlots(data.availableTimeslots || []);
      } else {
        toast.error(data.message || "Failed to fetch available time slots");
        setAvailableTimeSlots([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching available time slots");
      setAvailableTimeSlots([]);
    } finally {
      setFetchingTimeSlots(false);
    }
  };

  // Format time to 12-hour format
  const formatTimeTo12Hour = (time) => {
    if (!time) return "";
    
    if (time.includes('AM') || time.includes('PM')) {
      return time;
    }
    
    const timeParts = time.split(':');
    let hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1];
    
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    return `${hours}:${minutes} ${period}`;
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

  // Submit the reschedule
  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select both date and time");
      return;
    }

    try {
      setLoading(true);
      
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER}appointment/reschedule-appointment`,
        {
          appointmentId: appointment._id,
          date: selectedDate,
          time: selectedTime,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        toast.success("Appointment rescheduled successfully");
        onReschedule();
        onClose();
      } else {
        toast.error(data.message || "Failed to reschedule appointment");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error rescheduling appointment");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4 p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Reschedule Appointment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-2">
            <h3 className="font-medium">{user?.role === "user" ? "Dr. " + appointment?.doctorName : "Patient. " + appointment?.patientName}</h3>
          </div>
          <p className="text-sm text-gray-600">
            Current appointment: {new Date(appointment?.date).toLocaleDateString()} at {appointment?.time}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              <div className="flex items-center">
                <FaCalendarAlt className="text-blue-500 mr-2" />
                Select New Date
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
                Select New Time Slot
              </div>
            </label>
            {selectedDate ? (
              fetchingTimeSlots ? (
                <div className="flex justify-center items-center h-32">
                  <div className="w-8 h-8 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              ) : availableTimeSlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {availableTimeSlots.map((time) => (
                    <div
                      key={time}
                      className={`text-center py-2 px-1 rounded-lg text-sm cursor-pointer border ${
                        selectedTime === time
                          ? "bg-blue-500 text-white border-blue-500"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                      onClick={() => handleTimeSelect(time)}
                    >
                      {formatTimeTo12Hour(time)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 border border-gray-200 rounded-lg">
                  <p className="text-gray-500">No available time slots for this date</p>
                </div>
              )
            ) : (
              <div className="text-center py-4 border border-gray-200 rounded-lg">
                <p className="text-gray-500">Please select a date first</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedDate || !selectedTime || loading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Processing...</span>
              </div>
            ) : (
              "Reschedule"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleModal; 
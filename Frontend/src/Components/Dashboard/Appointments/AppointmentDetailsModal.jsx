import { FaUserMd, FaUser } from "react-icons/fa";

const AppointmentDetailsModal = ({ 
  isOpen, 
  onClose, 
  appointment, 
  onReschedule, 
  onDelete,
  formatDateTime,
  getStatusBadge 
}) => {
  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl mx-auto p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Appointment Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">Doctor Information</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <FaUserMd className="text-blue-500 mr-3" />
                  <div>
                    <p className="font-medium">Dr. {appointment.doctor?.name || "Unknown"}</p>
                    <p className="text-sm text-gray-600">{appointment.doctor?.specialization || "Specialist"}</p>
                    {appointment.doctor?.experience && (
                      <p className="text-sm text-gray-600">Experience: {appointment.doctor.experience} years</p>
                    )}
                    {appointment.doctor?.email && (
                      <p className="text-sm text-gray-600">Email: {appointment.doctor.email}</p>
                    )}
                    {appointment.doctor?.phone && (
                      <p className="text-sm text-gray-600">Phone: {appointment.doctor.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">Patient Information</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <FaUser className="text-green-500 mr-3" />
                  <div>
                    <p className="font-medium">{appointment.patient?.name || "Unknown"}</p>
                    {appointment.patient?.email && (
                      <p className="text-sm text-gray-600">{appointment.patient.email}</p>
                    )}
                    {appointment.patient?.phone && (
                      <p className="text-sm text-gray-600">Phone: {appointment.patient.phone}</p>
                    )}
                    {appointment.patient?.age && (
                      <p className="text-sm text-gray-600">Age: {appointment.patient.age}</p>
                    )}
                    {appointment.patient?.gender && (
                      <p className="text-sm text-gray-600">Gender: {appointment.patient.gender}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-3">Appointment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Status:</p>
                <div className="mt-1">{getStatusBadge(appointment.status || "scheduled")}</div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date & Time:</p>
                <p className="font-medium">{formatDateTime(appointment.date, appointment.timeslot)}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={() => {
                onClose();
                onReschedule(appointment);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reschedule
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete(appointment._id);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal; 
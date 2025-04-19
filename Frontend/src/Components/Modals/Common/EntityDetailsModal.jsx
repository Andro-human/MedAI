import React from "react";
import { FaUserMd, FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaBriefcase, FaVenusMars } from "react-icons/fa";

const EntityDetailsModal = ({
  isOpen,
  onClose,
  entity,
  entityType, // "doctor" or "patient"
  onDelete
}) => {
  if (!isOpen || !entity) return null;
  console.log(entity);
  const isDoctor = entityType === "doctor";
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl mx-auto p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {isDoctor ? "Doctor" : "Patient"} Details
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
          <div className="flex items-center">
            <div className={`h-20 w-20 ${isDoctor ? "bg-blue-100" : "bg-green-100"} rounded-full flex items-center justify-center mr-6`}>
              {isDoctor ? (
                <FaUserMd className="text-blue-600 text-3xl" />
              ) : (
                <FaUser className="text-green-600 text-3xl" />
              )}
            </div>
            <div>
                <div className="flex items-center gap-4">
              <h3 className="text-2xl font-bold text-gray-800">
                {isDoctor ? "Dr. " : ""}{entity.name}
              </h3>
              <span className="text-gray-600 capitalize mt-1">{entity.age}</span>
                </div> 
              {isDoctor && (
                <p className="text-lg text-gray-600">{entity.specialization}</p>
              )}
                <div className="flex items-center mt-1">
                  <FaVenusMars className="text-gray-600 mr-2" />
                  <span className="text-gray-600 capitalize">{entity.gender}</span>
                    
                </div>
              <span className={`mt-2 inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                entity.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {entity.status || "active"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <FaEnvelope className="text-blue-500 mr-3" />
                  <span>{entity.email}</span>
                </div>
                <div className="flex items-center">
                  <FaPhone className="text-blue-500 mr-3" />
                  <span>{entity.phone}</span>
                </div>
              </div>
            </div>

            {isDoctor ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-3">Professional Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <FaGraduationCap className="text-blue-500 mr-3" />
                    <div>
                      <p className="font-medium">Education</p>
                      <p className="text-sm text-gray-600">{entity.education || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaBriefcase className="text-blue-500 mr-3" />
                    <div>
                      <p className="font-medium">Experience</p>
                      <p className="text-sm text-gray-600">{entity.experience} years</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-3">Medical Information</h3>
                <div className="space-y-2">
                  {entity.allergies && (
                    <div>
                      <p className="font-medium">Allergies</p>
                      <p className="text-sm text-gray-600">{entity.allergies}</p>
                    </div>
                  )}
                  {entity.bloodGroup && (
                    <div>
                      <p className="font-medium">Blood Group</p>
                      <p className="text-sm text-gray-600">{entity.bloodGroup}</p>
                    </div>
                  )}
                  {entity.height && entity.weight && (
                    <div>
                      <p className="font-medium">Physical</p>
                      <p className="text-sm text-gray-600">Height: {entity.height} cm, Weight: {entity.weight} kg</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-medium text-gray-800 mb-3">Account Management</h3>
            <div className="flex gap-4">
              <button
                onClick={() => onDelete(entity._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityDetailsModal; 
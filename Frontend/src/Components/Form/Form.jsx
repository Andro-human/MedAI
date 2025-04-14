import React, { useState } from "react";
import { toast } from "react-toastify";

import hero from "../../assets/hero.png";
import { userAppointment } from "../Services/AuthAction";
const Form = () => {
  const [formData, setFormData] = useState({
    doctorName: "",
    date: "",
    specialization: "",
    time: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e, date, time, specialization, doctorName) => {
    e.preventDefault();
    // Handle form submission logic here
    // console.log(formData); // For testing
    try {
      if (!date || !time || !specialization || !doctorName) {
        toast.error("Please enter all fields");
        return;
      }
      userAppointment({ date, time, specialization, doctorName });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ backgroundImage: `url(${hero})`, backgroundSize: `cover` }}>
      <div className="my-5 max-w-md mx-auto  backdrop-blur-xl p-6 rounded-md shadow-md">
        <h2 className="text-lg font-semibold text-white mb-6">
          Book an Appointment
        </h2>
        <form onSubmit={handleSubmit}>
          {/* <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-600">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div> */}
          {/* <div className="mb-4">
          <label htmlFor="age" className="block text-sm font-medium text-gray-600">Age</label>
          <input
            type="text"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div> */}
          {/* <div className="mb-4">
          <label htmlFor="gender" className="block text-sm font-medium text-gray-600">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div> */}

          <div className="mb-4">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-white"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="time"
              className="block text-sm font-medium text-white"
            >
              Time
            </label>
            <input
              type="text"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="specialization"
              className="block text-sm font-medium text-white"
            >
              specialization
            </label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="doctorName"
              className="block text-sm font-medium text-white"
            >
              Doctor Name
            </label>
            <input
              type="text"
              id="doctorName"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;

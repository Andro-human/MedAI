import { useState } from "react";
import registration from "../../assets/registration.jpg";
import axios from "axios";
import { userRegister } from "../Services/AuthAction";
const Signup = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setrole] = useState("");
  const [gender, setGender] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., API call)
    userRegister({
      name,
      age,
      email,
      password,
      phone,
      role,
      gender,
      specialization,
      experience,
      education,
    });
  };

  return (
    <div
      style={{
        backgroundImage: `url(${registration})`,
        backgroundSize: `cover`,
      }}
      className="min-h-screen flex items-center justify-end pr-20 bg-gray-900"
    >
      <form
        onSubmit={handleSubmit}
        className=" backdrop-blur-xl shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full md:w-1/2 lg:w-1/3"
      >
        <div className="mb-4">
          <label
            htmlFor="Role"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Role
          </label>
          <select
            name="Role"
            id="Role"
            onChange={(e) => setrole(e.target.value)}
            className="w-full text-center"
          >
            <option value="">-----select---</option>
            <option value="admin">Admin</option>
            <option value="user">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your password"
            required
          />
        </div>
        {role === "user" || role === "doctor" ? (
          <div>
            <div className="mb-4">
              <label
                htmlFor="age"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Age
              </label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your age"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Gender
              </label>
              <label className="mr-4">
                <input
                  type="radio"
                  id="gender-male"
                  name="gender"
                  value="male"
                  onChange={(e) => setGender(e.target.value)}
                  checked={gender === "male"}
                  className="mr-1"
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  id="gender-female"
                  name="gender"
                  value="female"
                  onChange={(e) => setGender(e.target.value)}
                  checked={gender === "female"}
                  className="mr-1"
                />
                Female
              </label>
            </div>
            <div className="mb-6">
              <label
                htmlFor="phone"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>
        ) : null}

        {role === "doctor" && (
          <div>
            <div className="mt-4">
              <label
                htmlFor="specialization"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Specialization
              </label>
              <input
                type="text"
                id="specialization"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your specialization"
                required
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="experience"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Experience
              </label>
              <input
                type="number"
                id="experience"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your experience"
                required
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="Eduction"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Eduction
              </label>
              <input
                type="text"
                id="Eduction"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your Eduction"
                required
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;

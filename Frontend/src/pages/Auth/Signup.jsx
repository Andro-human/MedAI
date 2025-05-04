import { useState } from "react";
import registration from "../../assets/Auth/registration.jpg";
import axios from "axios";
import { toast } from "react-toastify";
import { userExists } from "../../redux/reducers/auth";
import { useDispatch } from "react-redux";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    gender: "",
    specialization: "",
    experience: "",
    education: "",
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const specializations = [
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
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const nextStep = (e) => {
    e.preventDefault();
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = (e) => {
    e.preventDefault();
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formData.role === "doctor") {
      if (parseInt(formData.age) < 21 || parseInt(formData.age) > 120) {
        toast.error("For doctors, age must be between 21 and 120");
        return;
      }
    } else {
      if (parseInt(formData.age) < 1 || parseInt(formData.age) > 120) {
        toast.error("Age must be between 1 and 120");
        return;
      }
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    if (formData.role === "doctor") {
      if (!formData.specialization) {
        toast.error("Please select your specialization");
        return;
      }

      if (
        parseInt(formData.experience) < 0 ||
        parseInt(formData.experience) > 50
      ) {
        toast.error("Experience must be between 0 and 50 years");
        return;
      }

      if (formData.education.length < 2) {
        toast.error("Please enter valid education qualification");
        return;
      }
    }

    setLoading(true);

    formData;
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER}api/auth/register`,
        formData
      );

      if (data.success) {
        localStorage.setItem("token", data.token);
        dispatch(userExists(data.user));
        toast.success(data.message);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error while registering");
    } finally {
      setLoading(false);
    }
  };

  // Form steps based on role
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 ">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Account Information
            </h2>

            <div className="mb-4">
              <label
                htmlFor="role"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Register as
              </label>
              <select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-white bg-opacity-80 rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select your role</option>
                <option value="user">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white bg-opacity-80 rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-white bg-opacity-80 rounded-lg border ${
                  formData.email && !/\S+@\S+\.\S+/.test(formData.email)
                    ? "border-red-500"
                    : "border-gray-300"
                } p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your email"
                required
              />
              {formData.email && !/\S+@\S+\.\S+/.test(formData.email) && (
                <p className="text-red-500 text-sm mt-1">
                  Please enter a valid email address
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full bg-white bg-opacity-80 rounded-lg border ${
                  formData.password && formData.password.length < 6
                    ? "border-red-500"
                    : "border-gray-300"
                } p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Create a strong password"
                required
              />
              {formData.password && formData.password.length < 6 && (
                <p className="text-red-500 text-sm mt-1">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={nextStep}
                disabled={
                  !formData.name ||
                  !formData.email ||
                  !formData.password ||
                  !formData.role
                }
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Personal Information
            </h2>

            <div className="mb-4">
              <label
                htmlFor="age"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                min="1"
                max="120"
                value={formData.age}
                onChange={handleChange}
                className={`w-full bg-white bg-opacity-80 rounded-lg border ${
                  formData.age &&
                  (parseInt(formData.age) < 1 || parseInt(formData.age) > 120)
                    ? "border-red-500"
                    : "border-gray-300"
                } p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your age"
                required
              />
              {formData.age &&
                (parseInt(formData.age) < 1 ||
                  parseInt(formData.age) > 120) && (
                  <p className="text-red-500 text-sm mt-1">
                    Age must be between 1 and 120
                  </p>
                )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Gender
              </label>
              <div className="flex gap-6 mt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleChange}
                    className="form-radio h-5 w-5 text-blue-600"
                  />
                  <span>Male</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleChange}
                    className="form-radio h-5 w-5 text-blue-600"
                  />
                  <span>Female</span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full bg-white bg-opacity-80 rounded-lg border ${
                  formData.phone && !/^\d{10}$/.test(formData.phone)
                    ? "border-red-500"
                    : "border-gray-300"
                } p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your 10-digit phone number"
                required
              />
              {formData.phone && !/^\d{10}$/.test(formData.phone) && (
                <p className="text-red-500 text-sm mt-1">
                  Please enter a valid 10-digit phone number
                </p>
              )}
            </div>

            {formData.role === "doctor" && (
              <>
                <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
                  Professional Information
                </h3>

                <div className="mb-4">
                  <label
                    htmlFor="specialization"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Specialization
                  </label>
                  <select
                    name="specialization"
                    id="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full bg-white bg-opacity-80 rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={formData.role === "doctor"}
                  >
                    <option value="">Select your specialization</option>
                    {specializations.map((spec, index) => (
                      <option key={index} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="experience"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    id="experience"
                    name="experience"
                    min="0"
                    max="50"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full bg-white bg-opacity-80 rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter years of experience"
                    required={formData.role === "doctor"}
                  />
                  {formData.experience &&
                    (parseInt(formData.experience) < 0 ||
                      parseInt(formData.experience) > 50) && (
                      <p className="text-red-500 text-sm mt-1">
                        Experience must be between 0 and 50 years
                      </p>
                    )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="education"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Education Qualification
                  </label>
                  <input
                    type="text"
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className="w-full bg-white bg-opacity-80 rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="E.g., MD, MBBS, etc."
                    required={formData.role === "doctor"}
                  />
                  {formData.education && formData.education.length < 2 && (
                    <p className="text-red-500 text-sm mt-1">
                      Please enter valid education qualification
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={prevStep}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-all"
              >
                Back
              </button>

              <button
                onClick={handleSubmit}
                disabled={
                  loading ||
                  !formData.age ||
                  !formData.gender ||
                  !formData.phone ||
                  (formData.role === "doctor" &&
                    (!formData.specialization ||
                      !formData.experience ||
                      !formData.education))
                }
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Create Account"
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
    <div
      style={{
        backgroundImage: `url(${registration})`,
        backgroundSize: `cover`,
        backgroundPosition: "center",
      }}
      className={` flex items-center justify-end p-4 md:p-10 lg:pr-20 ${
        step === 2 && formData?.role === "doctor"
      } ? h-[80vh]: h-[92vh]`}
    >
      <div className="w-full md:w-2/3 lg:w-1/2 xl:w-2/5 backdrop-blur-sm bg-white bg-opacity-50 shadow-xl rounded-2xl p-8 transition-all my-8">
        <div className="flex items-center mb-6">
          <div className="relative w-full">
            <div className="h-1 bg-gray-300 rounded-full w-full absolute top-1/2 transform -translate-y-1/2"></div>
            <div
              className={`h-1 bg-blue-600 rounded-full absolute top-1/2 transform -translate-y-1/2 transition-all duration-500 ${
                step === 1 ? "w-1/2" : "w-full"
              }`}
            ></div>
            <div className="flex justify-between relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                1
              </div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 2
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                2
              </div>
            </div>
          </div>
        </div>

        <form className="max-h-[70vh] overflow-y-auto pr-2">
          {renderStep()}
        </form>
      </div>
    </div>
  );
};

export default Signup;

import { useState } from "react";
import { toast } from "react-toastify";
import { userExists } from "../../redux/reducers/auth";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FaUser, FaLock, FaUserMd, FaUserCog } from "react-icons/fa";
import medicalIllustration from "../../assets/sidebar.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !role) {
      toast.error("Please enter all fields");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER}auth/login`,
        { role, email, password }
      );

      if (data.success) {
        localStorage.setItem("token", data.token);
        dispatch(userExists(data.user));

        toast.success(data.message);
        setTimeout(() => {
          if (role === "user") window.location.replace("/userdashboard");
          if (role === "doctor") window.location.replace("/doctor-dashboard");
          if (role === "admin") window.location.replace("/admin-dashboard");
        }, 2000);
      } else {
        toast.error(data.message || "Login failed");
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error while logging in");
      setLoading(false);
    }
  };

  const getRoleIcon = (roleType) => {
    switch (roleType) {
      case "user":
        return <FaUser className="text-blue-500" />;
      case "doctor":
        return <FaUserMd className="text-blue-500" />;
      case "admin":
        return <FaUserCog className="text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 h-[92vh]">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Left side - Image and Welcome text */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 ">
        <div className="max-w-md text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Welcome to MedAI
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Your trusted healthcare companion for convenient and reliable
            medical services.
          </p>
          <div className="flex justify-center">
            <img
              src={medicalIllustration}
              alt="Medical illustration"
              className="w-3/5"
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">Don&apos;t have an account?</p>
          <Link
            to="/Signup"
            className="text-blue-600 font-medium hover:text-blue-800 transition-colors mt-2 inline-block"
          >
            Create an account
          </Link>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
                <p className="text-gray-600 mt-2">Access your MedAI account</p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Role Selection */}
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Select your role
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {["user", "doctor", "admin"].map((roleType) => (
                      <div
                        key={roleType}
                        onClick={() => setRole(roleType)}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${
                          role === roleType
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                          {getRoleIcon(roleType)}
                        </div>
                        <span className="text-sm capitalize">
                          {roleType === "user" ? "Patient" : roleType}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email */}
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-500" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 pl-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label
                      htmlFor="password"
                      className="block text-gray-700 text-sm font-semibold"
                    >
                      Password
                    </label>
                    <a
                      href="#"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-500" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 pl-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                {/* Sign In Button */}
                <div className="mb-6">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

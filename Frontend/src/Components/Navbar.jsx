import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import MedAi from "../assets/MedAi.png";
import { useDispatch, useSelector } from "react-redux";
import { userNotExists } from "../redux/reducers/auth";

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(userNotExists());
    navigate("/");
  };
  return (
    <header className="shadow sticky z-50 top-0 h-[8vh]">
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link to="/" className="flex items-center">
            <img src={MedAi} className="mr-3 h-12" alt="Logo" />
          </Link>

          <div className="ml-6" id="mobile-menu-2">
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              {!user && (
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `block py-2 pr-4 pl-3 duration-200 ${
                        isActive ? "text-sky-700" : "text-grey-700"
                      } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 
                                hover:text-sky-700 lg:p-0`
                    }
                  >
                    Home
                  </NavLink>
                </li>
              )}
              {user?.role == "user" && (
                <>
                  <li>
                    <NavLink
                      to="/userdashboard"
                      className={({ isActive }) =>
                        `block py-2 pr-4 pl-3 duration-200 ${
                          isActive ? "text-orange-700" : "text-grey-700"
                        } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 
                                hover:text-orange-700 lg:p-0`
                      }
                    >
                      Your Appointment
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/chat"
                      className={({ isActive }) =>
                        `block py-2 pr-4 pl-3 duration-200 ${
                          isActive ? "text-orange-700" : "text-grey-700"
                        } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 
                                hover:text-orange-700 lg:p-0`
                      }
                    >
                      Chat
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/bookAppointment"
                      className={({ isActive }) =>
                        `block py-2 pr-4 pl-3 duration-200 ${
                          isActive ? "text-orange-700" : "text-grey-700"
                        } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 
                              hover:text-orange-700 lg:p-0`
                      }
                    >
                      Book an Appointment
                    </NavLink>
                  </li>
                </>
              )}

              {user?.role == "doctor" && (
                <>
                  <li>
                    <NavLink
                      to="/doctor-dashboard"
                      className={({ isActive }) =>
                        `block py-2 pr-4 pl-3 duration-200 ${
                          isActive ? "text-orange-700" : "text-grey-700"
                        } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 
                                hover:text-orange-700 lg:p-0`
                      }
                    >
                      Your Appointment
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/chat"
                      className={({ isActive }) =>
                        `block py-2 pr-4 pl-3 duration-200 ${
                          isActive ? "text-orange-700" : "text-grey-700"
                        } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 
                                hover:text-orange-700 lg:p-0`
                      }
                    >
                      Chat
                    </NavLink>
                  </li>
                </>
              )}

              <li>
                <NavLink
                  to="/Services"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 ${
                      isActive ? "text-sky-700" : "text-grey-700"
                    } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 
                                hover:text-sky-700 lg:p-0`
                  }
                >
                  Services
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/Contact"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 ${
                      isActive ? "text-orange-700" : "text-grey-700"
                    } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 
                                hover:text-orange-700 lg:p-0`
                  }
                >
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="flex flex-1" />
          {!user && (
            <div className="flex items-center lg:order-2">
              <Link
                to="Login"
                className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
              >
                Log in
              </Link>
              <Link
                to="Signup"
                className="text-white bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
              >
                Get started
              </Link>
            </div>
          )}

          {user && (
            <div className="flex items-center lg:order-2">
              <button
                onClick={handleLogout}
                className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

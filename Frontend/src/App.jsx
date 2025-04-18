import "./App.css";
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Herosection from "./pages/Herosection.jsx";
import Services from "./pages/Services.jsx";
import Login from "./pages/Auth/Login.jsx";
import Signup from "./pages/Auth/Signup.jsx";
import Contact from "./pages/Contact.jsx";
import { useSelector, useDispatch } from "react-redux";
import { userExists, userNotExists } from "./redux/reducers/auth";
import { useEffect } from "react";
import axios from "axios";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard.jsx";
import Appointments from "./pages/BookAppointment.jsx";
import ProtectedRoutes from "./Routes/ProtectedRoutes.jsx";
import Userdashboard from "./pages/Dashboard/Userdashboard.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BookAppointment from "./pages/BookAppointment.jsx";
import Chat from "./Components/Chat/Chat.jsx";
import PublicRoutes from "./Routes/PublicRoutes.jsx";

function App() {
  const { user, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER}auth/getUser`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(({ data }) => {
        console.log(data);
        dispatch(userExists(data.user));
      })
      .catch(() => {
        dispatch(userNotExists());
        localStorage.clear();
      });
  }, [dispatch]);
  console.log("user", user);

  return isLoading ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-12 h-12 border-t-4 border-b-4 border-orange-500 rounded-full animate-spin"></div>
    </div>
  ) : (
    <Router>
      <Navbar />
      <Routes>
        <Route element={<PublicRoutes user={user} />}>
          <Route
            path="/"
            element={
              <>
                <Herosection />
                <Footer />
              </>
            }
          />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
        </Route>

        <Route
          path="/Services"
          element={
            <>
              <Services />
              <Footer />
            </>
          }
        />
        <Route
          path="/Contact"
          element={
            <>
              <Contact />
              <Footer />
            </>
          }
        />
        {/* <Route
          path="/appointment"
          element={
            <ProtectedRoutes user={user}>
              <Form />
            </ProtectedRoutes>
          }
        /> */}

        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route element={<ProtectedRoutes user={user} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route
            path="/appointments"
            element={
              <ProtectedRoutes user={user} redirect="/">
                <Appointments />
              </ProtectedRoutes>
            }
          />
          <Route path="/doctor-dashboard" element={<Userdashboard  />} />
          <Route path="/userdashboard" element={<Userdashboard />} />
          <Route path="/bookAppointment" element={<BookAppointment />} />
          <Route path="/chat" element={<Chat />} />
        </Route>
      </Routes>

      <ToastContainer />
    </Router>
  );
}

export default App;

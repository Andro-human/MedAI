import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Chat from "./Components/Chat/Chat.jsx";
import Footer from "./Components/Footer.jsx";
import Navbar from "./Components/Navbar.jsx";
import ProtectedRoutes from "./Routes/ProtectedRoutes.jsx";
import PublicRoutes from "./Routes/PublicRoutes.jsx";
import { SocketProvider } from "./socket.jsx";
import Login from "./pages/Auth/Login.jsx";
import Signup from "./pages/Auth/Signup.jsx";
import Contact from "./pages/Contact.jsx";
import BookAppointment from "./pages/Dashboard/BookAppointment.jsx";
import Userdashboard from "./pages/Dashboard/Userdashboard.jsx";
import Herosection from "./pages/Herosection.jsx";
import Services from "./pages/Services.jsx";
import Analytics from "./pages/admin/Analytics.jsx";
import AdminAppointments from "./pages/admin/Appointments.jsx";
import Doctors from "./pages/admin/Doctors.jsx";
import Patients from "./pages/admin/Patients.jsx";
import ReportPage from "./pages/report.jsx";
import ImageUploadPage from "./pages/woundAnalyser.jsx";
import { userExists, userNotExists } from "./redux/reducers/auth";

function App() {
  const { user, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER}api/auth/getUser`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(({ data }) => {
        dispatch(userExists(data.user));
      })
      .catch(() => {
        dispatch(userNotExists());
        localStorage.clear();
      });
  }, [dispatch]);

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
          <Route
            path="/Services"
            element={
              <>
                <Services />
                <Footer />
              </>
            }
          />
          <Route path="/Services/wound" element={<ImageUploadPage />} />
          <Route path="/Services/report" element={<ReportPage />} />
        </Route>

        <Route
          path="/Contact"
          element={
            <>
              <Contact />
              <Footer />
            </>
          }
        />

        <Route
          element={
            <SocketProvider>
              <ProtectedRoutes user={user} />{" "}
            </SocketProvider>
          }
        >
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/dashboard" element={<Userdashboard />} />
          <Route path="/book-appointment" element={<BookAppointment />} />

          <Route path="/chat" element={<Chat />} />

          <Route path="/appointments" element={<AdminAppointments />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/patients" element={<Patients />} />
        </Route>
      </Routes>

      <ToastContainer />
    </Router>
  );
}

export default App;

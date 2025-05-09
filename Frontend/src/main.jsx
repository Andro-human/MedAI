import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// import {
//   Route,
//   RouterProvider,
//   createBrowserRouter,
//   createRoutesFromElements,
// } from "react-router-dom";
// import Herosection from "./Components/Herosection/Herosection.jsx";
// import Form from "./Components/Form/Form.jsx";
// import Services from "./Components/Services/Services.jsx";
// import Login from "./Components/Login/Login.jsx";
// import Signup from "./Components/Signup/Signup.jsx";
// import Contact from "./Components/Contact/Contact.jsx";
// import AdminDashboard from "./Components/AdminDashboard/AdminDashboard.jsx";
// import Doctors from "./Components/Dashboard/Doctors/Doctors.jsx";
// import Patients from "./Components/Dashboard/Patients/Patients.jsx";
// import Appointments from "./Components/Dashboard/Appointments/Appointments.jsx";
// import DoctorDashboard from "./Components/DoctorDashboard/DoctorDashboard.jsx";
// import ProtectedRoute from "./Components/Routes/ProtectedRoutes.js";
// import Userdashboard from "./Components/UserDashboard/Userdashboard.jsx";
import { CssBaseline } from "@mui/material";
import { Provider } from "react-redux";

import store from "./redux/store.js";
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <CssBaseline />
    {/* <RouterProvider router={router} /> */}
    <App />
    {/* <div>Hello</div> */}
    {/* <ToastContainer /> */}
  </Provider>
);

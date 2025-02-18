import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Herosection from './Components/Herosection/Herosection.jsx'
import Form from './Components/Form/Form.jsx'
import Services from './Components/Services/Services.jsx'
import Login from './Components/Login/Login.jsx'
import Signup from './Components/Signup/Signup.jsx'
import Contact from './Components/Contact/Contact.jsx'
import AdminDashboard from './Components/AdminDashboard/AdminDashboard.jsx'
import Doctors from './Components/Dashboard/Doctors/Doctors.jsx'
import Patients from './Components/Dashboard/Patients/Patients.jsx'
import Appointments from './Components/Dashboard/Appointments/Appointments.jsx'
import DoctorDashboard from './Components/DoctorDashboard/DoctorDashboard.jsx'
import ProtectedRoute from './Components/Routes/ProtectedRoutes.js'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route path='' element={<Herosection/>} />
      <Route path='Services' element={<Services/>} />
      <Route path='appointment' element={<Form/>} />
      <Route path='Login' element={<Login/>} />
      <Route path='Signup' element={<Signup/>} />
      <Route path='Contact' element={<Contact/>} />
      <Route path='dashboard' element={<AdminDashboard/>}>
          <Route path='doctors' element={<Doctors/>} />
          <Route path='patients' element={<Patients/>} />
          <Route path='appointments' element={<ProtectedRoute><Appointments/></ProtectedRoute>}/>
      </Route>
      <Route path='doctordashboard' element={<DoctorDashboard/>}/>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router}/>
)

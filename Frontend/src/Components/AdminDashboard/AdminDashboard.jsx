import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import Doctors from '../Dashboard/Doctors/Doctors'
function AdminDashboard() {
  return (
    <div className='h-screen flex flex--row'>
      <div className='flex justify-center items-center w-1/5 bg-sky-700'>
        {/* column handle */}
        <div className='flex flex-col gap-y-4 text-white'>
            <Link to='/dashboard/doctors'>Doctors</Link>
            <Link to='/dashboard/patients' >
            Patients
            </Link>
            <Link to='/dashboard/appointments' >
            Appointment
            </Link>
        </div>
      </div>
      <div className='w-4/5'>
       <Outlet/>
      </div>
    </div>
  )
}

export default AdminDashboard

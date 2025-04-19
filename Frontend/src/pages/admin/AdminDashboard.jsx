import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { FaChartLine, FaUserMd, FaUsers, FaCalendarCheck } from 'react-icons/fa'

function AdminDashboard() {
  return (
    <div className='h-screen flex flex--row'>
      <div className='flex justify-center items-center w-1/5 bg-sky-700'>
        {/* column handle */}
        <div className='flex flex-col gap-y-4 text-white w-full p-6'>
            <Link to='/dashboard/analytics' className='flex items-center gap-2 py-2 px-4 hover:bg-sky-600 rounded-lg transition-colors'>
              <FaChartLine />
              <span>Analytics</span>
            </Link>
            <Link to='/dashboard/doctors' className='flex items-center gap-2 py-2 px-4 hover:bg-sky-600 rounded-lg transition-colors'>
              <FaUserMd />
              <span>Doctors</span>
            </Link>
            <Link to='/dashboard/patients' className='flex items-center gap-2 py-2 px-4 hover:bg-sky-600 rounded-lg transition-colors'>
              <FaUsers />
              <span>Patients</span>
            </Link>
            <Link to='/dashboard/appointments' className='flex items-center gap-2 py-2 px-4 hover:bg-sky-600 rounded-lg transition-colors'>
              <FaCalendarCheck />
              <span>Appointments</span>
            </Link>
        </div>
      </div>
      <div className='w-4/5 overflow-auto'>
       <Outlet/>
      </div>
    </div>
  )
}

export default AdminDashboard

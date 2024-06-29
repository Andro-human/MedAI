import React from 'react'

function DoctorDashboard() {

  const handlecheck = (e)=>{
    e.preventdefault();
    
  }

  return (
    <div className='h-screen mt-2'>
      <div>
        <h2 className='text-xl font-bold text-center'>Welcome Doctor</h2>
      </div>
      <div className='w-full h-full flex flex-col gap-y-3 p-8'>
        {/* wrap the doctor content */}
        <div className='flex flex-row justify-between'>
             <p className='font-semibold'> name </p>
              <p>Doctor Name</p>
              <p 
              onClick={handlecheck}
              className='bg-sky-600 px-4 py-2 text-white rounded-lg cursor-pointer'>Checked</p>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard

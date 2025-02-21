import React from 'react'

function Userdashboard() {
  return (
    <div className='w-full h-full flex flex-col gap-x-4 mt-8 px-8'>
      <h2 className='text-center text-xl font-bold'>Welcome User</h2>
      <div>
        {/* appointments */}
        <div className='flex flex-row justify-between px-8 gap-y-4'>
            <p>Doctor Name</p>
            <p>Date</p>
            <p>Time</p>
        </div>
      </div>
    </div>
  )
}

export default Userdashboard

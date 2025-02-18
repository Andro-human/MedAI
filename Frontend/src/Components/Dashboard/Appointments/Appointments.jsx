import React from 'react'

function Appointments() {
  const handledelete = (e)=>{
    e.preventdefault();
    
  }
  return (
    <div className='h-full w-full flex flex-col p-5 '>
      <div>
        <h2 className='text-center font-bold text-xl'>Appointment</h2>
      </div>
      <div className='w-full h-full flex flex-col gap-y-2 px-8 my-3'>
        {/* loop data  patients*/}
        <div className='flex flex-row justify-between'>
             <p className='font-semibold'> name </p>
              <p>Doctor Name</p>
              <p 
              onClick={handledelete}
              className='bg-sky-600 px-4 py-2 text-white rounded-lg'>Delete</p>
        </div>
      </div>
    </div>
  )
}

export default Appointments

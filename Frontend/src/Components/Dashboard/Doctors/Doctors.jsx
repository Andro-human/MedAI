import React from 'react'
import { Link } from 'react-router-dom'

function Doctors() {
  return (
    <div className='h-full w-full flex flex-col p-5'>
        <h2 className='text-center font-bold text-xl'>Doctors</h2>
        <div className='flex flex-row justify-end'>
        
            <Link to='/AddDoctor' className='bg-sky-600 text-white px-4 py-2 rounded-lg'>Add Doctor</Link>

      </div>
      <div>
        <div>
            
        </div>
      </div>
    </div>
  )
}

export default Doctors

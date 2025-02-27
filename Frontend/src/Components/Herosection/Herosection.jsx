import React from 'react'
import hero from '../../assets/heroright.png'
function Herosection() {
  return (
    <div 
    className=' flex flex-row justify-around h-[100vh] px-24'>
      <div className='flex flex-col space-y-6 justify-center items-center'>
        <div className='space-y-6'>
            <h1 className='text-6xl font-bold'>Get Appointment</h1>
            <h1 className=' font-bold text-6xl'>Easy and Fast</h1>
        </div>
        <div>
            <p>
            We celebrate the good days, support each other through the tough ones, and never lose hope.
            </p>
        </div>
        {/* buttons */}
        <div className='flex flex-row space-x-4'> 
        <button className="btn w-48 h-12 bg-blue-800 text-white hover:bg-blue-500">Appointment</button>
        <button className="btn w-48">Explore More</button>
        </div>
      </div>
      <div>
        {/* image */}
       <img src={hero} alt=""  className='h-full w-full'/>
      </div>
    </div>
  )
}

export default Herosection

import React from 'react'
import wound from '../../assets/wound.png'
import disease from '../../assets/disease.jpg'
import Report from '../../assets/Report.png'
import { Link } from 'react-router-dom'
function Services() {
  return (
    <div className='w-full min-h-screen flex  flex-col justify-center items-center m-8 p-8 gap-y-2'>
      <div className='flex flex-row space-x-4'>
        <div className='w-80 border-solid border-2 rounded-lg shadow-2xl hover:scale-90 duration-200 border-blue-700 p-3 flex flex-col space-y-4 items-center justify-center'>
          {/* wound analyser */}
          <img src={wound} alt="img" className='p' />
           <h2 className='text-xl font-semibold text-center'>Wound Analyser</h2>
           <p className='font-extralight text-center'>Wound Analyzer utilizes AI to assess and categorize wound characteristics, aiding healthcare providers in treatment planning </p>
           <button className='w-full bg-blue-900 h-10 text-white rounded-lg hover:bg-blue-500'><a href="https://eca6b6046c522632b8.gradio.live/">Analyse</a></button>
        </div>
        <div className='w-80 border-solid border-2 rounded-lg shadow-2xl hover:scale-90 duration-200 border-blue-700 p-3 flex flex-col space-y-4 items-center justify-center'>
          {/* wound analyser */}
          <img src={disease} alt="img" className='p' />
           <h2 className='text-xl font-semibold text-center'>Disease Predictor</h2>
           <p className='font-extralight text-center'>Disease Predictor is an AI-driven tool that analyzes medical data to forecast potential health conditions</p>
           <button className='w-full bg-blue-900 h-10 text-white rounded-lg hover:bg-blue-500'><a href="https://black-artist-gusse.pwskills.app:8080/">Predict</a></button>
        </div>
        <div className='w-80 border-solid border-2 rounded-lg shadow-2xl hover:scale-90 duration-200 border-blue-700 p-3 flex flex-col space-y-4 items-center justify-center'>
          {/* wound analyser */}
          <img src={Report} alt="img" className='p' />
           <h2 className='text-xl font-semibold text-center'>Report Summarizer</h2>
           <p className='font-extralight text-center'>AI tool condenses medical data into brief summaries, enhancing efficiency and clarity in healthcare decision-making.</p>
           <button className='w-full bg-blue-900 h-10 text-white rounded-lg hover:bg-blue-500'>Summarizar</button>
        </div>
      </div>
      <div className='flex flex-row space-x-4'>
        <div className='w-80 border-solid border-2 rounded-lg shadow-2xl hover:scale-90 duration-200 border-blue-700 p-3 flex flex-col space-y-4 items-center justify-center'>
          {/* wound analyser */}
          <img src={wound} alt="img" className='p' />
           <h2 className='text-xl font-semibold text-center'>Wound Analyser</h2>
           <p className='font-extralight text-center'>Wound Analyzer utilizes AI to assess and categorize wound characteristics, aiding healthcare providers in treatment planning </p>
           <button className='w-full bg-blue-900 h-10 text-white rounded-lg hover:bg-blue-500'><a href="https://eca6b6046c522632b8.gradio.live/">Analyse</a></button>
        </div>
        <div className='w-80 border-solid border-2 rounded-lg shadow-2xl hover:scale-90 duration-200 border-blue-700 p-3 flex flex-col space-y-4 items-center justify-center'>
          {/* wound analyser */}
          <img src={disease} alt="img" className='p' />
           <h2 className='text-xl font-semibold text-center'>Disease Predictor</h2>
           <p className='font-extralight text-center'>Disease Predictor is an AI-driven tool that analyzes medical data to forecast potential health conditions</p>
           <button className='w-full bg-blue-900 h-10 text-white rounded-lg hover:bg-blue-500'><a href="https://black-artist-gusse.pwskills.app:8080/">Predict</a></button>
        </div>
        <div className='w-80 border-solid border-2 rounded-lg shadow-2xl hover:scale-90 duration-200 border-blue-700 p-3 flex flex-col space-y-4 items-center justify-center'>
          {/* wound analyser */}
          <img src={Report} alt="img" className='p' />
           <h2 className='text-xl font-semibold text-center'>Report Summarizer</h2>
           <p className='font-extralight text-center'>AI tool condenses medical data into brief summaries, enhancing efficiency and clarity in healthcare decision-making.</p>
           <button className='w-full bg-blue-900 h-10 text-white rounded-lg hover:bg-blue-500'>Summarizar</button>
        </div>
      </div>
    </div>
  )
}

export default Services

import React from "react";
import { useNavigate } from "react-router-dom";
import disease from "../assets/Services/disease.jpg";
import Report from "../assets/Services/Report.png";
import wound from "../assets/Services/wound.png";
function Services() {
  const navigate = useNavigate();
 const handleWoundNavigate = ()=>{
  navigate('/services/wound');
};

  const handleDiseaseRoute = ()=>{
    navigate('/services/report');
  }
 

  return (
    <div className="flex flex-col justify-center items-center gap-y-4 h-[80vh]">
      <div className="flex flex-row space-x-12">
        <div className="w-80 border-solid border-2 rounded-lg shadow-2xl hover:scale-90 duration-200 border-blue-700 p-3 flex flex-col space-y-4 items-center justify-center">
          {/* wound analyser */}
          <img src={wound} alt="img" className="p" />
          <h2 className="text-xl font-semibold text-center">Wound Analyser</h2>
          <p className="font-extralight text-center">
            Wound Analyzer utilizes AI to assess and categorize wound
            characteristics, aiding healthcare providers in treatment planning{" "}
          </p>
          <button 
            onClick={handleWoundNavigate}
            className="w-full bg-blue-900 h-10 text-white rounded-lg hover:bg-blue-500 flex items-center justify-center"
          >
            Analyse
          </button>
        </div>
        <div className="w-80 border-solid border-2 rounded-lg shadow-2xl hover:scale-90 duration-200 border-blue-700 p-3 flex flex-col space-y-4 items-center justify-center">
          <img src={disease} alt="img" className="p" />
          <h2 className="text-xl font-semibold text-center">
            Disease Predictor
          </h2>
          <p className="font-extralight text-center">
            Disease Predictor is an AI-driven tool that analyzes medical data to
            forecast potential health conditions
          </p>
          <button className="w-full bg-blue-900 h-10 text-white rounded-lg hover:bg-blue-500">
            <a href="https://diseasepredictor-n6yx.onrender.com/">Predict</a>
          </button>
        </div>
        <div className="w-80 border-solid border-2 rounded-lg shadow-2xl hover:scale-90 duration-200 border-blue-700 p-3 flex flex-col space-y-4 items-center justify-center">
          {/* wound analyser */}
          <img src={Report} alt="img" className="p" />
          <h2 className="text-xl font-semibold text-center">
            Report Summarizer
          </h2>
          <p className="font-extralight text-center">
            AI tool condenses medical data into brief summaries, enhancing
            efficiency and clarity in healthcare decision-making.
          </p>
          <button className="w-full bg-blue-900 h-10 text-white rounded-lg hover:bg-blue-500"
          onClick={handleDiseaseRoute}
          >
            Summarizar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Services;

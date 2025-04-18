import hero from "../assets/heroright.png";

function Herosection() {
  return (
    <div className="flex flex-row justify-between items-center h-[80vh] px-8 md:px-24 bg-gradient-to-r from-slate-50 to-blue-50">
      <div className="flex flex-col space-y-8">
        <div className="space-y-2">
          <h1 className="text-5xl md:text-6xl font-bold text-blue-900">AI-Powered</h1>
          <h1 className="text-5xl md:text-6xl font-bold text-blue-900">Healthcare</h1>
        </div>
        <p className="text-lg text-gray-700">
          Experience the future of medicine with our intelligent diagnosis system. 
          Fast, accurate, and accessible healthcare solutions when you need them most.
        </p>
        <div className="flex flex-row space-x-6 pt-4">
          <a href="/login" className="px-8 py-3 bg-blue-700 text-white font-medium rounded-full hover:bg-blue-600 transition shadow-md">
            Book Appointment
          </a>
          <a
            href="/services"
            className="px-8 py-3 border-2 border-blue-700 text-blue-700 font-medium rounded-full hover:bg-blue-50 transition"
          >
            Explore Services
          </a>
        </div>
      </div>
      <div className="hidden md:block mt-4">
        <img src={hero} alt="Healthcare professional" className="h-full w-full" />
      </div>
    </div>
  );
}

export default Herosection;

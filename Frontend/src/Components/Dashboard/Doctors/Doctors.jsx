import React from "react";
import { Link } from "react-router-dom";

function Doctors() {
  const handledelete = (e) => {
    e.preventdefault();
  };
  return (
    <div className="h-full w-full flex flex-col p-5">
      <h2 className="text-center font-bold text-xl">Doctors</h2>
      <div className="flex flex-row justify-end">
        <Link
          to="/AddDoctor"
          className="bg-sky-600 text-white px-4 py-2 rounded-lg"
        >
          Add Doctor
        </Link>
      </div>
      <div>
        <div className="w-full h-full flex flex-col gap-y-2 px-8 my-3 ">
          {/* data loop */}
          <div className="flex flex-row justify-between">
            <p className="font-semibold"> name </p>
            <p>specialization</p>
            <p
              onClick={handledelete}
              className="bg-sky-600 px-4 py-2 text-white rounded-lg cursor-pointer"
            >
              Delete
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Doctors;

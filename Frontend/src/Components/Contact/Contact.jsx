import React, { useState } from "react";
import first from "../../assets/first.png";
import second from "../../assets/third.jpg";
import third from "../../assets/fourth.jpg";
import simran from "../../assets/simran.jpg";
function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    query: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle form submission logic here
    console.log(formData);
    // Reset the form after submission
    setFormData({ name: "", email: "", query: "" });
  };

  return (
    <div className="flex flex-row justify-between  items-center h-[80vh] overflow-hidden">
      {/* left */}
      <div className="w-1/2">
        <div className="w-full flex space-x-2 h-[38vh]">
          <a href="#" className="group relative block bg-black w-[50%] ">
            <img
              alt=""
              src={first}
              className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50"
            />

            <div className="relative p-4 sm:p-6 lg:p-8">
              <p className="text-sm font-medium uppercase tracking-widest text-pink-500">
                Developer
              </p>

              <p className="text-xl font-bold text-white sm:text-2xl">
                Ansh Yadav
              </p>

              <div className="mt-32 sm:mt-48 lg:mt-64">
                <div className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-sm text-white">
                    {/* Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Omnis perferendis hic asperiores quibusdam quidem voluptates
                    doloremque reiciendis nostrum harum. Repudiandae? */}
                    Leading with Purpose, Empowering with Passion
                  </p>
                </div>
              </div>
            </div>
          </a>

          <a href="#" className="group relative block bg-black w-1/2">
            <img
              alt=""
              src={second}
              className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50"
            />

            <div className="relative p-4 sm:p-6 lg:p-8">
              <p className="text-sm font-medium uppercase tracking-widest text-pink-500">
                Developer
              </p>

              <p className="text-xl font-bold text-white sm:text-2xl">
                Animesh Sinha
              </p>

              <div className="mt-32 sm:mt-48 lg:mt-64">
                <div className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-sm text-white">
                    Crafting Code for Seamless Functionality
                  </p>
                </div>
              </div>
            </div>
          </a>
        </div>
        <div className="flex space-x-2 mt-2 h-[38vh]">
          <a href="#" className="group relative block bg-black w-1/2">
            <img
              alt=""
              src={third}
              className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50"
            />

            <div className="relative p-4 sm:p-6 lg:p-8">
              <p className="text-sm font-medium uppercase tracking-widest text-pink-500">
                Developer
              </p>

              <p className="text-xl font-bold text-white sm:text-2xl">
                Saniya Khan
              </p>

              <div className="mt-32 sm:mt-48 lg:mt-64">
                <div className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-sm text-white">
                    Designing Experiences, One Pixel at a Time
                  </p>
                </div>
              </div>
            </div>
          </a>

          <a href="#" className="group relative block bg-black w-1/2">
            <img
              alt=""
              src={simran}
              className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50"
            />

            <div className="relative p-4 sm:p-6 lg:p-8">
              <p className="text-sm font-medium uppercase tracking-widest text-pink-500">
                Developer
              </p>

              <p className="text-xl font-bold text-white sm:text-2xl">Anjali</p>

              <div className="mt-32 sm:mt-48 lg:mt-64">
                <div className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-sm text-white">
                    Empowering Innovation through Intelligent Algorithms
                  </p>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
      {/* right */}
      <div className="w-1/2">
        {/* Form */}
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Contact Us
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="query"
                className="block text-sm font-medium text-gray-700"
              >
                Query
              </label>
              <textarea
                id="query"
                name="query"
                rows="4"
                placeholder="Your Query"
                value={formData.query}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;

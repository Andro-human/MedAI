

import React, { useState } from 'react';
import slidebar from '../../assets/sidebar.png'
import './Log.css'
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role,setrole] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., API call)
    console.log('Form submitted:', { username, password,role });
  };

  return (
    
    <div className='flex flex-row justify-evenly h-[600px]'>
        <div className='w-1/2 flex flex-row justify-end items-center'>
           <img src={slidebar} alt="" className='w-1/2'/>

        </div>
        {/* form */}
        <div className="w-1/2 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-4/6"
      >
        <div className="mb-4">
          <label
            htmlFor="Role"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Role
          </label>
            <select name="Role" id="Role" onChange={(e)=>setrole(e.target.value)} className='w-full text-center'>
            <option value="">-----select---</option>
            <option value="admin">Admin</option>
            <option value="user">Patient</option>
            <option value="doctor">Doctor</option>
            </select>

        </div>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your password"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full rounded focus:outline-none focus:shadow-outline"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default Login;

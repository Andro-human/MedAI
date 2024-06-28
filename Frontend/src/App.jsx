import { useState } from 'react'
import './App.css'
import Navbar from './Components/Navbar/Navbar'
import Footer from './Components/Footer/Footer'

import { Outlet } from 'react-router-dom'
import Contact from './Components/Contact/Contact'
import AdminDashboard from './Components/AdminDashboard/AdminDashboard'


function App() {
 

  return (
    <>
    <Navbar/>
    <Outlet/>
    <Footer/>
    </>
  )
}

export default App

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './Components/Navbar/Navbar'
import Footer from './Components/Footer/Footer'
import Herosection from './Components/Herosection/Herosection'
import Form from './Components/Form/Form'

import { Outlet } from 'react-router-dom'

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

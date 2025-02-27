import { useState } from "react";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";

import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";

function App() {

  const onclickevent = (e)=>{
    console.log("hii guy's")
    toast.success("hii")
  }
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;

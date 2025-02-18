import React from 'react'
import API from './API'
import { toast } from 'react-toastify';

const userAppointment = async (date, time, specialisation, doctorName) => {
  try {
    const {data} = await API.post("/auth/create-appointment", {date, time, specialisation, doctorName})
    if (data.success) {
        // localStorage.setItem("token", data.token),
        toast.success(data.message)
    }

    
  } catch (error) {
    console.log(error)
  }
}

const userLogin = async ({role, email, password}) => {
    const { data } = await API.post("auth/login", {role, email, password})
    
    if (data.success) {
        localStorage.setItem('token', data.token)
        toast.success(data.message);
        if (role === 'user') window.location.replace("/userdashboard")
        if(role === 'doctor') window.location.replace("/doctordashboard")
    }
    return data;
}

const userRegister = async() => {
  
}

export {userAppointment, userLogin, userRegister }

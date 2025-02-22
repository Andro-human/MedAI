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
        if (role === 'admin') window.location.replace("/admindashboard")
    }
    return data;
}

const userRegister = async({name,
  age,
  email,
  password,
  phone,
  role,
  gender,
  specialization,
  experience,
  education}) => {
    try {
        console.log("registering");
        console.log(name
          , age
          , email
          , password
          , phone
          , role
          , specialization, experience, education);
        const {data} = await API.post("/auth/register", {name, age, email, password, phone, role, gender, specialization, experience, education
        })
        if (data.success) {
            toast.success(data.message)
            window.location.replace("/login")
        }
    } catch (error) {
        console.log(error)
    }   
}

export {userAppointment, userLogin, userRegister }

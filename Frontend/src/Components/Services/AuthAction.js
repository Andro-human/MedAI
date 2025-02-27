import API from './API'
import { toast } from 'react-toastify';

const userAppointment = async (date, time, specialisation, doctorName) => {
  try {
    const { data } = await API.post("/auth/create-appointment", {
      date, time, specialisation, doctorName
    });

    if (data.success) {
      toast.success(data.message);
    } else {
      toast.error(data.message || "Failed to create appointment");
    }

  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Error while creating appointment");
  }
};

const userLogin = async ({ role, email, password }) => {
  try {
    const { data } = await API.post("auth/login", { role, email, password });
    console.log(data);

    if (data.success) {
      localStorage.setItem('token', data.token);
      toast.success(data.message);
      
      if (role === 'user') window.location.replace("/userdashboard");
      if (role === 'doctor') window.location.replace("/doctordashboard");
    } else {
      toast.error(data.message || "Login failed");
    }

  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Error while logging in");
  }
};

const userRegister = async (
  name, age, email, password, phone, role, gender, specialization, experience, education
) => {
  try {
    const { data } = await API.post("/auth/register", {
      name, age, email, password, phone, role, gender, specialization, experience, education
    });

    if (data.success) {
      toast.success(data.message);
      window.location.replace("/login");
    } else {
      toast.error(data.message || "Registration failed");
    }

  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Error while registering");
  }
};

export { userAppointment, userLogin, userRegister };

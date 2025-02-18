import { useEffect } from "react";
// import { useDispatch } from "react-redux";
import API from "../Services/API";
// import { getCurrentUser } from "../../redux/features/auth/authAction";
import { useNavigate } from "react-router-dom";
const ProtectedRoute = ({ children }) => {
//   const dispatch = useDispatch();
const navigate = useNavigate()
  //get current use
  const getUser = async () => {
    try {
      const { data } = await API.get("/auth/current-user");
      if (data?.success) {
    //   dispatch(getCurrentUser(data));
        return data
      }
    } catch (error) {
      localStorage.clear();
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  });

  console.log("hello")
  if (localStorage.getItem("token")) return children;
  else return navigate("/Login")
};

export default ProtectedRoute;

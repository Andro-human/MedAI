import { Navigate, Outlet } from "react-router-dom";
import PropTypes from 'prop-types'

const ProtectedRoutes = ({user}) => {
    if(!user) return <Navigate to="/" />
    return <Outlet />
}

ProtectedRoutes.propTypes = {
    user: PropTypes.object,
}

export default ProtectedRoutes

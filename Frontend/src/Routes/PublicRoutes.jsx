import { Navigate, Outlet } from "react-router-dom";
import PropTypes from 'prop-types'

const PublicRoutes = ({user}) => {
    if(user) {
        switch(user.role) {
            case 'admin':
                return <Navigate to="/admin-dashboard" />
            case 'user':
                return <Navigate to="/userdashboard" />
            case 'doctor':
                return <Navigate to="/doctor-dashboard" />
            default:
                return <Navigate to="/" />
        }
    }
    return <Outlet />
}

PublicRoutes.propTypes = {
    user: PropTypes.object,
}

export default PublicRoutes

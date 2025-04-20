import { Navigate, Outlet } from "react-router-dom";
import PropTypes from 'prop-types'

const PublicRoutes = ({user}) => {
    if(user) {
        if (user.role == "admin") {
            return <Navigate to="/analytics" />
        } else 
            return <Navigate to="/dashboard" />
    }
    return <Outlet />
}

PublicRoutes.propTypes = {
    user: PropTypes.object,
}

export default PublicRoutes

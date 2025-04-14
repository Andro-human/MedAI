import { Navigate, Outlet } from "react-router-dom";
import PropTypes from 'prop-types'

const ProtectedRoutes = ({user, redirect = '/'}) => {
    if(!user) return <Navigate to={redirect} />
    return <Outlet />
}

ProtectedRoutes.propTypes = {
    user: PropTypes.object,
    redirect: PropTypes.string
}

export default ProtectedRoutes

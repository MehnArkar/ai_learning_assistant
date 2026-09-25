import { Navigate, Outlet } from "react-router-dom"
import { isAuthenticated } from "../utils/auth"
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = () =>{
    const { user, loading } = useAuth();
    
    if(loading){
        return null;
    }

    if(!user){
        return <Navigate to="/login" replace/>
    }

    return <Outlet/>
}

export default ProtectedRoute;
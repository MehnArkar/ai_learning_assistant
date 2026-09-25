import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getMe, login, register, type AuthUser, type LoginPayload, type RegisterPayload } from "../api/auth";

interface AuthContextValue {
    user: AuthUser | null
    loading: boolean
    loginUser:(payload: LoginPayload) => Promise<void>
    registerUser:(payload: RegisterPayload) => Promise<void>
    logout: ()=> void
}

const AuthContext = createContext<AuthContextValue | null>(null)


export const AuthProvider = ({children}:{children:ReactNode}) => {
    const [user, setUser] = useState<AuthUser|null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{
        const restoreUser = async () =>{
            const token = localStorage.getItem('token')
            if(!token){
                setLoading(false)
                return;
            }

            try{
                const res = await getMe();
                setUser(res.data.user)
            }catch{
                localStorage.removeItem('token');
                setUser(null)
            }finally{
                setLoading(false)
            }
        }
        void restoreUser()
    },[])

    const loginUser = async (payload:LoginPayload) => {
        const res = await login(payload);
        localStorage.setItem('token',res.data.token)
        setUser(res.data.user);
    }

    const registerUser = async (payload:RegisterPayload) =>{
        const res = await register(payload);
        localStorage.setItem('token',res.data.token)
        setUser(res.data.user);
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    return(
        <AuthContext.Provider value={{user, loading,loginUser,registerUser,logout}}>
            {children}
        </AuthContext.Provider>
    )

}


export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuth must be used inside AuthProvider')
    }
    return context;
}
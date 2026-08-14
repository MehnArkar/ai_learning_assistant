import api from "./axios"


export interface RegisterPayload{
    name: string
    email: string
    password: string
}


export interface AuthUser {
    id: string
    name: string
    email: string
    avatar?: string
  }

export interface AuthResponse{
    success:boolean
    message: string
    data:{
        user: AuthUser
        token: string
    }
}

export interface LoginPayload{
    email: string
    password: string
}



export const register = async (payload:RegisterPayload) => {
    const { data } = await api.post<AuthResponse>(
        '/auth/register',
        payload
    );
    return data;
}

export const login = async(payload : LoginPayload) => {
    const { data } = await api.post<AuthResponse>(
        '/auth/login',
        payload
    );
    return data;
}
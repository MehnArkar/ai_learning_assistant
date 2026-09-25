import { Request, Response } from 'express'
import { getCurrentUser, loginUser, registerUser } from '../services/auth.service'
import { AuthRequest, getUserId } from '../middleware/auth.middleware'

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await registerUser(req.body)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed'

    res.status(400).json({
      success: false,
      message,
    })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await loginUser(req.body)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed'

    res.status(401).json({
      success: false,
      message,
    })
  }
}

export const me = async (req:AuthRequest,res:Response):Promise<void> =>{
   try{
    const user = await getCurrentUser(getUserId(req));
    res.status(200).json({
      success: true,
      message: 'Authenticated user',
      data: { user },
    });
   }catch(error){
    const message = error instanceof Error ? error.message : 'Failed to get user';
    res.status(404).json({success:false,message})
   } 
}
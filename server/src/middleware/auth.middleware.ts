import { NextFunction, Response, Request } from "express"
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    userId?: string
}


export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        res.status(401).json({
            success:false,
            message: "Authentication required"
        });
        return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET;

    if(!secret){
        res.status(500).json({
            success:false,
            message:'Server configuration error'
        })
        return
    }

    try{
        const  decode = jwt.verify(token,secret) as {userId:string};
        req.userId = decode.userId;
        next()
    } catch {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        })
    }

}
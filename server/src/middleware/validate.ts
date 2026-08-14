import { NextFunction, Request, Response } from "express"
import { ZodType } from 'zod'

export const validate = (schema:ZodType) => {
    return (req:Request, res:Response,next: NextFunction):void => {
        const result = schema.safeParse(req.body);

        if(!result.success){
            const message = result.error.issues.map((issue)=>issue.message).join(', ');

            res.status(400).json({
                success: false,
                message
            })
            return
        }

        req.body = result.data;
        next()

    }
}
// middleware/requireFile.ts
import { NextFunction, Request, Response } from 'express'

export const requirePdfFile = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'PDF file is required' })
    return
  }
  next()
}
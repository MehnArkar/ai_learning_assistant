import { AuthRequest, getUserId } from "../middleware/auth.middleware";
import { Response } from 'express'
import { getChatHistory, sendMessage } from "../services/chat.services";

const getDocumentId = (req:AuthRequest): string => {
    const id = req.params.id
    if (typeof id != 'string'){
        throw new Error('Invalid document id')
    }
    return id
}


export const getMessages = async (req:AuthRequest, res: Response):Promise<void> => {
    try{
        const data = await getChatHistory(getUserId(req),getDocumentId(req))
        res.status(200)
        .json({
            success:true,
            messsage:'Chat History fetched',
            data
        })
    }catch(err){
        const message = err instanceof Error ? err.message : 'Failed to fetch chat history'
        res.status(404).json({success:false,message})
    }
}

export const postMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await sendMessage(getUserId(req), getDocumentId(req), req.body.message)
    res.status(201).json({ success: true, message: 'Message sent', data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send message'
    res.status(400).json({ success: false, message })
  }
}
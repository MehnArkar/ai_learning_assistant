import ChatMessageModel, { IChatMessage } from "../models/ChatMessage";
import DocumentModel from "../models/Document";
import { generateChatReply } from "./gemini.services";
import { ensureDocumentIndexed, findRelevantChunks } from "./rag.services";

const HISTORY_LIMIT = 10

const formatMessage = (msg:IChatMessage) => ({
    id:msg._id.toString(),
    role: msg.role,
    text: msg.text,
    createdAt: msg.createdAt
})


export const getChatHistory = async(userId: string, documentId: string) => {
    const doc = await DocumentModel.findOne({_id: documentId,userId: userId})
    if (!doc){
        throw new Error('Document not found')
    }

    const messages = await ChatMessageModel.find({documentId,userId}).sort({createdAt:1})
    return messages.map(formatMessage)
}

export const sendMessage = async(userId: string, documentId: string, question: string) =>{
    const doc = await DocumentModel.findOne({_id: documentId,userId: userId})
    if (!doc){
        throw new Error('Document not found')
    }

    await ensureDocumentIndexed(doc)

    // Only the last 10 turns — unbounded history would grow tokens forever
    const recentHistory = await ChatMessageModel.find({documentId,userId}).sort({createdAt:-1}).limit(HISTORY_LIMIT);
    const history = recentHistory.reverse()

    const userMessage = await ChatMessageModel.create({documentId,userId,role: 'user', text:question});

    const relevantChunks = await findRelevantChunks(documentId, question)

    const replyText = await generateChatReply(
        relevantChunks,
        history.map((m) => ({ role: m.role, text: m.text })),
        question
    )

    const aiMessage = await ChatMessageModel.create({ documentId, userId, role: 'ai', text: replyText })

    return {
        userMessage: formatMessage(userMessage),
        aiMessage: formatMessage(aiMessage)
    }
}
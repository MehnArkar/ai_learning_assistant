import api from "./axios"

export interface ChatMessageItem {
    id: string,
    role: 'user' | 'ai'
    text: string,
    createdAt: string
}

interface ChatHistoryResponse {
    success: boolean
    message: string
    data: ChatMessageItem[]
}

interface SendMessageResponse {
    success: boolean
    message: string
    data: {
        userMessage: ChatMessageItem
        aiMessage: ChatMessageItem
    }
}

export const getChatHistory = async (documentId: string) => {
    const { data } = await api.get<ChatHistoryResponse>(`/documents/${documentId}/chat`)
    return data
}

export const sendChatMessage = async (documentId: string, message: string) => {
    const { data } = await api.post<SendMessageResponse>(`/documents/${documentId}/chat`, { message })
    return data
}
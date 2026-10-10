import { useEffect, useRef, useState } from "react"
import {getChatHistory, sendChatMessage, type ChatMessageItem } from "../../../api/chat"
import axios from "axios"
import { Send, Sparkles } from "lucide-react"
import Button from "../../../components/buttom"

interface ChatTabProps{
    documentId: string
}

const ChatTab = ({ documentId } : ChatTabProps) => {
    const [messages, setMessages] =useState<ChatMessageItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [input, setInput] = useState('')
    const [sending, setSending] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const hasScrolledRef = useRef(false)
    const SUGGESTIONS = ['Summarize this document', 'What are the key points?', 'Explain the main topic', 'Give me an example']


    useEffect(()=>{
        let cancelled = false
        const load = async () => {
            try{
                setLoading(true)
                setError('')
                const res = await getChatHistory(documentId)
                if(!cancelled) setMessages(res.data)
            } catch (err){
                if(!cancelled){
                    setError(
                        axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to load chat' :'Failed to load chat'
                    )
                }
            }finally{
                if(!cancelled) setLoading(false)
            }
        }

        void load()

        return ()=> {
            cancelled = true
        }
    }, [documentId])

    // Scroll only the message list (scrollIntoView also scrolls the whole page).
    // Jump instantly on first load, animate for new messages after that.
    useEffect(()=>{
        const el = scrollRef.current
        if (!el) return
        el.scrollTo({ top: el.scrollHeight, behavior: hasScrolledRef.current ? 'smooth' : 'auto' })
        hasScrolledRef.current = true
    },[messages, sending, loading])

    const handleSend = async (text:string = input) =>{
        const trimmed = text.trim()
        if (!trimmed || sending) return

        const tempId = `temp-${Date.now()}`
        setMessages((prev)=>[
            ...prev,
            {id:tempId, role: 'user', text: trimmed, createdAt: new Date().toISOString()}
        ])
        setInput('')
        setSending(true)
        setError('')

        try{
            const res = await sendChatMessage(documentId, trimmed)
            setMessages((prev)=>[
                ...prev.filter((m)=>m.id!== tempId),
                res.data.userMessage,
                res.data.aiMessage
            ])
        } catch (err) {
        setMessages((prev) => prev.filter((m) => m.id !== tempId))
        setError(
            axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to send message' : 'Failed to send message'
        )
    } finally {
        setSending(false)
    }
    }

    if(loading){
        return <p className="p-6 text-sm text-slate-400">Loading chat...</p>
    }

    return(
        <div className="flex flex-col h-full">
            <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col">
              <div className="mt-auto space-y-3">
                {messages.map((m)=>(
                    <div key={m.id} className={`flex ${m.role==='user'? 'justify-end' : 'justify-start'} gap-3`}>
                        {m.role === 'ai' && (
                            <div className="w-7 h-7 bg-[#ccfaeb] rounded-full flex items-center justify-center flex-shrink-0">
                                <Sparkles size={14} className="text-[#00B86B]"/>
                            </div>
                        )}
                        <div
                            className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                                m.role === 'user'
                                ? 'brand-gradient text-white rounded-br-sm'
                                : 'bg-white border border-slate-100 text-slate-800 rounded-bl-sm shadow-sm'
                            }`}
                        >
                            {m.text}
                        </div>
                    </div>
                ))}

            {sending && (
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#ccfaeb] rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles size={14} className="text-[#00B86B]" />
                    </div>
                    <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                        />
                        ))}
                    </div>
                    </div>
                </div>
                )}

                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
            </div>

            <div className="px-4 pb-2 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                    <button
                        key={s}
                        onClick={() => void handleSend(s)}
                        disabled={sending}
                        className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:border-[#00B86B] hover:text-[#007a53] transition-all disabled:opacity-50"
                    >
                        {s}
                    </button>
                ))}
            </div>

            <div className="px-4 py-3 border-t border-slate-100 bg-white">
                <div className="flex gap-2">
                    <input
                        value={input}
                        onChange={(e)=>setInput(e.target.value)}
                        onKeyDown={(e)=>e.key=== 'Enter' && !e.shiftKey && void handleSend()}
                        placeholder="Ask anything about this document..."
                        disabled={sending}
                        className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B86B] focus:bg-white transition-all"
                    />
                    <Button 
                        onClick={()=>void handleSend()} 
                        disabled={!input.trim() || sending}
                        className="flex items-center justify-center"
                    >
                        <Send size={15}/>
                    </Button>
                </div>
            </div>
            
        </div>
    )
}


export default ChatTab;
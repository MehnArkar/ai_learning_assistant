import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getDocument, type DocumentItem } from "../../api/documents"
import axios from "axios"
import { ChevronLeft } from "lucide-react"
import PdfViewerTab from "./tabs/PdfViewerTab"
import ChatTab from "./tabs/ChatTab"

type Tab = 'pdf' | 'chat' | 'summary' | 'flashcards' | 'quizzes'
const TABS: { id: Tab; label: string }[] = [
  { id: 'pdf', label: '📄 PDF Viewer' },
  { id: 'chat', label: '💬 AI Chat' },
  { id: 'summary', label: '✨ Summary' },
  { id: 'flashcards', label: '🃏 Flashcards' },
  { id: 'quizzes', label: '📝 Quizzes' },
]

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const DocumentDetailsPage = ()=> {
    const {id} = useParams<{id:string}>()
    const navigate = useNavigate()
    const [doc, setDoc] = useState<DocumentItem | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [tab, setTab] = useState<Tab>('pdf')

    useEffect (()=>{
        if(!id) return
        void (async ()=>{
            try{
                setLoading(true)
                setError('')
                const res = await getDocument(id)
                setDoc(res.data) 
            } catch(err){
                setError(
                    axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to load document' : 'Failed to load document'
                )
            } finally{
                setLoading(false)
            }
        })()
    },[id])

    if (loading) return <p className="h-full flex items-center justify-center p-6 text-sm text-slate-500 ">Loading...</p>
    if (error || !doc || !id) return <p className="p-6 text-sm text-red-500 h-full flex items-center justify-center">{error || 'Document not found'}</p>

    return (
        // Fill the screen below the 64px (h-16) app header so tabs can stretch to the bottom
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 bg-white border-b border-slate-100">
                <button
                    onClick={()=> navigate(`/documents`)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                    <ChevronLeft size={18}/>
                </button>

                <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-slate-900 truncate">
                        {doc.name}
                    </h2>
                    <p className="text-xs text-slate-400">
                        {doc.pageCount || '-'} pages · {doc.fileSize} · Uploaded {formatDate(doc.createdAt)}
                    </p>
                </div>
            </div>

            {/* Tab Bar */}
            <div className="flex border-b border-slate-100 bg-white overflow-auto">
                {TABS.map((t)=>(
                    <button
                     key={t.id}
                     onClick={()=>setTab(t.id)}
                     className={
                        `px-4 py-3
                        ${tab==t.id
                            ? 'border-b-2 border-[#00B86B] text-[#007a53] bg-[#e6fff5]/40'
                            : 'border-b-2 border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        }
                        `
                     }
                    >   
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
                {tab === 'pdf' && <PdfViewerTab documentId={id} />}
                {tab === 'chat' && <ChatTab documentId={id} />}
                {tab !== 'pdf' && tab !== 'chat' && <p className="p-6 text-sm text-slate-400">Coming soon</p>}
            </div>

        </div>
    )
}

export default DocumentDetailsPage
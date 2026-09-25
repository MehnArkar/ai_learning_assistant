import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { getDocumentFile } from "../../../api/documents"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"



interface PdfViewerTabProps {
  documentId: string
}

const PdfViewerTab = ({documentId}:PdfViewerTabProps) =>{

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [page, setPage] = useState(1)
    const [zoom, setZoom] = useState(100)
    const [fileUrl, setFileUrl] = useState<string | null>(null)
    const objectUrlRef = useRef<string | null>(null)


    useEffect(()=>{
        let cancelled = false

        const load = async () => {
            try{

                setLoading(true)
                setError('')
                const blob = await getDocumentFile(documentId)
                const url = URL.createObjectURL(blob)
                if(cancelled){
                    URL.revokeObjectURL(url)
                    return
                }
                objectUrlRef.current = url
                setFileUrl(url)

            }catch(err){
                if(!cancelled){
                    setError(
                        axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to load PDF' : 'Failed to load PDF'
                    )
                }
            } finally {
                if(!cancelled) setLoading(false)
            }
        }

        void load()

        return()=>{
            cancelled = true
            if(objectUrlRef.current){
                URL.revokeObjectURL(objectUrlRef.current)
            }
        }

        
    },[documentId])


    return (
        <div className="flex flex-col bg-slate-100">
            <div className="flex items-center gap-3 px-4 py-2.5 bg-white border-b border-slate-100">
                <div className="flex items-center gap-1">
                    <button
                        onClick={()=> setPage((p)=>Math.max(1,p-1))}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                    >
                        <ChevronLeft size={16}/>
                    </button>
                    <span className="text-sm text-slate-600 px-2 min-w-[80px] text-center">Page {page}</span>
                    <button
                        onClick={() => setPage((p) => p + 1)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
                <div className="h-4 w-px bg-slate-200" />
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setZoom((z) => Math.max(50, z - 25))}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                    >
                        <ZoomOut size={16} />
                    </button>
                    <span className="text-sm text-slate-600 w-14 text-center">{zoom}%</span>
                    <button
                        onClick={() => setZoom((z) => Math.min(200, z + 25))}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                    >
                        <ZoomIn size={16} />
                    </button>
                </div>
            </div>

            <div className="flex flex-col items-center p-6">
                {loading 
                    ? (<p className="text-sm text-slate-400 mt-10">Loading PDF...</p>)
                    : error 
                    ? (<p className="text-sm text-red-500 mt-10">{error}</p>)
                    : (
                        <div 
                            style={{width:`${zoom}%`, minWidth:320, maxWidth: 960}}
                            className="transition-all duration-200"
                        >
                            <iframe
                                src={`${fileUrl}#page=${page}`}
                                className="w-full rounded-2xl border border-slate-200 shadow-lg bg-white"
                                style={{ height: '75vh' }}
                                title="PDF Viewer"
                            />
                        </div>
                    )
                }
            </div>
        </div>
    )

}

export default PdfViewerTab
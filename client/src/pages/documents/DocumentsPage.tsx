import { useEffect, useState } from "react"
import { deleteDocument, getDocuments, renameDocument, toggleDocumentFavorite, uploadDocument, type DocumentItem } from "../../api/documents";
import axios from "axios";
import { BookOpen, Edit3, ExternalLink, FileText, HelpCircle, MoreVertical, Search, Star, Trash2, Upload, X } from "lucide-react";
import Button from "../../components/buttom";
import { useNavigate } from "react-router-dom";


const PDF_COLORS = [
  'bg-red-100 text-red-500',
  'bg-orange-100 text-orange-500',
  'bg-blue-100 text-blue-500',
  'bg-purple-100 text-purple-500',
  'bg-pink-100 text-pink-500',
  'bg-teal-100 text-teal-500',
]



const formatSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`

const formatDate = (iso: string)=>
  new Date(iso).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})

const UploadModal = ({
  onClose,
  onUploaded
}:{
  onClose: ()=>void,
  onUploaded: ()=>void
}) => {

  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')

  const handleUpload = async ()=>{
    if (!title.trim() || !file) return
    setError('')
    setUploading(true)
    try{
      await uploadDocument(title.trim(),file)
      onUploaded()
    } catch (err){
      if(axios.isAxiosError(err)){
        setError(err.response?.data?.message || 'Upload failed')
      }else {
        setError('Upload failed')
      }
    }finally{
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-4">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900">Upload Document</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100"
          >
           <X size={18}/> 
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Document Title</label>
            <input
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
              placeholder="e.g. Biology Chapter 4 Notes"
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B86B]"
            />
          </div>

          <div
            onDragOver={(e)=>{
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={()=>setDragging(false)}
            onDrop={(e)=>{
              e.preventDefault()
              setDragging(false)
              const f = e.dataTransfer.files[0]
              if(f) setFile(f)
            }}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center ${
            dragging? 'border-[#00B86B] bg-[#e6fff5]' : 'border-slate-200'
          }`}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={(e)=>{
                const f = e.target.files?.[0]
                if(f) setFile(f)
              }}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />

            {file 
            ? (
              <div className="flex flex-col items-center gap-2">
                <FileText size={22} className="text-[#00B86B]"/>
                <p className="text-sm font-medium text-slate-800">{file.name}</p>
                <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
              </div>  
            )
            :(
              <div className="flex flex-col items-center gap-2">
                <Upload size={22} className="text-slate-400"/>
                <p className="text-sm font-medium text-slate-700">Drop your PDF here</p>
                <p className="text-xs text-slate-400">or click to browse · PDF · Max 50 MB</p>
              </div>
            )
          }

          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}

        </div>
        <div className="px-6 pb-6 flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="button"
            loading={uploading}
            disabled={!title.trim() || !file}
            onClick={()=>void handleUpload()}
          >
            <Upload size={15}/> Upload
          </Button>
        </div>
      </div>
    </div>
  );
}


const DocumentsPage = () => {
  const navigate = useNavigate()
  const [docs, setDocs] = useState<DocumentItem[]>([])
  const [loading,setLoading] = useState(true);
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'favorites'>('all')
  const [reloadKey, setReloadKey] = useState(0)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [showUpload, setShowUpload] = useState(false)
  
   
  useEffect(() => {
    const t = setTimeout(() => {
      void (async () => {
        try {
          setLoading(true)
          setError('')
          const res = await getDocuments(search, filter === 'favorites')
          setDocs(res.data)
        } catch (err) {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || 'Failed to load documents')
          } else {
            setError('Failed to load documents')
          }
        } finally {
          setLoading(false)
        }
      })()
    }, 300)
    return () => clearTimeout(t)
  }, [search, filter, reloadKey])

    const handleFavorite = async (id:string)=>{
      const res = await toggleDocumentFavorite(id);
      setDocs((prev)=>prev.map((d)=>(d.id === id ? res.data : d)))
    }


    const handleRename = async (id:string, currentName: string) =>{
      const next = window.prompt('New name', currentName)
      if(!next?.trim()) return
      const res = await renameDocument(id,currentName);
      setDocs((prev) => prev.map((d) => (d.id === id ? res.data : d)))
      setMenuOpen(null)
    }

    const handleDelete = async (id: string) => {
      if (!window.confirm('Delete this document?')) return
      await deleteDocument(id)
      setDocs((prev) => prev.filter((d) => d.id !== id))
      setMenuOpen(null)
    }

    return (
      
      <div className="p-6  max-w-350">
        
        {showUpload && (
          <UploadModal
            onClose={() =>  setShowUpload(false)}
            onUploaded={()=>{
              setShowUpload(false);
              setReloadKey((k)=>k+1)
            }}
          />
        )}

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-6">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
              <input
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                placeholder="Search documents..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B86B]" 
              />
          </div>

          {/* Filter tab */}
          <div  className="flex items-center justify-center bg-slate-100 rounded-xl p-1 gap-1">
              {(['all', 'favorites'] as const).map((f)=>(
                <button
                  key={f}
                  type="button"
                  onClick={()=>setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium 
                    ${ filter === f ? 'bg-white text-slate-600':'bg-none text-slate-500'}`
                  }
                >
                  {f === 'all' ? 'All' : '★ Favorites' }
                </button>
              ))}
          </div>

          <Button
            type="button"
            size="sm"
            onClick={()=>setShowUpload(true)}
          >
              <Upload size={15} className="text-slate-50"/> Upload PDF
          </Button>
        </div>

        {error && <p className="text-sm text-slate-500 mb-4">{error}</p>}

        {loading 
        ? (<p className="text-sm text-slate-500 "> Loading ...</p>)
        : docs.length === 0 
        ? (
          <div className="text-center py-16">
            <FileText size={28} className="mx-auto text-slate-300 mb-3" />
            <h3 className="font-semibold text-slate-800">No documents found</h3>
            <p className="text-sm text-slate-500 mb-4">Upload a PDF to get started</p>
            <Button variant="primary" type="button" onClick={() => setShowUpload(true)}>
              Upload PDF
            </Button>
          </div>
        )
        : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            { docs.map ((doc,i)=>(
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm"
              >
                <div
                  className={`h-36 rounded-t-2xl ${PDF_COLORS[i % PDF_COLORS.length]} flex items-center justify-center cursor-pointer`}
                  onClick={() => navigate(`/documents/${doc.id}`)}
                >
                  <FileText size={48} className="opacity-30"/>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h4 
                      className="text-sm font-semibold text-slate-900 line-clamp-2 cursor-pointer hover:text-[#00B86B] flex-1"
                      onClick={() => navigate(`/documents/${doc.id}`)}
                    >
                      {doc.name}
                    </h4>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={()=>void handleFavorite(doc.id)}
                        className={`p-1 rounded-lg ${doc.isFavorite ? 'text-amber-400' : 'text-slate-300'}`}
                      >
                        <Star size={15} fill={doc.isFavorite ? 'currentColor' : 'none'}/>
                      </button>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={()=> setMenuOpen(menuOpen===doc.id ? null : doc.id)}
                          className="p-1 rounded-lg text-slate-300 hover:text-slate-600"
                        >
                          <MoreVertical size={15}/>
                        </button>
                        {menuOpen === doc.id &&(
                          <div className="absolute right-0 top-8 w-40 bg-white rounded-xl border border-slate-100 shadow-xl z-20 overflow-hidden">
                            <button
                              type="button"
                              onClick={()=> navigate(`/documents/${doc.id}`)}
                              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                            >
                              <ExternalLink size={14}/> Open
                            </button>
                            <button
                              type="button"
                              onClick={()=>void handleRename(doc.id, doc.name)}
                              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                            >
                              <Edit3 size={14}/> Rename
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDelete(doc.id)}
                              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50"
                            >
                            <Trash2 size={14} /> Delete
                          </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-slate-400 mb-3">
                    {formatDate(doc.createdAt)} · {doc.pageCount || '—'} pages · {formatSize(doc.fileSize)}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-xl">
                          <BookOpen size={12}/> {doc.flashcardCount} cards
                        </span>
                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-xl">
                          <HelpCircle size={12}/> {doc.quizCount} quizzes
                        </span>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )
      }

      </div>

    )
}
  
  export default DocumentsPage
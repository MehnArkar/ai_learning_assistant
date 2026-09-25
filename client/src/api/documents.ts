import api from "./axios"

export interface DocumentItem {
    id: string
    name: string
    originalName: string
    fileSize: number
    pageCount: number
    isFavorite: boolean
    flashcardCount: number
    quizCount: number
    status: string
    createdAt: string
}

interface DocumentsResponse {
    success: boolean,
    message: string,
    data: DocumentItem[]
}

interface DocumentResponse{
    success: boolean,
    message: string,
    data: DocumentItem
}

export const getDocuments = async (search?:string, favorite?:boolean) => {
    const { data } = await api.get<DocumentsResponse>(
        '/documents',
        {
            params:{
                search:search || undefined,
                favorite: favorite ? 'true' : undefined
            }
        }
    );
    return data;
}

export const getDocument = async (id:string) =>{
    const {data} = await api.get<DocumentResponse>(`/documents/${id}`)
    return data
}


export const getDocumentFile = async (id:string) =>{
    const {data} = await api.get<Blob>(`/documents/${id}/file`,{responseType:'blob'})
    return data
}

export const uploadDocument = async(name: string, file: File) => {

    const formData = new FormData()
    formData.append('name', name)
    formData.append('file',file)

    const { data } = await api.post<DocumentResponse>(
        '/documents',
        formData,
        {
            headers:{
                'Content-Type':'multipart/form-data'
            }
        }
    )
    return data;
}


export const toggleDocumentFavorite = async (id: string) => {
    const { data } = await api.patch<DocumentResponse>(`/documents/${id}/favorite`)
    return data
}

export const renameDocument = async (id: string, name: string)=>{
    const { data } = await api.patch<DocumentResponse>(`/documents/${id}`);
    return data
}


export const deleteDocument = async (id: string)=>{
    const { data } = await api.delete<DocumentResponse>(`/documents/${id}`);
    return data
}
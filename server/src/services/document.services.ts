import fs from 'fs/promises'
import DocumentModel, { IDocument } from "../models/Document";
import { MIMEType } from 'util';

const formatDocument = (doc: IDocument) => ({
    id: doc._id.toString(),
    name: doc.name,
    originalName: doc.originalName,
    fileSize: doc.fileSize,
    pageCount: doc.pageCount,
    isFavorite: doc.isFavorite,
    flashcardCount: doc.flashcardCount,
    quizCount: doc.quizCount,
    status: doc.status,
    createdAt: doc.createdAt
});


interface CreateDocumentInput{
    userId: string
    name: string
    file: Express.Multer.File
}

export const listDocuments = async (userId: string, search?: string, favorite?: boolean)=>{
    const filter: Record<string, unknown> = {userId}

    if(favorite){
        filter.isFavorite = true
    }

    if(search?.trim()){
        filter.name = { $regex: search.trim(), $options:'i'} 
    }

    const docs = await DocumentModel.find(filter).sort({ createdAt:-1})
    return docs.map(formatDocument)
}

export const createDocument = async (input: CreateDocumentInput)=>{
    const doc = await DocumentModel.create({
        userId: input.userId,
        name: input.name,
        originalName: input.file.originalname,
        fileName: input.file.filename,
        filePath: input.file.path,
        mimeType: input.file.mimetype,
        fileSize: input.file.size
    });

    return formatDocument(doc);
}


export const getDocumentById = async (userId: string, documentId: string) => {
    const doc = await DocumentModel.findOne({_id:documentId,userId});
    if(!doc){
        throw new Error('Document not found')
    }
    return formatDocument(doc)
}

export const getDocumentFile = async (userId:string, documentId:string) =>{
    const doc = await DocumentModel.findOne({_id:documentId,userId})
    if(!doc){
        throw new Error('Document not found')
    }
    return {filePath: doc.filePath, mimeType: doc.mimeType, originalName: doc.originalName}
}

export const toggleFavorite = async (userId: string, documentId: string) => {
    const doc = await DocumentModel.findOne({_id:documentId})
    if(!doc){
        throw new Error('Document not found')
    }

    doc.isFavorite = !doc.isFavorite
    await doc.save()
    return formatDocument(doc)
}


export const renameDocument = async (userId: string, documentId: string, name: string) => {
    const doc = await DocumentModel.findOne({_id:documentId,userId})
    if(!doc){
        throw new Error('Document not found!')
    }

    doc.name = name
    await doc.save()
    return formatDocument(doc)
}


export const deleteDocument = async (userId: string, documentId: string)=>{
    const doc = await DocumentModel.findOne({_id:documentId,userId})
    if(!doc){
        throw new Error('Document not found!')
    }

    try{
        await fs.unlink(doc.filePath)
    } catch {
        // file already missing — still delete the DB row
    }

    await doc.deleteOne();
}




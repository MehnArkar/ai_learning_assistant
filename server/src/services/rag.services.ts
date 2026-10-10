import fs from 'fs/promises'
import { PDFParse } from 'pdf-parse'
import { IDocument } from '../models/Document'
import DocumentChunkModel from '../models/DocumentChunk'
import { embedTexts } from './gemini.services'

const CHUNK_SIZE = 500     // words per chunk
const CHUNK_OVERLAP = 50   // words shared between neighbouring chunks

export const extractPdfText = async (filePath: string) => {
    const buffer = await fs.readFile(filePath)
    const parser = new PDFParse({ data: buffer })

    try {
        const result = await parser.getText()
        return { text: result.text, pageCount: result.total }
    } finally {
        await parser.destroy()
    }
}

export const chunkText = (text: string): string[] => {
    const words = text.split(/\s+/).filter(Boolean)
    const chunks: string[] = []

    for (let start = 0; start < words.length; start += CHUNK_SIZE - CHUNK_OVERLAP) {
        chunks.push(words.slice(start, start + CHUNK_SIZE).join(' '))
        if (start + CHUNK_SIZE >= words.length) break
    }

    return chunks
}

// Extracts, chunks and embeds the PDF once. Later calls are a no-op.
export const ensureDocumentIndexed = async (doc: IDocument) => {
    if (doc.status === 'ready') return

    doc.status = 'processing'
    await doc.save()

    try {
        const { text, pageCount } = await extractPdfText(doc.filePath)
        const chunks = chunkText(text)

        if (chunks.length === 0) {
            throw new Error('This PDF has no extractable text (it may be a scanned image)')
        }

        const embeddings = await embedTexts(chunks, 'RETRIEVAL_DOCUMENT')

        await DocumentChunkModel.deleteMany({ documentId: doc._id })
        await DocumentChunkModel.insertMany(
            chunks.map((chunkText, i) => ({
                documentId: doc._id,
                userId: doc.userId,
                chunkIndex: i,
                text: chunkText,
                embedding: embeddings[i],
            }))
        )

        doc.pageCount = pageCount
        doc.status = 'ready'
        await doc.save()
    } catch (error) {
        doc.status = 'failed'
        await doc.save()
        throw error
    }
}

export const cosineSimilarity = (a: number[], b: number[]) => {
    let dot = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i]
        normA += a[i] * a[i]
        normB += b[i] * b[i]
    }

    if (normA === 0 || normB === 0) return 0
    return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

export const findRelevantChunks = async (documentId: string, question: string, k = 5): Promise<string[]> => {
    const [questionEmbedding] = await embedTexts([question], 'RETRIEVAL_QUERY')
    const chunks = await DocumentChunkModel.find({ documentId }).sort({ chunkIndex: 1 })

    return chunks
        .map((chunk) => ({ text: chunk.text, score: cosineSimilarity(questionEmbedding, chunk.embedding) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, k)
        .map((c) => c.text)
}

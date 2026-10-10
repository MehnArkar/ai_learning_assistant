import mongoose, { Schema, Document as MongooseDocument } from "mongoose";

export interface IDocumentChunk extends MongooseDocument {
    documentId: mongoose.Types.ObjectId
    userId: mongoose.Types.ObjectId
    chunkIndex: number
    text: string
    embedding: number[]
}

const documentChunkSchema = new Schema<IDocumentChunk>(
    {
        documentId: { type: Schema.Types.ObjectId, ref: 'Document', index: true, required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        chunkIndex: { type: Number, required: true },
        text: { type: String, required: true },
        embedding: { type: [Number], required: true },
    },
    {
        timestamps: true
    }
);

const DocumentChunkModel = mongoose.model<IDocumentChunk>('DocumentChunk', documentChunkSchema);

export default DocumentChunkModel;

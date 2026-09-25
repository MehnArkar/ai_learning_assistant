import mongoose, {Schema, Document as MongoooseDocument, mongo} from "mongoose";


export interface IDocument extends MongoooseDocument {
    userId: mongoose.Types.ObjectId
    name: string
    originalName: string
    fileName: string
    filePath: string
    mimeType: string
    fileSize: number
    pageCount: number
    isFavorite: boolean
    flashcardCount: number
    quizCount: number
    status: 'uploaded' | 'processing' | 'ready' | 'failed'
    createdAt: Date
    updatedAt: Date
}


const documentSchema = new Schema<IDocument>(
    {
        userId:{ type: Schema.Types.ObjectId, ref:'User', index: true, required:true},
        name:{ type: String, required:true, trim:true },
        originalName: { type: String, required: true },
        fileName: { type: String, required: true },
        filePath: { type: String, required: true },
        mimeType:{ type:String, required: true },
        fileSize:{ type: Number, required: true},
        pageCount:{ type: Number, default:0},
        isFavorite:{ type: Boolean, default:false},
        flashcardCount:{ type: Number, default:0},
        quizCount: { type: Number, default: 0 },
        status:{
            type:String,
            enum:['uploaded', 'processing', 'ready', 'failed'],

        }
    },
    {
        timestamps:true
    }
);


const DocumentModel = mongoose.model<IDocument>('Document', documentSchema);

export default DocumentModel;
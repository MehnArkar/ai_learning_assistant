import mongoose, { Schema,Document as MongoooseDocument} from "mongoose";

export interface IChatMessage extends MongoooseDocument{
    documentId: mongoose.Types.ObjectId
    userId: mongoose.Types.ObjectId
    role: 'user' | 'ai'
    text: string
    createdAt: Date
    updatedAt: Date

}

const chatMessageSchema = new Schema<IChatMessage>(
    {
        documentId:{type:Schema.Types.ObjectId, ref:'Document', index:true, required:true},
        userId:{type:Schema.Types.ObjectId, ref: 'User', index: true, required: true},
        role:{type:String, enum:['user', 'ai'], required:true},
        text: {type:String, required: true}
    },
    {
        timestamps:true
    }
)

const ChatMessageModel = mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);

export default ChatMessageModel;
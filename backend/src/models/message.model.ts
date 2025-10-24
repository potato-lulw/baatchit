import mongoose, { Document, Schema } from "mongoose";

export interface MessageDocument extends Document {
    sender: mongoose.Types.ObjectId;
    content?: string;
    chatId: mongoose.Types.ObjectId;
    image?: string;
    replayTo: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<MessageDocument>({
    sender: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    content: { type: String, default: null },
    chatId: { type: Schema.Types.ObjectId, required: true, ref: 'Chat' },
    image: { type: String, default: null },
    replayTo: { type: Schema.Types.ObjectId, default: null, ref: 'Message' },
}, {
    timestamps: true,
})

const Message = mongoose.model<MessageDocument>('Message', messageSchema);
export default Message
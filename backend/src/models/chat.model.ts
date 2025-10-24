import mongoose, { Document, Schema } from "mongoose";

export interface ChatDocument extends Document {
    participants: mongoose.Types.ObjectId[];
    lastMessage: mongoose.Types.ObjectId;
    isGroup: boolean;
    groupName: string;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const chatSchema = new Schema<ChatDocument>({
    participants: [{ type: Schema.Types.ObjectId, required: true, ref: 'User' }],
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
    isGroup: { type: Boolean, default: false },
    groupName: { type: String, default: null },
    createdBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
}, {
    timestamps: true,
})

const Chat = mongoose.model<ChatDocument>('Chat', chatSchema);
export default Chat
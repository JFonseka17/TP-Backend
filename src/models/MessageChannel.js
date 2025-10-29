import mongoose from "mongoose";

const MessageChannelSchema = new mongoose.Schema (
    {
        id_channel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Channel',
            required: true
        },
        id_sender:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: {
            type: String,
            required:true
        },
        created_at: {
            type: Date,
            default: Date.now,
            required: true
        }
    }
)

const  MessageChannel = mongoose.model ('MessageChannel', MessageChannelSchema)

export default MessageChannel
import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema (
    {
        name: {
            type: String,
            require: true
        },
        url_image: {
            type: String
        },
        created_at: {
            type: Date,
            default: Date.now,
            require: true
        },
        modified_at: {
            type: Date,
            default: null
        },
        active: {
            type: Boolean,
            default: true,
            require: true
        }
    }
)

const Workspace = mongoose.model('Workspace', workspaceSchema)

export default Workspace
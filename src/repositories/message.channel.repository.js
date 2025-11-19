import MessageChannel from "../models/MessageChannel.js"

class MessageChannelRepository {

    static async create(channel_id, sender_member_id, content) {
        try {
            const newMessage = await MessageChannel.create({
                channel_id: channel_id,
                sender_member_id: sender_member_id,
                content: content
            })
            return newMessage
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo crear el mensaje', error)
            throw error
        }
    }
    static async deleteById(message_id) {
        try {
            const response = await MessageChannel.findByIdAndDelete(message_id)
            return response
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo eliminar el mensaje con id' + channelmessage_id, error)
            throw error
        }
    }

    static async updateById(message_id, update_message) {
        try {
            const message_update =await MessageChannel.findByIdAndUpdate(
                message_id,
                update_message
            )
            return message_update
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo actualizar el mensaje con id ' + messagechannel_id, error)
            throw error
        }
    }

    static async getAll() {
        try {
            const messages = await MessageChannel.find()
            return messages
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo obtener la lista de mensajes', error)
            throw error
        }
    }

    static async getById(message_id) {
        try {
            const message_found = await MessageChannel.findById(message_id)
            return message_found
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo obtener el miembro con id ' + messagechannel_id, error)
            throw error
        }
    }

    static async getAllByChannelId(channel_id) {
        try {
            const messages = await MessageChannel.find({ channel_id: channel_id })
                .populate({
                    path: 'sender_member_id',
                    populate: {
                        path: 'id_user',
                        model: 'User',
                        select: 'name _id'
                    }
                })

            const messages_formatted = messages.map(
                (message) => {
                    return {
                        _id: message._id,
                        message_content: message.content,
                        member_id: message.sender_member_id._id,
                        user_name: message.sender_member_id.id_user.name,
                        message_created_at: message.created_at
                    }
                }
            )

            return messages_formatted
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo obtener los mensajes del canal ' + channel_id, error)
            throw error
        }
    }
}

export default MessageChannelRepository
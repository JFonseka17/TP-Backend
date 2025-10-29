import MessageChannel from "../models/MessageChannel.js"

class MessageChannelRepository {

    static async create(id_channel, id_sender, content) {
        try {
            await MessageChannel.insertOne({
                id_channel: id_channel,
                id_sender: id_sender,
                content: content
            })
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo crear el mensaje', error)
            throw error
        }
    }
    static async deleteById(channelmessage_id) {
        try {
            const response = await MessageChannel.findByIdAndDelete(channelmessage_id)
            return response
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo eliminar el mensaje con id' + channelmessage_id, error)
            throw error
        }
    }

    static async updateById(messagechannel_id, update_channel) {
        try {
            await MessageChannel.findByIdAndUpdate(
                messagechannel_id,
                update_channel
            )
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo actualizar el mensaje con id ' + messagechannel_id, error)
            throw error
        }
    }

    static async getAll() {
        try {
            const channelmessages = await MessageChannel.find()
            return channelmessages
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo obtener la lista de mensajes', error)
            throw error
        }
    }

    static async getById(messagechannel_id) {
        try {
            const message_found = await MessageChannel.findById(messagechannel_id)
            return message_found
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo obtener el miembro con id ' + messagechannel_id, error)
            throw error
        }
    }
}

export default MessageChannelRepository
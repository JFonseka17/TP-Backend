import Channel from "../models/Channel.model.js"

class ChannelRepository {

    static async create(workspace_id,name) {
        try {
            await Channel.insertOne({
                id_workspace: workspace_id,
                name: name
            })
            console.log('[SERVER]: canal creado exitosamente')
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo crear el canal', error)
            throw error
        }
    }
    static async deleteById (channel_id){
        try {
            const response = await Channel.findByIdAndDelete(channel_id)
            return response
        } 
        catch (error) {
            console.error ('[SERVER ERROR]: No se pudo eliminar el canal con id' + channel_id, error)
            throw error
        }
    }

    static async updateById (channel_id, update_channel) {
        try {
            await Channel.findByIdAndUpdate (
                channel_id,
                update_channel
            )
        } 
        catch (error) {
            console.error ('[SERVER ERROR]: No se pudo actualizar el Miembro con id ' + channel_id, error)
            throw error
        }
    }

    static async getAll () {
        try {
            const channel_found = await Channel.find ()
            return channel_found
        } 
        catch (error) {
            console.error ('[SERVER ERROR]: No se pudo obtener la lista de canales', error)
            throw error
        }
    }

    static async getById (channel_id) {
        try {
            const channel_found = await Channel.findById (channel_id)
            return channel_found
        } 
        catch (error) {
            console.error ('[SERVER ERROR]: No se pudo obtener el miembro con id ' + channel_id, error)
            throw error
        }
    }
}

export default ChannelRepository
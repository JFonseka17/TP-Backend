'use strict'

/**
 * Servicio de borrado que reutiliza los repositories existentes:
 * - src/repositories/message.channel.repository.js
 * - src/repositories/channel.repository.js
 * - src/repositories/workspace.repository.js
 *
 * Comportamiento:
 * - deleteMessage: usa MessageRepository.deleteById(message_id)
 * - deleteChannel: usa ChannelRepository.deleteById(channel_id) y borra mensajes asociados
 * - deleteWorkspace: usa WorkspaceRepository.deleteById(workspace_id) y borra canales/mensajes asociados
 *
 * Si un repository expone deleteMany se usa; si no, se usa el modelo MessageChannel/Channel para el borrado masivo.
 */

import MessageRepository from '../repositories/message.channel.repository.js'
import ChannelRepository from '../repositories/channel.repository.js'
import WorkspaceRepository from '../repositories/workspace.repository.js'

import MessageChannel from '../models/MessageChannel.js'
import ChannelModel from '../models/Channel.model.js' // fallback para deleteMany si repository no lo tiene

/**
 * deleteMessage - elimina un mensaje por id
 * params: { workspace_id, channel_id, message_id }
 * devuelve true si eliminó, null si no existe
 */
export async function deleteMessage({ params }) {
    const { message_id } = params
    try {
        if (!message_id) return null

        // Preferir el repository
        if (MessageRepository && typeof MessageRepository.deleteById === 'function') {
            const resp = await MessageRepository.deleteById(message_id)
            return resp ? true : null
        }

        // Fallback directo con el modelo
        const deleted = await MessageChannel.findByIdAndDelete(message_id)
        return deleted ? true : null
    } catch (err) {
        throw err
    }
}

/**
 * deleteChannel - elimina un canal y sus mensajes asociados
 * params: { workspace_id, channel_id }
 */
export async function deleteChannel({ params }) {
    const { workspace_id, channel_id } = params
    try {
        if (!channel_id) return null

        // Usar repository para borrar el canal
        if (ChannelRepository && typeof ChannelRepository.deleteById === 'function') {
            const resp = await ChannelRepository.deleteById(channel_id)
            if (!resp) return null

            // Borrar mensajes asociados (preferir repository.deleteMany si existe)
            if (MessageRepository && typeof MessageRepository.deleteMany === 'function') {
                await MessageRepository.deleteMany({ channel_id, workspace_id })
            } else {
                await MessageChannel.deleteMany({ channel_id, workspace_id })
            }

            return true
        }

        // Fallback manual: comprobar existencia y borrar
        const channel = await ChannelModel.findOne({ _id: channel_id, workspace_id })
        if (!channel) return null

        await MessageChannel.deleteMany({ channel_id, workspace_id })
        await ChannelModel.deleteOne({ _id: channel_id, workspace_id })
        return true
    } catch (err) {
        throw err
    }
}

/**
 * deleteWorkspace - elimina workspace y todo lo asociado (canales + mensajes)
 * params: { workspace_id }
 */
export async function deleteWorkspace({ params }) {
    const { workspace_id } = params
    try {
        if (!workspace_id) return null

        // Usar repository para borrar workspace
        if (WorkspaceRepository && typeof WorkspaceRepository.deleteById === 'function') {
            const resp = await WorkspaceRepository.deleteById(workspace_id)
            if (!resp) return null

            // Borrar canales y mensajes asociados
            if (ChannelRepository && typeof ChannelRepository.deleteMany === 'function') {
                await ChannelRepository.deleteMany({ workspace_id })
            } else {
                await ChannelModel.deleteMany({ workspace_id })
            }

            if (MessageRepository && typeof MessageRepository.deleteMany === 'function') {
                await MessageRepository.deleteMany({ workspace_id })
            } else {
                await MessageChannel.deleteMany({ workspace_id })
            }

            return true
        }

        // Fallback manual
        const wsExists = await ChannelModel.db.collection('workspaces').findOne({ _id: workspace_id }) // minimal check
        if (!wsExists) return null

        await MessageChannel.deleteMany({ workspace_id })
        await ChannelModel.deleteMany({ workspace_id })
        await ChannelModel.db.collection('workspaces').deleteOne({ _id: workspace_id })
        return true
    } catch (err) {
        throw err
    }
}
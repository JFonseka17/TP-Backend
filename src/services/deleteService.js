import MessageRepository from '../repositories/message.channel.repository.js'
import ChannelRepository from '../repositories/channel.repository.js'
import WorkspaceRepository from '../repositories/workspace.repository.js'
import MessageChannel from '../models/MessageChannel.js'
import ChannelModel from '../models/Channel.model.js'

export async function deleteMessage({ params }) {
    const { message_id } = params
    try {
        if (!message_id) return null

        if (MessageRepository && typeof MessageRepository.deleteById === 'function') {
            const resp = await MessageRepository.deleteById(message_id)
            return resp ? true : null
        }

        const deleted = await MessageChannel.findByIdAndDelete(message_id)
        return deleted ? true : null
    } catch (err) {
        throw err
    }
}

export async function deleteChannel({ params }) {
    const { workspace_id, channel_id } = params
    try {
        if (!channel_id) return null

        if (ChannelRepository && typeof ChannelRepository.deleteById === 'function') {
            const resp = await ChannelRepository.deleteById(channel_id)
            if (!resp) return null

            if (MessageRepository && typeof MessageRepository.deleteMany === 'function') {
                await MessageRepository.deleteMany({ channel_id, workspace_id })
            } else {
                await MessageChannel.deleteMany({ channel_id, workspace_id })
            }

            return true
        }

        const channel = await ChannelModel.findOne({ _id: channel_id, workspace_id })
        if (!channel) return null

        await MessageChannel.deleteMany({ channel_id, workspace_id })
        await ChannelModel.deleteOne({ _id: channel_id, workspace_id })
        return true
    } catch (err) {
        throw err
    }
}

export async function deleteWorkspace({ params }) {
    const { workspace_id } = params
    try {
        if (!workspace_id) return null

        if (WorkspaceRepository && typeof WorkspaceRepository.deleteById === 'function') {
            const resp = await WorkspaceRepository.deleteById(workspace_id)
            if (!resp) return null

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
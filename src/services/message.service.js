import MessageChannelRepository from "../repositories/message.channel.repository.js"

class MessageService {

    static async create (channel_id, member_id, content) {

        const message_created = await MessageChannelRepository.create(channel_id, member_id, content)

        const messages = await MessageChannelRepository.getAllByChannelId(channel_id)

        return {
            messages: messages,
            message_created: message_created
        }
    }

    static async getAllByChannelId(channel_id) {
        const messages = await MessageChannelRepository.getAllByChannelId(channel_id)
        return {
            messages: messages
        }
    }

}

export default MessageService
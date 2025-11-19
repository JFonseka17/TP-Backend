import MessageService from "../services/message.service.js"
import { ServerError } from "../error.js"

class MessagesController {

    static async create(request, response) {
        try {
            const { channel_selected, member, user } = request
            const { content } = request.body

            const {messages, message_created} = await MessageService.create(channel_selected._id, member._id, content)

            response.status(201).json({
                status: 201,
                ok: true,
                message: 'Mensaje creado con exito',
                data: {
                    message: messages,
                    message_created: message_created
                }
            })
        }
        catch (error) {
            if (error.status) {
                return response.status(error.status).json({
                    ok: false,
                    message: error.message,
                    status: error.status
                })
            }
            else {
                console.error(
                    'ERROR AL CREAR EL MENSAJE', error
                )
                return response.status(500).json({
                    ok: false,
                    message: 'Error interno del servidor',
                    status: 500
                })
            }
        }
    }

    static async getAllByChannelId(request, response) {
        try {
            const { channel_selected, member } = request

            const {messages} = await MessageService.getAllByChannelId(channel_selected._id)

            response.status(200).json({
                status: 200,
                ok: true,
                message: 'Mensajes obtenidos con exito',
                data: {
                    messages: messages
                }
            })
        } 
        catch (error) {
            if (error.status) {
                return response.status(error.status).json({
                    ok: false,
                    message: error.message,
                    status: error.status
                })
            }
            else {
                console.error(
                    'ERROR AL CREAR EL MENSAJE', error
                )
                return response.status(500).json({
                    ok: false,
                    message: 'Error interno del servidor',
                    status: 500
                })
            }
        }
    } 
}

export default MessagesController
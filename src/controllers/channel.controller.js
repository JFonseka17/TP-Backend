import ChannelService from "../services/channel.service.js"

class ChannelController {

    static async create(request, response) {
        try {
            const { workspace_selected } = request
            const { name, url_img } = request.body

            if (!name) {
                return response.status(400).json({
                    ok: false,
                    message: 'El nombre del canal es requerido',
                });
            }

            const channel_created = await ChannelService.create(workspace_selected._id, name, url_img)

            response.status(201).json(
                {
                    status: 201,
                    ok: true,
                    message: 'Canal creado con exito',
                    data:
                    {
                        channel_created: channel_created
                    }
                }
            )
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
                    'ERROR AL CREAR EL CANAL', error
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

export default ChannelController
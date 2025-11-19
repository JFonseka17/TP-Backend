import ChannelService from "../services/channel.service.js"
import WorkspaceService from "../services/workspace.service.js"


class WorkspaceController {
    static async getAll(request, response) {
        try {
            const user = request.user

            const workspaces = await WorkspaceService.getAll(user.id)
            
            response.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: 'Workspaces obtenidos con exito',
                    data: {
                        workspaces: workspaces
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
                    'ERRROR AL OBTENER LOS WORKSPACES', error
                )
                return response.status(500).json({
                    ok:false,
                    message: 'Error interno del servidor',
                    status:500
                })
            }
        }

    }

    static async create (request, response){
        try{
            const user = request.user
            const {name, url_img} = request.body

            const workspace_created = await WorkspaceService.create( user.id, name, url_img )

            response.status(201).json(
                {
                    status: 201,
                    ok: true,
                    message: 'Workspace creado con exito',
                    data: {
                        workspace_created
                    }
                }
            )
        }
        catch(error){
            if(error.status){
                return response.status(error.status).json({
                    ok:false,
                    message: error.message,
                    status: error.status
                })
            }
            else{
                console.error(
                    'ERROR AL OBTENER LOS WORKSPACES', error
                )
                return response.status(500).json({
                    ok: false,
                    message: 'Error interno del servidor',
                    status: 500
                })
            }
        }
    }

    static async invite (request, response,){
        try {

            const {member, workspace_selected, user} = request
            const {email_invited, role_invited} = request.body

            await WorkspaceService.invite(member, workspace_selected,user, email_invited, role_invited)

            response.json(
                {
                    ok: true,
                    message: 'Invitación enviada correctamente',
                    status: 200
                }
            )

        } 
        catch (error) {
            if(error.status){
                return response.status(error.status).json({
                    ok:false,
                    message: error.message,
                    status: error.status
                })
            }
            else{
                console.error(
                    'ERROR AL INVITAR', error
                )
                return response.status(500).json({
                    ok: false,
                    message: 'Error interno del servidor',
                    status: 500
                })
            }
        }
    }


    static async getById (request, response){
        try{
            const {workspace_selected, member, user} = request
            const channels = await ChannelService.getAllByWorkspaceId(workspace_selected._id)
            response.json(
                {
                    ok:true, 
                    status: 200,
                    message: 'Espacio de trabajo obtenido',
                    data: {
                        workspace_detail: workspace_selected,
                        channels: channels
                    }
                }
            )
        }
        catch(error){
            if(error.status){
                return response.status(error.status).json({
                    ok:false,
                    message: error.message,
                    status: error.status
                })
            }
            else{
                console.error(
                    'ERROR AL obtener detalles del workspace', error
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

export default WorkspaceController
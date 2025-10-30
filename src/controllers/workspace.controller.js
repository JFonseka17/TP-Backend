import WorkspaceRepository from "../repositories/workspace.repository.js"
import WorkspaceService from "../services/workspace.service.js"


class workspaceController {
    static async getAll(request, response) {
        try {
            /* const workspaces = await WorkspaceService.getAll() */
            console.log(request.user)
            response.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: 'Workspaces obtenidos con exito',
                    data: {
                        /* workspaces: workspaces */
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
}

export default workspaceController
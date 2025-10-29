import WorkspaceRepository from "../repositories/workspace.repository.js"

class workspaceController {
    static async getAll (request, response){
        const workspaces = await WorkspaceRepository.getAll()

        response.send (
            {
                workspaces: workspaces
            }
        )
    }
}

export default workspaceController
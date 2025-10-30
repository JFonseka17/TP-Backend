import Workspace from "../models/Workspace.model.js";

class WorkspaceRepository {

    static async create (name, url_image) {
        try {
            return await Workspace.insertOne ({
                name: name,
                url_image: url_image
            })
        } 
        catch (error) {
            console.error ('[SERVER ERROR]: No se pudo crear el workspace', error )
            throw error
        }
    }

    static async deleteById (workspace_id){
        try {
            const response = await Workspace.findByIdAndDelete(workspace_id)
            return response
        } 
        catch (error) {
            console.error ('[SERVER ERROR]: No se pudo eliminar el workspace con id' + workspace_id, error)
            throw error
        }
    }

    static async updateById (workspace_id, update_workspace) {
        try {
            await Workspace.findByIdAndUpdate (
                workspace_id,
                update_workspace
            )
        } 
        catch (error) {
            console.error ('[SERVER ERROR]: No se pudo actualizar el workspace con id ' + workspace_id, error)
            throw error
        }
    }

    static async getAll () {
        try {
            const Workspaces = await Workspace.find ({ active: true })
            return Workspaces
        } 
        catch (error) {
            console.error ('[SERVER ERROR]: No se pudo obtener la lista de workspaces', error)
            throw error
        }
    }

    static async getById (workspace_id) {
        try {
            const workspace_found = await Workspace.findById (workspace_id)
            return workspace_found
        } 
        catch (error) {
            console.error ('[SERVER ERROR]: No se pudo obtener el workspace con id ' + workspace_id, error)
            throw error
        }
    }
}

export default WorkspaceRepository
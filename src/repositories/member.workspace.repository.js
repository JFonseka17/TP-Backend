import MemberWorkspace from "../models/MemberWorkspace.model.js";

class MemberWorkspaceRepository {

    static async create (user_id, workspace_id, role) {
        try {
            await MemberWorkspace.insertOne ({
                user_id: user_id,
                workspace_id: workspace_id,
                role: role
            })
        } 
        catch (error) {
            console.error ('[SERVER ERROR]: No se pudo crear el miembro', error )
            throw error
        }
    }

    static async deleteById (member_id){
        try {
            const member_delete = await MemberWorkspace.findByIdAndDelete(member_id)
            return member_delete
        } 
        catch (error) {
            console.error ('[SERVER ERROR]: No se pudo eliminar el miembro con id' + member_id, error)
            throw error
        }
    }

    static async updateById (member_id, update_memberworkspace) {
        try {
            await MemberWorkspace.findByIdAndUpdate (
                member_id,
                update_memberworkspace
            )
        } 
        catch (error) {
            console.error ('[SERVER ERROR]: No se pudo actualizar el Miembro con id ' + member_id, error)
            throw error
        }
    }

    static async getAll () {
        try {
            const members = await MemberWorkspace.find ()
            return members
        } 
        catch (error) {
            console.error ('[SERVER ERROR]: No se pudo obtener la lista de Miembros', error)
            throw error
        }
    }

    static async getById (member_id) {
        try {
            const member_found = await MemberWorkspace.findById (member_id)
            return member_found
        } 
        catch (error) {
            console.error ('[SERVER ERROR]: No se pudo obtener el miembro con id ' + member_id, error)
            throw error
        }
    }
}

export default MemberWorkspaceRepository
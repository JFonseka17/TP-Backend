import MemberWorkspace from "../models/MemberWorkspace.model.js";

class MemberWorkspaceRepository {

    static async create (user_id, workspace_id, role) {
        try {
            await MemberWorkspace.insertOne ({
                id_user: user_id,
                id_workspace: workspace_id,
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

    static async getAllByUserId (user_id) {
        try {
            const members = await MemberWorkspace.find ({ id_user: user_id }).populate('id_workspace')

            const members_list_formated = members.map(
                (member) => {
                    return {
                        worspace_id: member.id_workspace._id,
                        workspace_name: member.id_workspace.name,
                        workspace_created_at: member.id_workspace.created_at,
                        workspace_url_image: member.id_workspace.url_image,
                        member_id: member._id,
                        member_user_id: member.id_user,
                        member_role: member.role
                    }
                }
            )
            return members_list_formated
        } 
        catch (error) {
            console.error ('[SERVER ERROR]: No se pudo obtener la lista de Miembros', error)
            throw error
        }
    }

}

export default MemberWorkspaceRepository
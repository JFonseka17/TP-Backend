import MemberWorkspaceRepository from "../repositories/member.workspace.repository.js"

class WorkspaceService {

    static async getAll(user_id) {
        MemberWorkspaceRepository.getAllByUserId(user_id)
    }
}

export default WorkspaceService
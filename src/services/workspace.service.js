import MemberWorkspaceRepository from "../repositories/member.workspace.repository.js"
import UserRepository from "../repositories/user.repository.js"
import WorkspaceRepository from "../repositories/workspace.repository.js"
import { ServerError } from "../error.js"
import jwt from 'jsonwebtoken'
import mailTransporter from "../config/mailTransporter.config.js"
import ENVIRONMENT from "../config/environment.config.js"

class WorkspaceService {

    static async getAll(user_id) {
        const members = await MemberWorkspaceRepository.getAllByUserId(user_id)
        return members
    }

    static async create(user_id, name, url_image) {

        console.log(user_id, name, url_image)
        const workspace_created = await WorkspaceRepository.create(name, url_image)

        await MemberWorkspaceRepository.create(user_id, workspace_created._id, 'admin')

        return workspace_created
    }

    static async invite(member, workspace_selected,user, email_invited, role_invited) {
        
        const user_invited = await UserRepository.getByEmail(email_invited)

        if (!user_invited) {
            throw new ServerError (404, 'No existe el usuario')
        }

        const already_member = await MemberWorkspaceRepository.getByUserIdAndWorkspaceId(user_invited._id, workspace_selected._id)

        if (already_member) {
            throw new ServerError(400, 'El usuario ya es miembro del workspace')
        }

        const tokenPayload = {
            id_invited: user_invited._id,
            id_inviter: member._id,
            id_workspace: workspace_selected._id,
            invited_role: role_invited,
            expiresIn: '7d'
        }

        const invitation_token = jwt.sign(
            tokenPayload,
            ENVIRONMENT.JWT_SECRET,
            {
                expiresIn: tokenPayload.expiresIn
            }
        )

        const emailSubject =
            `
            Invitación al workspace: ${workspace_selected.name}
            `
        const emailHtml =
            `
            <h1>Has sido invitado al workspace: ${workspace_selected.name}</h1>
            <p>Te ha invitado: ${user.name || user.email}</p>
            <a href="${ENVIRONMENT.URL_BACKEND}/api/member/confirm/${invitation_token}">Aceptar invitación</a>
            <p>Este enlace expirará en 24 horas.</p>
            `

        await mailTransporter.sendMail(
            {
                to: email_invited,
                from: ENVIRONMENT.GMAIL_USER,
                subject: emailSubject,
                html: emailHtml
            }
        )
    }

}

export default WorkspaceService
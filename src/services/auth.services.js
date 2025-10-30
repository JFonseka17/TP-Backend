import ENVIRONMENT from "../config/environment.config.js";
import mailTransporter from "../config/mailTransporter.config.js";
import { ServerError } from "../error.js";
import UserRepository from "../repositories/user.repository.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


class AuthService {
    static async register (email, password,name) {

        console.log(email, password, name)
        const user = await UserRepository.getByEmail (email)
        if (user) {
            throw new ServerError(400, 'Email ya en uso')
        }

        const password_hashed = await bcrypt.hash (password, 12)

        const user_created = await UserRepository.create (name, email, password_hashed)

        const user_id_created = user_created._id

        const verification_token = jwt.sign (
            {
                user_id: user_id_created
            },
            ENVIRONMENT.JWT_SECRET
        )
        await mailTransporter.sendMail ({
            from: ENVIRONMENT.GMAIL_USER,
            to: email,
            subject: 'Verifica tu cuenta de mail',
            html: `
            <h1>Verifica tu cuenta de mail</h1>
            <a href="${ENVIRONMENT.URL_BACKEND}/api/auth/verify-email/${verification_token}">Verificar</a>
            `
        })
        return
    }

    static async verifyEmail(verification_token) {
        try {
            const payload = jwt.verify(
                verification_token,
                ENVIRONMENT.JWT_SECRET
            )
            const { user_id } = payload
            if (!user_id) {
                throw new ServerError(400, 'Accion denegada, token con datos insuficientes')
            }
            const user_found = await UserRepository.getById(user_id)
            if(!user_found){
                throw new ServerError(404, 'Usuario no encontrado')
            }
            if(user_found.verified_email){
                throw new ServerError(400, 'Usuario ya validado')
            }
            await UserRepository.updateById(user_id, {verified_email: true})
            return
        }
        catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new ServerError(400, 'Accion denegada, token invalido')
            }
            throw error
        }
    }

    static async login (email, password){
        const user_found = await UserRepository.getByEmail (email)
        if(!user_found){
            throw new ServerError(404, 'Usuario no encontrado')
        }
        if(!user_found.verified_email){
            throw new ServerError(401, 'Usuario con email no verificado')
        }
        const password_valid = await bcrypt.compare (password, user_found.password)
        if(!password_valid){
            throw new ServerError(401, 'Contraseña incorrecta')
        }
        const auth_token = jwt.sign (
            {
                name: user_found.name,
                email: user_found.email,
                id: user_found._id
            },
            ENVIRONMENT.JWT_SECRET,
            {
                expiresIn: '24hs'
            }
        )
        return {
            auth_token: auth_token
        }
    }
}

export default AuthService
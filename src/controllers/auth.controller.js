import ENVIRONMENT from "../config/environment.config.js";
import { ServerError } from "../error.js";
import AuthService from "../services/auth.services.js";

class AuthController {
    static async register (request, response){
        try{
            const { email, password, name } = request.body

            await AuthService.register(email, password, name)
            response.status(201).json({
                ok: true,
                message: 'Usuario registrado con exito',
                status: 201
            })
        }
        catch(error){
            if(error.status){
                response.status(error.status).json({
                    ok:false,
                    message: error.message,
                    status: error.status
                })
            }
            else{
                console.error(
                    'ERROR AL REGISTRAR', error
                )
                response.status(500).json({
                    ok: false,
                    message: 'Error interno del servidor',
                    status: 500
                })
            }
        }
    }

    static async verifyEmail (request, response) {
        try {
            const {verification_token} = request.params
            await AuthService.verifyEmail(verification_token)
            response.redirect(
                ENVIRONMENT.URL_FRONTEND + '/login?from=verified_email'
            )
        } 
        catch(error){
            //Si hay algun fallo reenviar el mail de validacion
            if(error.status){
                response.send(
                    `<h1>${error.message}</h1>`
                )
            }
            else{
                console.error(
                    'ERROR AL REGISTRAR', error
                )
                response.send(
                    `<h1>Error en el servidor, intentelo más tarde</h1>`
                )
            }
        }
    }

    static async login (request, response) {
        try {
            const { email, password } = request.body

            const { auth_token } = await AuthService.login(email, password)

            response.status(200).json(
                {
                    ok: true,
                    message: 'Usuario loguado con exito',
                    status: 200,
                    body: {
                        auth_token
                    }
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
                    'ERROR AL REGISTRAR', error
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

export default AuthController
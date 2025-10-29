import connectionToMongoDB from "./config/configMongoDB.js";
import express, { request, response } from 'express'
import authRouter from "./routes/auth.router.js";
import workspaceRouter from "./routes/workspace.router.js";
import ENVIRONMENT from "./config/environment.config.js";
import mailTransporter from "./config/mailTransporter.config.js";
import cors from 'cors'


connectionToMongoDB()

//  Esta aplicacion nos crea una app de express (Servidor web)

const app = express ()

//  Configuro a mi API como publica, cualquier origen puede hacer peticiones
app.use(cors())

//  POR DEFECTO, nuestra app no esta preparada para recibir JSON en el body
//  configuramos un middleware que permite que el JSON que envien en el body de la consulta se transforme en un objeto JS

app.use(express.json())

//  Todas las consultas que se realizen con /api/auth va a ser gestionada por el authRouter
app.use('/api/auth', authRouter)

app.use('/api/workspace', workspaceRouter)

/* mailTransporter.sendMail(
    {
        from: ENVIRONMENT.GMAIL_USER,
        to: 'Fonseka17.jf@gmail.com',
        subject: 'Mail de prueba',
        html: '<h1>Hola desde Node JS</h1>'
    }
) */

app.listen (
    ENVIRONMENT.PORT || 8080, 
    () => {
    console.log (`Tu servidor se esta ejecutando correctamente en el puerto ${ENVIRONMENT.PORT}`)
    }
) 
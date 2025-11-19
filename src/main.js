import connectionToMongoDB from "./config/configMongoDB.js";
import express, { request, response } from 'express'
import authRouter from "./routes/auth.router.js";
import workspaceRouter from "./routes/workspace.router.js";
import ENVIRONMENT from "./config/environment.config.js";
import cors from 'cors'
import memberRouter from "./routes/member.router.js";


connectionToMongoDB()

const app = express ()

app.use(cors())

app.use(express.json())

app.use('/api/auth', authRouter)

app.use('/api/workspace', workspaceRouter)

app.use('/api/member', memberRouter)

app.listen (
    ENVIRONMENT.PORT || 8080, 
    () => {
    console.log (`Tu servidor se esta ejecutando correctamente en el puerto ${ENVIRONMENT.PORT}`)
    }
) 

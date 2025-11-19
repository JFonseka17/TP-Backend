import mongoose, { connect } from "mongoose";
import ENVIRONMENT from "./environment.config.js";

async function connectionToMongoDB() {
    try {
        const connection_string = ENVIRONMENT.MONGO_DB_CONNECTION_STRING

        await mongoose.connect(connection_string, 
            {
                timeoutMS: 60000,
                socketTimeoutMS: 60000
            }
        )
        console.log("Conexion con DB exitosa!")
    } 
    catch (error) {
        console.log ("[SERVER ERROR]: Fallo en la conexion", error)
    }
}

export default connectionToMongoDB
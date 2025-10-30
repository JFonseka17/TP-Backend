import User from "../models/User.models.js"

class UserRepository {

    static async create(name, email, password) {
        try {
            return await User.insertOne({
                name: name,
                email: email,
                password: password
            })
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo crear el usuario', error)
            throw error
        }
    }

    static async getAll() {
        try {
            const users = await User.find(
                {
                    active: true
                }
            )
            return users
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo obtener la lista de usuarios', error)
            throw error
        }
    }

    static async getById(user_id) {
        try {
            const user_found = await User.findById(user_id)
            return user_found
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo obtener el usuario con id ' + user_id, error)
            throw error
        }
    }

    static async getByEmail(email) {
        try {
            const user_found = await User.findOne({
                email: email,
                active: true
            })
            return user_found
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo obtener el usuario con el email ' + email, error)
            throw error
        }
    }

    static async deleteById(user_id) {
        try {
            const response = await User.findByIdAndDelete(user_id)
            return response
        } 
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo eliminar el usuario con id ' + user_id, error)
            throw error
            
        }
    }

    static async updateById(user_id, update_user) {
        try {
            await User.findByIdAndUpdate(
                user_id,
                update_user
            )
        }
        catch (error) {
            console.error('[SERVER ERROR]: No se pudo actualizar el usuario con id ' + user_id, error)
            throw error
        }
    }
}

export default UserRepository
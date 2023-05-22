import mongoose from 'mongoose'
import { app } from './app'
import createHttpError from 'http-errors'

async function start() {
    try {
        if(!process.env.JWT_KEY || !process.env.MONGO_URI){
            throw createHttpError(400, 'env variables not found')
        }
        mongoose.connect(process.env.MONGO_URI)
        console.log("auth DB connected")
        app.listen(3000, () => {
            console.log(`auth server running`)
        })
    }
    catch (error) {
        console.log(error)
    }
}

start()

        
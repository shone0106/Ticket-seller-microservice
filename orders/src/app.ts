import express from 'express'
import { json } from 'body-parser'
import createHttpError from "http-errors"
import cookieSession from "cookie-session"
import { indexOrderRouter } from './routes/index'
import { newOrderRouter } from './routes/new'
import { showOrderRouter } from './routes/show'
import { deleteOrderRouter } from './routes/delete'
import { errorHandler } from '@_tickets/common'


const app = express()
app.set('trust proxy', true)
app.use(json())

app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))

app.use(indexOrderRouter)
app.use(newOrderRouter)
app.use(showOrderRouter)
app.use(deleteOrderRouter)


app.use((req, res, next)=>{
    throw createHttpError(404, 'endpoint not found')
})

app.use(errorHandler)


export { app }
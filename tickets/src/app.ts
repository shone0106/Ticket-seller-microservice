import express from 'express'
import { json } from 'body-parser'
import createHttpError from "http-errors"
import cookieSession from "cookie-session"
import { indexTicketRouter } from './routes'
import { createTicketRouter } from './routes/new'
import { showTicketRouter } from './routes/show'
import { updateTicketRouter } from './routes/update'
import { errorHandler } from "@_tickets/common"


const app = express()
app.set('trust proxy', true)
app.use(json())

app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))

app.use(indexTicketRouter)
app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(updateTicketRouter)


app.use((req, res, next)=>{
    throw createHttpError(404, 'endpoint not found')
})

app.use(errorHandler)


export { app }
import express from 'express'
import { json } from 'body-parser'
import createHttpError from "http-errors"
import cookieSession from "cookie-session"
import { errorHandler } from '@_tickets/common'

import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'
import { currentUserRouter } from './routes/current-user'

const app = express()
app.set('trust proxy', true)
app.use(json())

app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.use((req, res, next)=>{
    throw createHttpError(404, 'endpoint not found')
})

app.use(errorHandler)

export { app }
import { RequestHandler, Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken"
import { Payload } from "../../@types/express";


export const authenticate: RequestHandler<unknown,unknown,unknown,unknown> = async (req, res, next) => {
    try {
        if(!req.session?.jwt){
            throw createHttpError(401, "User not authenticated")
          }
        
        const user = jwt.verify(req.session.jwt, process.env.JWT_KEY!)
        console.log(user)
        req.user = user as Payload
        next()
    } catch(e){
        next(e)
    }   
}
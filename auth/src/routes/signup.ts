import express, { NextFunction, Request, Response } from "express"
import { validateRequest } from "@_tickets/common";
import jwt from "jsonwebtoken"
import { body, validationResult } from "express-validator";
import createHttpError from "http-errors";
import UserModel from "../models/user"

const router = express.Router();

router.post("/api/users/signup",
    [
        body("email").isEmail(),
        body("password")
            .trim()
            .isLength({ min: 4, max: 20})
    ],
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        try{
            
            const { email, password } = req.body
    
            const existingUsername = await UserModel.findOne({ email: email }).exec();
    
            if (existingUsername) throw createHttpError(409, 'Username already taken. Please choose a different one or log in instead.')
    
            const newUser = await UserModel.create({ email, password })

            const userJwt = jwt.sign({
                id: newUser._id,
                email: newUser.email
            }, process.env.JWT_KEY!)

            req.session = {
                jwt: userJwt
            }
    
            res.status(201).json({user: newUser})
        }
        catch(error){   
            next(error)
        }        
    }
)

export { router as signupRouter }
import express, { NextFunction, Request, Response } from "express"
import { validateRequest } from "@_tickets/common";
import { body, validationResult } from "express-validator"
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import bcrypt from "bcrypt"
import UserModel from "../models/user";

const router = express.Router();

router.post("/api/users/signin",
  [
    body("email").isEmail(),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const { email, password } = req.body

      const user = await UserModel.findOne({ email: email }).select("+password").exec()

      if (!user) throw createHttpError(400, "User does not exist")
      if (!await bcrypt.compare(password, user.password)) {
        throw createHttpError(400, "Invalid credentials")
      }

      const userJwt = jwt.sign({
        id: user._id,
        email: user.email
      }, process.env.JWT_KEY!)

      req.session = {
        jwt: userJwt
      }

      res.status(200).json({user})

    }
    catch (error) {
      next(error)
    }

  }
)

export { router as signinRouter }
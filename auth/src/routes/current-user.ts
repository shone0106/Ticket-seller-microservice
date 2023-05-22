import express, { NextFunction, Request, Response } from "express"
import { authenticate } from '@_tickets/common'

const router = express.Router();

router.get("/api/users/currentuser", authenticate, (req: Request, res: Response, next: NextFunction) => {
  
  try {
    const user = req.user
    res.status(200).json({user});
  } catch (error) {
    next(error);
  }
})

export { router as currentUserRouter }
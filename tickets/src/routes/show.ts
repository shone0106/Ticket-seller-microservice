import express, { NextFunction, Request, Response } from "express";
import { authenticate } from "@_tickets/common";
import { body, param } from "express-validator"
import { Ticket } from "../models/ticket"
import createHttpError from "http-errors"

const router = express.Router();

router.get("/api/tickets/:id",[param()],
 authenticate, 
 async (req: Request, res: Response, next: NextFunction) => {

  try{
    const { id } = req.params

    const ticket = await Ticket.findById(id)
  
    if (!ticket) {
      throw createHttpError(404, 'Not found')
    }
  
    res.status(200).send(ticket)
  }
  catch(error){
    next(error)
  }
  
});

export { router as showTicketRouter }; 
import express, { NextFunction, Request, Response, Router } from "express";
import { authenticate } from '@_tickets/common'
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get('/api/tickets', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try{
        const tickets = await Ticket.find({})

        res.status(200).send(tickets)
    }
    catch(error){
        next(error)
    }
    
})


export {router as indexTicketRouter}  
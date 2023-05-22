import express, { NextFunction, Request, Response } from "express";

import mongoose from "mongoose";
import createHttpError from "http-errors";
import { authenticate, validateRequest } from "@_tickets/common";
import { body, validationResult } from "express-validator";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { OrderStatus } from "@_tickets/common";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATON_WINDOW_SECONDS = 1 * 60;

router.post(
  "/api/orders",
  authenticate,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Ticket must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try{
      
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw createHttpError(404, 'Ticket not found')
    }

    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw createHttpError(400, "Ticket is already reserved");
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATON_WINDOW_SECONDS);

    const order = Order.build({
      userId: req.user!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
  catch(error){
    next(error)
  }
});

export { router as newOrderRouter };

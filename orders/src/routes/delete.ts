import express, { NextFunction, Request, Response } from "express";
import { authenticate, OrderStatus } from "@_tickets/common";
import { Order } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";
import createHttpError from "http-errors";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try{
      const { orderId } = req.params;

      const order = await Order.findById(orderId).populate("ticket");
  
      if (!order) {
        throw createHttpError(404, 'Order not found')
      }
  
      if (order.userId != req.user!.id) {
        throw createHttpError(401, 'User not authorized')
      }
  
      order.status = OrderStatus.Cancelled;
      await order.save();
  
      new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
          id: order.ticket.id,
        },
      });
  
      res.status(204).send(order);
    }
    catch(error){
      next(error)
    }
  }
);

export { router as deleteOrderRouter };

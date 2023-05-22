import express, { NextFunction, Request, Response } from "express";
import { authenticate } from "@_tickets/common"
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";
import createHttpError from "http-errors";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try{
      const { orderId } = req.params;
      const order = await Order.findById(orderId).populate("ticket");
  
      if (!order) {
        throw createHttpError(404, 'Order not found')
      }
  
      if (order.userId !== req.user!.id) {
        throw createHttpError(401, 'User not authorized')
      }
      res.status(200).send(order);
    }
    catch(error){
      next(error)
    }
  });

export { router as showOrderRouter };

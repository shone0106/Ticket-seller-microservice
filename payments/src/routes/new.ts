import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import createHttpError from 'http-errors'
import { authenticate, validateRequest, OrderStatus } from "@_tickets/common";
import { stripe } from "../stripe";
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  authenticate,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try{
      const { token, orderId } = req.body;

      const order = await Order.findById(orderId);   
  
      if (!order) {
        throw createHttpError(404, 'Not found')
      }
      if (order.userId !== req.user!.id) {
        throw createHttpError(401, 'User not authorized')
      }
      if (order.status === OrderStatus.Cancelled) {
        throw createHttpError(400, "Cannot pay for an cancelled order");
      }
  
      const charge = await stripe.charges.create({
        currency: "usd",
        amount: order.price * 100,
        source: token,
      });
      const payment = Payment.build({
        orderId,
        stripeId: charge.id,
      });
      await payment.save();
      await new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId,
      });
      
      res.status(201).send({ id: payment.id });
    }
    catch(error){
      next(error)
    }
    
  }
);

export { router as createChargeRouter };

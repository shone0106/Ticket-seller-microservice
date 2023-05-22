import express, { NextFunction, Request, Response } from "express";
import { authenticate } from "@_tickets/common";
import { Order } from "../models/order";
const router = express.Router();

router.get("/api/orders", 
authenticate,
async (req: Request, res: Response, next: NextFunction) => {
  try{
    const orders = await Order.find({
      userId: req.user!.id,
    }).populate("ticket");
  
    res.send(orders );
  }
  catch(error){
    next(error)
  }
  
});

export { router as indexOrderRouter };

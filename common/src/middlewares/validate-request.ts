import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try{
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      throw createHttpError(400, 'Invalid parameters')
    }
    next();
  }
  
  catch(error){
    next(error)
  }
};

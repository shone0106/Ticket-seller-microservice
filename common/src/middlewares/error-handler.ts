import { Request, Response, NextFunction } from "express";
import createHttpError , { isHttpError }from "http-errors"


export const errorHandler = (error: unknown, req: Request, res: Response, next: NextFunction) => {

    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage })
}


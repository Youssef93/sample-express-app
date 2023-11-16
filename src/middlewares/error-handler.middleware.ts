import { NextFunction, Request, Response } from "express";
import { AppError } from "../common/errorFactory";

export const errorHandler =
  (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        statusCode: err.statusCode,
        error: err.message,
        errorDetails: err.errorDetails
      })
    }

    // Replace with proper logger
    console.error(err)
    
    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error'
    })
  }
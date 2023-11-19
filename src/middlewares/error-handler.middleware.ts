import { NextFunction, Request, Response } from 'express';
import { AppError } from 'src/common/errorFactory';
import * as logger from 'src/common/logger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      error: err.message,
      errorDetails: err.errorDetails,
    });
  } else {
    logger.error(err);

    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
    });
  }
};

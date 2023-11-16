import { Request, Response, NextFunction, Handler } from 'express';
import { AppError } from '../common/errorFactory';

export const apiKeyMiddleware: Handler =
  async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key']

    if(!apiKey) {
      throw new AppError(401, 'Unauthorized access')
    }

    await next();
  }
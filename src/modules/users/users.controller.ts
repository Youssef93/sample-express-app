import { Request, Response } from 'express';
import { AppError } from 'src/common/errorFactory';
import * as Logger from 'src/common/logger';

export const createUser = async (req: Request, res: Response): Promise<void> => {
  Logger.info('Request Received');

  if (req.body.first_name === 'Adam') {
    throw new AppError(400, 'Sending custom error', { errorCode: 'NAME_NOT_ALLOWED' });
  }

  if (req.body.first_name === 'Joe') {
    throw new Error('Sending random error');
  }

  res.json({ result: true });
};

import { Request, Response } from 'express';
import { AppError } from '../../common/errorFactory';

export const  createUser = async (req: Request, res: Response) => {
  if(req.body.first_name === 'Adam') {
    throw new AppError(400, 'Sending custom error', { errorCode: 'NAME_NOT_ALLOWED' })
  }

  if(req.body.first_name === 'Joe') {
    throw new Error('Sending random error')
  }

  res.json({ result: true });
}
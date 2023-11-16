import { Request, Response, NextFunction, Handler } from 'express';
import 'zone.js';

let counter = 0

export const zoneJSMiddleware: Handler =
  async (req: Request, res: Response, next: NextFunction) => {
    return new Promise((resolve, reject) => {
      Zone.current.fork({
        name: 'api',
        properties: {
          // read request id from headers
          id: counter
        }
      }).run(async() => {
        counter ++
        await next();
        resolve();
      })
    });
  }
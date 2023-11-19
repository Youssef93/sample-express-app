import 'zone.js';

import { Handler, NextFunction, Request, Response } from 'express';

let counter = 0;

export const zoneJSMiddleware: Handler = async (req: Request, res: Response, next: NextFunction) => {
  return new Promise(resolve => {
    Zone.current
      .fork({
        name: 'api',
        properties: {
          // read request id from headers
          id: counter,
        },
      })
      .run(async () => {
        counter++;
        await next();
        resolve();
      });
  });
};

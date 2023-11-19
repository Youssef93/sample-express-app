import dotenv from 'dotenv';
import express, { Express, Handler } from 'express';

if (process.env.NODE_ENV !== 'production') dotenv.config();

import * as bodyParser from 'body-parser';
import { errorHandler } from 'src/middlewares/error-handler.middleware';
import { validateAJVSchema } from 'src/middlewares/validate-schema.middleware';
import { zoneJSMiddleware } from 'src/middlewares/zonejs.middleware';
import { userRoutes } from 'src/modules/users/users.routes';
import { IRoute } from 'src/routes.types';
import { appendEndpointToSwaggerDoc, writeSwaggerDocument } from 'src/swagger';
import * as swaggerUi from 'swagger-ui-express';

const app: Express = express();

app.use(bodyParser.json());

export const routes: IRoute[] = [...userRoutes];

routes.forEach(route => {
  const allMiddlewares: Handler[] =
    route.middlewares?.map(middleware => {
      return async (req, res, next) => {
        try {
          await middleware(req, res, next);
        } catch (err) {
          next(err);
        }
      };
    }) || [];

  // ZoneJS
  allMiddlewares.push(zoneJSMiddleware);

  // Schema Validation
  allMiddlewares.push(async (req, res, next) => {
    try {
      await validateAJVSchema(req, res, next);
    } catch (err) {
      next(err);
    }
  });

  // Main controller method
  allMiddlewares.push(async (req, res, next) => {
    try {
      await route.controller(req, res, next);
    } catch (err) {
      next(err);
    }
  });

  app[route.method](
    route.endpoint,
    // attach route config
    async (req, res, next) => {
      req.routeConfig = route;
      await next();
    },

    ...allMiddlewares,
  );

  appendEndpointToSwaggerDoc(route);
});

// if env is not production, add swagger docs
if (process.env.NODE_ENV !== 'production') {
  writeSwaggerDocument();
  // Import only if env is not production after file is written
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const swaggerDocument = require('./swagger-output.json');
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Add global error handler
app.use(errorHandler);

export const server = app;

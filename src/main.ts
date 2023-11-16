import express, { Express, Handler } from 'express';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production')
  dotenv.config();

import { validateAJVSchema } from './middlewares/validate-schema.middleware'
import * as bodyParser from 'body-parser'
import { userRoutes } from './modules/users/users.routes'
import { IRoute } from './routes.types'
import { appendEndpointToSwaggerDoc, writeSwaggerDocument } from './swagger';
import * as swaggerUi from 'swagger-ui-express'
import { errorHandler } from './middlewares/error-handler.middleware';

const app: Express = express();
const port = process.env.PORT;

app.use(bodyParser.json())

export const routes: IRoute[] = [
  ...userRoutes,
]

routes.forEach((route) => {
  const middlewares: Handler[] = []

  route.middlewares?.forEach(middleware => {
    middlewares.push(async (req, res, next) => {
      try {
        await middleware(req, res, next)
      } catch(err) {
        next(err)
      }
    })
  })

  app[route.method](route.endpoint,
    // attach route config
    async (req, res, next) => {
      req.routeConfig = route;
      await next()
    },

    ...middlewares,

    async (req, res, next) => {
      try {
        await validateAJVSchema(req, res, next)
      } catch(err) {
        next(err)
      }
    },

    async (req, res, next) => {
      try {
        await route.controller(req, res, next)
      } catch(err) {
        next(err)
      }
    }
  )

  appendEndpointToSwaggerDoc(route)
})

// if env is not production, add swagger docs
if (process.env.NODE_ENV !== 'production') {
  writeSwaggerDocument()
  const swaggerDocument = require('./swagger-output.json')
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Add global error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

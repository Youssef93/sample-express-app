import { apiKeyMiddleware } from "../../middlewares/api-key.middleware";
import { IRoute, SUPPORTED_SECURITIES } from "../../routes.types";
import * as UserController from './users.controller';
import { createUserResult, createUserSchema } from "./users.schemas";

export const userRoutes: IRoute[] = [
  {
    controller: UserController.createUser,
    method: 'post',
    endpoint: '/users',
    schema: createUserSchema,
    middlewares: [apiKeyMiddleware],
    swagger: {
      responses: {
        201: createUserResult
      },
      security: [SUPPORTED_SECURITIES["Api-Key"]],
      summary: 'hello world'
    }
  }
]
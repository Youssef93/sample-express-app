import { apiKeyMiddleware } from 'src/middlewares/api-key.middleware';
import * as UserController from 'src/modules/users/users.controller';
import { createUserResult, createUserSchema } from 'src/modules/users/users.schemas';
import { IRoute, SUPPORTED_SECURITIES } from 'src/routes.types';

export const userRoutes: IRoute[] = [
  {
    controller: UserController.createUser,
    method: 'post',
    endpoint: '/users',
    schema: createUserSchema,
    middlewares: [apiKeyMiddleware],
    swagger: {
      responses: {
        201: createUserResult,
      },
      security: [SUPPORTED_SECURITIES['Api-Key']],
      summary: 'Create new user',
    },
  },
];

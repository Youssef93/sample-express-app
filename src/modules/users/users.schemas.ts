import { Schema } from 'ajv';
import { IRouteValidationSchema } from 'src/routes.types';

const createUserBody: Schema = {
  type: 'object',
  properties: {
    first_name: { type: 'string', example: 'hello' },
    last_name: { type: 'string' },
    shipping_address: { $ref: '/schemas/address' },
    billing_address: { $ref: '/schemas/address' },
  },
  required: ['first_name', 'last_name', 'shipping_address', 'billing_address'],
  $defs: {
    address: {
      $id: '/schemas/address',
      type: 'object',
      properties: {
        street_address: { type: 'string' },
        city: { type: 'string' },
        state: { $ref: '#/definitions/state' },
      },
      required: ['street_address', 'city', 'state'],

      definitions: {
        state: { enum: ['CA', 'NY', '... etc ...'] },
      },
    },
  },
};

export const createUserSchema: IRouteValidationSchema = {
  body: createUserBody,
};

export const createUserResult: Schema = {
  type: 'object',
  properties: {
    result: {
      type: 'boolean',
      example: true,
    },
  },
};

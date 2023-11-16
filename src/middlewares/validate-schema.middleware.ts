
import Ajv, { AnySchema } from 'ajv';
import { Request, Response, NextFunction, Handler } from 'express';
import { AppError } from '../common/errorFactory';
import { IRoute } from '../routes.types';

const ajv = new Ajv({
  allErrors: true,
  messages: process.env.NODE_ENV !== 'production',
  parseDate: true,
  strict: true,
  useDefaults: true,
  coerceTypes: true,
})

//example keyword is used by swagger doc
ajv.addKeyword({
  keyword: 'example',
  compile: () => data => data
})

const getSchema = (routeConfig: IRoute, schemaSubKey: 'body' | 'params' | 'query') => {
  const key = routeConfig.endpoint + routeConfig.method + schemaSubKey;
  const existingSchema = ajv.getSchema(key)

  if(existingSchema) return existingSchema;

  const schema = ajv.compile(routeConfig.schema?.[schemaSubKey] as AnySchema);

  ajv.addSchema(schema, key)

  return schema;
}

export const validateAJVSchema: Handler =
  async (req: Request, res: Response, next: NextFunction) => {

    const schema = req.routeConfig.schema;

    if (!schema) await next()

    if (schema?.body) {
      const validate = ajv.compile(schema.body)
      if (!validate(req.body)) {
        throw new AppError(400, ajv.errorsText(validate.errors))
      }
    }

    if (schema?.params) {
      const validate = ajv.compile(schema.params)
      if (!validate(req.params)) {
        throw new AppError(400, ajv.errorsText(validate.errors))
      }
    }

    if (schema?.query) {
      const validate = ajv.compile(schema.query)
      if (!validate(req.query)) {
        throw new AppError(400, ajv.errorsText(validate.errors))
      }
    }

    await next();
  }
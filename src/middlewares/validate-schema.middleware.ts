import Ajv from 'ajv';
import { Handler, NextFunction, Request, Response } from 'express';
import { AppError } from 'src/common/errorFactory';

const ajv = new Ajv({
  allErrors: true,
  messages: process.env.NODE_ENV !== 'production',
  parseDate: true,
  strict: true,
  useDefaults: true,
  coerceTypes: true,
});

//example keyword is used by swagger doc
ajv.addKeyword({
  keyword: 'example',
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  compile: () => data => data,
});

export const validateAJVSchema: Handler = async (req: Request, res: Response, next: NextFunction) => {
  const schema = req.routeConfig.schema;

  if (!schema) await next();

  if (schema?.body) {
    const validate = ajv.compile(schema.body);
    if (!validate(req.body)) {
      throw new AppError(400, ajv.errorsText(validate.errors));
    }
  }

  if (schema?.params) {
    const validate = ajv.compile(schema.params);
    if (!validate(req.params)) {
      throw new AppError(400, ajv.errorsText(validate.errors));
    }
  }

  if (schema?.query) {
    const validate = ajv.compile(schema.query);
    if (!validate(req.query)) {
      throw new AppError(400, ajv.errorsText(validate.errors));
    }
  }

  await next();
};

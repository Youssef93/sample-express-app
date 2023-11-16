import { Schema } from "ajv"
import { Handler, RequestHandler } from "express"

export interface IRouteValidationSchema {
  params?: Schema
  body?: Schema
  query?: Schema
}

export enum SUPPORTED_SECURITIES {
  'Api-Key' = 'Api-Key',
  'Authorization' = 'Authorization'
}

export interface ISwaggerParam {
  name: string;
  pathOrQuery: 'path' | 'query'
  required: boolean
}

export interface IRoute {
  method: 'get' | 'put' | 'delete' | 'post' | 'patch'
  controller: RequestHandler<{}, any, any, any, Record<string, any>>
  endpoint: string
  schema?: IRouteValidationSchema
  middlewares?: [Handler]
  swagger?: {
    summary?: string;
    parameters?: ISwaggerParam[];
    responses?: {
      200?: Schema
      201?: Schema
    }
    security?: SUPPORTED_SECURITIES[]
  }
}

declare global {
  namespace Express {
    export interface Request {
      routeConfig: IRoute;
    }
  }
}
import { IRoute } from "./routes.types"
import * as fs from 'fs'
import * as path from 'path'

const paths: any = {}
const schemas: any = {
  "badRequestResponse": {
    "type": "object",
    "properties": {
      "statusCode": {
        "type": "number",
        "description": "The http status of the error code in response",
        "example": 400
      },
      "error": {
        "type": "string",
        "description": "A string with a description of the error",
        "example": "Property is missing"
      }
    },
    "required": [
      "statusCode",
      "error"
    ]
  },
  "gatewayErrorResponse": {
    "type": "object",
    "properties": {
      "message": {
        "type": "string",
        "description": "The error message",
        "example": "Forbidden"
      },
      "error": {
        "type": "string",
        "description": "A string with a description of the error",
        "example": "Property is missing"
      }
    },
    "required": [
      "message",
      "error"
    ]
  },
  "internalErrorResponse": {
    "type": "object",
    "properties": {
      "statusCode": {
        "type": "number",
        "description": "The http status of the error code in response",
        "example": 500
      },
      "error": {
        "type": "string",
        "description": "A string with a description of the error",
        "example": "Internal Server Error"
      }
    },
    "required": [
      "statusCode",
      "error"
    ]
  },
  "notFoundResponse": {
    "type": "object",
    "properties": {
      "statusCode": {
        "type": "number",
        "description": "The http status of the error code in response",
        "example": 404
      },
      "error": {
        "type": "string",
        "description": "A string with a description of the error",
        "example": "Item not found"
      }
    },
    "required": [
      "statusCode",
      "error"
    ]
  }
}

const swaggerDoc = {
  "openapi": "3.1.0",
  paths,
  "info": {
    "title": "Sample Express App",
    "description": "An express app that includes all additional tools",
    "version": "0.0.1",
    "contact": {}
  },
  "tags": [],
  "servers": [
    {
      "url": process.env.BASE_URL
    }
  ],
  "components": {
    "securitySchemes": {
      "Api-Key": {
        "type": "apiKey",
        "in": "header",
        "name": "x-api-key"
      },
      "Authorization": {
        "type": "apiKey",
        "in": "header",
        "name": "authorization"
      }
    },
    schemas
  }
}

export const appendEndpointToSwaggerDoc = (routeConfig: IRoute) => {
  if (!swaggerDoc.paths[routeConfig.endpoint]) swaggerDoc.paths[routeConfig.endpoint] = {}

  swaggerDoc.paths[routeConfig.endpoint][routeConfig.method] = {}
  const functionName = routeConfig.controller.name;

  if (routeConfig.schema) {
    if (routeConfig.schema.body) {
      swaggerDoc.components.schemas[functionName] = routeConfig.schema.body

      swaggerDoc.paths[routeConfig.endpoint][routeConfig.method]['requestBody'] = {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "$ref": `#/components/schemas/${functionName}`
            }
          }
        }
      }
    }

    swaggerDoc.paths[routeConfig.endpoint][routeConfig.method]['responses'] = {
      "403": {
        
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/gatewayErrorResponse"
            }
          }
        }
      },
      "500": {
        
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/internalErrorResponse"
            }
          }
        }
      },
      "400": {
        
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/badRequestResponse"
            }
          }
        }
      },
      "404": {
        
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/notFoundResponse"
            }
          }
        }
      },
    }

    if (!routeConfig.swagger) return;

    if (routeConfig.swagger.parameters) {
      swaggerDoc.paths[routeConfig.endpoint][routeConfig.method]['parameters'] =
        routeConfig.swagger.parameters.map(({ name, pathOrQuery, required }) => ({
          name,
          required,
          in: pathOrQuery,
          "schema": {
            "type": "string"
          }
        }))
    }

    if (routeConfig.swagger.security) {
      swaggerDoc.paths[routeConfig.endpoint][routeConfig.method]['security'] =
        routeConfig.swagger.security.map((security) => {
          const securityObj: any = {}
          securityObj[security] = []
          return securityObj
        })
    }

    if (routeConfig.swagger.summary) {
      swaggerDoc.paths[routeConfig.endpoint][routeConfig.method]['summary'] = routeConfig.swagger.summary
    }

    if (routeConfig.swagger.responses?.[200]) {
      const schemaRefName = `${functionName}_200Response`
      swaggerDoc.components.schemas[schemaRefName] = routeConfig.swagger.responses[200]
      swaggerDoc.paths[routeConfig.endpoint][routeConfig.method]['responses'][200] = {
        
        "content": {
          "application/json": {
            "schema": {
              "$ref": `#/components/schemas/${schemaRefName}`
            }
          }
        }
      }
    }

    if (routeConfig.swagger.responses?.[201]) {
      const schemaRefName = `${functionName}_201Response`
      swaggerDoc.components.schemas[schemaRefName] = routeConfig.swagger.responses[201]
      swaggerDoc.paths[routeConfig.endpoint][routeConfig.method]['responses'][201] = {
        
        "content": {
          "application/json": {
            "schema": {
              "$ref": `#/components/schemas/${schemaRefName}`
            }
          }
        }
      }
    }

  }
}

export const writeSwaggerDocument = () => {
  fs.writeFileSync(path.join(__dirname, 'swagger-output.json'), JSON.stringify(swaggerDoc), 'utf-8')
}
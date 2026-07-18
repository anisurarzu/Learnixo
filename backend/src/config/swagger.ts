import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Learnixo API',
      version: '1.0.0',
      description:
        'Production API for the Learnixo AI Study Assistant. AI & PDF processing endpoints are stubbed for future integration.',
      contact: { name: 'Learnixo' },
    },
    servers: [
      {
        url: `${env.APP_URL}${env.API_PREFIX}`,
        description: env.NODE_ENV,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {},
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  message: { type: 'string' },
                  field: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/**/*.ts', './src/docs/**/*.yaml'],
};

export const swaggerSpec = swaggerJsdoc(options);

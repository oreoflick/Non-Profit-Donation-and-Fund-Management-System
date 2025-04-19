import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Non-Profit Donation and Fund Management System API',
      version: '1.0.0',
      description: 'API documentation for Non-Profit Donation Management System',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              description: 'The name of the user'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'The email address of the user'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'The user password (minimum 8 characters)'
            },
            role: {
              type: 'string',
              enum: ['donor', 'admin'],
              description: 'The user role'
            }
          }
        },
        Project: {
          type: 'object',
          required: ['name', 'goal_amount'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the project'
            },
            name: {
              type: 'string',
              description: 'The name of the project'
            },
            description: {
              type: 'string',
              description: 'The project description'
            },
            goal_amount: {
              type: 'string',
              format: 'decimal',
              description: 'The funding goal amount'
            },
            current_amount: {
              type: 'string',
              format: 'decimal',
              description: 'The current amount raised'
            },
            status: {
              type: 'string',
              enum: ['active', 'completed', 'cancelled'],
              description: 'The project status'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'The date and time when the project was created'
            }
          }
        },
        Donation: {
          type: 'object',
          required: ['projectId', 'amount', 'paymentMethod'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the donation'
            },
            user_id: {
              type: 'integer',
              description: 'ID of the donor'
            },
            project_id: {
              type: 'integer',
              description: 'ID of the project being donated to'
            },
            amount: {
              type: 'string',
              format: 'decimal',
              description: 'The donation amount'
            },
            donation_date: {
              type: 'string',
              format: 'date-time',
              description: 'The date and time of the donation'
            },
            status: {
              type: 'string',
              enum: ['pending', 'completed', 'failed'],
              description: 'The status of the donation'
            },
            payment_method: {
              type: 'string',
              description: 'The method of payment'
            },
            transaction_id: {
              type: 'string',
              description: 'Unique transaction identifier'
            },
            notes: {
              type: 'string',
              description: 'Optional notes for the donation'
            },
            receipt_url: {
              type: 'string',
              nullable: true,
              description: 'URL to the donation receipt if available'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints'
      },
      {
        name: 'Projects',
        description: 'Project management endpoints'
      },
      {
        name: 'Donations',
        description: 'Donation management endpoints'
      }
    ]
  },
  apis: [
    './routes/*.js'
  ]
};

export const specs = swaggerJsdoc(options);
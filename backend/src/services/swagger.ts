export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Documentación de la API",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "User ID",
            },
            username: {
              type: "string",
              description: "User name",
            },
            password: {
              type: "string",
              description: "User password",
            },
            role: {
              type: "string",
              description: "Role of the user",
            },
          },
        },
        Card: {
          type: "object",
          required: ["name", "type", "image", "userId"],
          properties: {
            id: {
              type: "integer",
              description: "ID de la carta",
            },
            name: {
              type: "string",
              description: "Nombre de la carta",
            },
            type: {
              type: "string",
              description: "Rareza de la carta",
            },
            image: {
              type: "string",
              description: "URL de la imagen de la carta",
            },
            description: {
              type: "string",
              description: "Descripción de la carta",
            },
            userId: {
              type: "integer",
              description: "ID del usuario propietario de la carta",
            },
          },
        },
        Trade: {
          type: "object",
          required: [
            "offeredCardId",
            "requestedCardId",
            "offeredUserId",
            "requestedUserId",
          ],
          properties: {
            id: {
              type: "integer",
              description: "ID de la transacción",
            },
            offeredCardId: {
              type: "integer",
              description: "ID de la carta ofrecida",
            },
            requestedCardId: {
              type: "integer",
              description: "ID de la carta solicitada",
            },
            offeredUserId: {
              type: "integer",
              description: "ID del usuario que ofrece la carta",
            },
            requestedUserId: {
              type: "integer",
              description: "ID del usuario que solicita la carta",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

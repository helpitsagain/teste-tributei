import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Teste Técnico Tributei API",
      version: "1.0.0",
      description: "API para gerenciamento de tarefas (To-Do List)",
      contact: {
        name: "Suporte",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Servidor de Desenvolvimento",
      },
    ],
    tags: [
      {
        name: "Health",
        description: "Verificação de status da API",
      },
      {
        name: "To-Dos",
        description: "Operações de gerenciamento de tarefas",
      },
    ],
  },
  // Caminho para os arquivos que contêm as anotações
  apis: ["./src/routes/*.ts", "./src/app.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);

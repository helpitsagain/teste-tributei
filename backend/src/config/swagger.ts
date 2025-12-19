import swaggerJsdoc from "swagger-jsdoc";

const getServers = () => {
  const servers = [];

  // Vercel
  if (process.env.NODE_ENV === "production") {
    servers.push({
      url: process.env.API_URL || "https://teste-tributei-backend.vercel.app/",
      description: "Servidor de Produção",
    });
  }

  // localhost
  if (process.env.NODE_ENV === "development") {
    servers.push({
      url: `http://localhost:${process.env.PORT || 3001}`,
      description: "Servidor de Desenvolvimento",
    });
  }

  return servers;
};

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
    servers: getServers(),
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
    components: {
      schemas: {
        Todo: {
          type: "object",
          required: ["title"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "ID único da tarefa (gerado automaticamente)",
              example: "550e8400-e29b-41d4-a716-446655440000",
            },
            title: {
              type: "string",
              description: "Título da tarefa",
              example: "Estudar Swagger",
            },
            description: {
              type: "string",
              description: "Descrição detalhada da tarefa",
              example: "Aprender a documentar APIs com Swagger",
            },
            completed: {
              type: "boolean",
              description: "Status de conclusão da tarefa",
              default: false,
              example: false,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Data de criação",
              example: "2025-12-19T10:30:00Z",
            },
          },
        },
        TodoInput: {
          type: "object",
          required: ["title"],
          properties: {
            title: {
              type: "string",
              description: "Título da tarefa",
              example: "Minha nova tarefa",
            },
            description: {
              type: "string",
              description: "Descrição da tarefa",
              example: "Descrição detalhada da tarefa",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Mensagem de erro",
              example: "Tarefa não encontrada",
            },
          },
        },
      },
    },
    paths: {
      "/": {
        get: {
          summary: "Verifica se a API está funcionando",
          tags: ["Health"],
          responses: {
            200: {
              description: "API funcionando corretamente",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "API funcionando!" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/items": {
        get: {
          summary: "Lista todas as tarefas",
          tags: ["To-Dos"],
          parameters: [
            {
              in: "query",
              name: "completed",
              schema: { type: "boolean" },
              description: "Filtrar por status de conclusão",
            },
            {
              in: "query",
              name: "page",
              schema: { type: "integer", default: 1 },
              description: "Número da página para paginação",
            },
            {
              in: "query",
              name: "limit",
              schema: { type: "integer", default: 10 },
              description: "Quantidade de itens por página",
            },
          ],
          responses: {
            200: {
              description: "Lista de tarefas retornada com sucesso",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Todo" },
                  },
                },
              },
            },
            500: {
              description: "Erro interno do servidor",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/api/item/new": {
        post: {
          summary: "Cria uma nova tarefa",
          tags: ["To-Dos"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TodoInput" },
              },
            },
          },
          responses: {
            201: {
              description: "Tarefa criada com sucesso",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Todo" },
                },
              },
            },
            400: {
              description: "Dados inválidos",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/api/item/{id}": {
        put: {
          summary: "Atualiza uma tarefa existente",
          tags: ["To-Dos"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "ID único da tarefa",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TodoInput" },
              },
            },
          },
          responses: {
            200: {
              description: "Tarefa atualizada com sucesso",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Todo" },
                },
              },
            },
            404: {
              description: "Tarefa não encontrada",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            400: {
              description: "Dados inválidos",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
        delete: {
          summary: "Remove uma tarefa",
          tags: ["To-Dos"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "ID único da tarefa",
            },
          ],
          responses: {
            200: {
              description: "Tarefa removida com sucesso",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Tarefa removida com sucesso",
                      },
                    },
                  },
                },
              },
            },
            404: {
              description: "Tarefa não encontrada",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/api/bulk": {
        put: {
          summary: "Atualiza múltiplas tarefas de uma vez",
          tags: ["To-Dos"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["ids"],
                  properties: {
                    ids: {
                      type: "array",
                      items: { type: "string", format: "uuid" },
                      description:
                        "Lista de IDs das tarefas a serem atualizadas",
                      example: [
                        "550e8400-e29b-41d4-a716-446655440000",
                        "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
                      ],
                    },
                    updates: {
                      type: "object",
                      properties: {
                        completed: {
                          type: "boolean",
                          description:
                            "Novo status de conclusão para todas as tarefas",
                          example: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Tarefas atualizadas com sucesso",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "5 tarefas atualizadas com sucesso",
                      },
                      updated: {
                        type: "integer",
                        description: "Quantidade de tarefas atualizadas",
                        example: 5,
                      },
                      todos: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Todo" },
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "Dados inválidos ou lista de IDs vazia",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            404: {
              description: "Uma ou mais tarefas não encontradas",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/api/bulk/delete": {
        delete: {
          summary: "Remove múltiplas tarefas de uma vez",
          tags: ["To-Dos"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["ids"],
                  properties: {
                    ids: {
                      type: "array",
                      items: { type: "string", format: "uuid" },
                      description: "Lista de IDs das tarefas a serem removidas",
                      example: [
                        "550e8400-e29b-41d4-a716-446655440000",
                        "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
                      ],
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Tarefas removidas com sucesso",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "3 tarefas removidas com sucesso",
                      },
                      deleted: {
                        type: "integer",
                        description: "Quantidade de tarefas removidas",
                        example: 3,
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "Lista de IDs inválida ou vazia",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            404: {
              description: "Uma ou mais tarefas não encontradas",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);

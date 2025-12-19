import { Router } from "express";
import {
  bulkDeleteToDos,
  bulkUpdateToDos,
  // getTodoById,
  createToDo,
  deleteToDo,
  getToDos,
  updateToDo,
} from "../controllers/todo.controller.js";

const router = Router();

/**
 * @swagger
 * /api/item/new:
 *   post:
 *     summary:  Cria uma nova tarefa
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TodoInput'
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref:  '#/components/schemas/Todo'
 *       400:
 *         description:  Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/item/new", createToDo);

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description:  ID único da tarefa (gerado automaticamente)
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         title:
 *           type:  string
 *           description:  Título da tarefa
 *           example: "Estudar Swagger"
 *         description:
 *           type: string
 *           description: Descrição detalhada da tarefa
 *           example: "Aprender a documentar APIs com Swagger"
 *         completed:
 *           type: boolean
 *           description: Status de conclusão da tarefa
 *           default: false
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *           example: "2025-12-19T10:30:00Z"
 *
 *     TodoInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: Título da tarefa
 *           example:  "Minha nova tarefa"
 *         description:
 *           type: string
 *           description:  Descrição da tarefa
 *           example:  "Descrição detalhada da tarefa"
 *
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensagem de erro
 *           example: "Tarefa não encontrada"
 */

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Lista todas as tarefas
 *     tags: [Todos]
 *     parameters:
 *       - in:  query
 *         name: completed
 *         schema:
 *           type: boolean
 *         description:  Filtrar por status de conclusão
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página para paginação
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Quantidade de itens por página
 *     responses:
 *       200:
 *         description: Lista de tarefas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *       500:
 *         description:  Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/items", getToDos);

/**
 * @swagger
 * /api/bulk:
 *   put:
 *     summary: Atualiza múltiplas tarefas de uma vez
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type:  array
 *                 items:
 *                   type:  string
 *                   format: uuid
 *                 description: Lista de IDs das tarefas a serem atualizadas
 *                 example:  ["550e8400-e29b-41d4-a716-446655440000", "6ba7b810-9dad-11d1-80b4-00c04fd430c8"]
 *               updates:
 *                 type: object
 *                 properties:
 *                   completed:
 *                     type: boolean
 *                     description: Novo status de conclusão para todas as tarefas
 *                     example: true
 *     responses:
 *       200:
 *         description:  Tarefas atualizadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "5 tarefas atualizadas com sucesso"
 *                 updated:
 *                   type: integer
 *                   description: Quantidade de tarefas atualizadas
 *                   example:  5
 *                 todos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Dados inválidos ou lista de IDs vazia
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Uma ou mais tarefas não encontradas
 *         content:
 *           application/json:
 *             schema:
 *               $ref:  '#/components/schemas/Error'
 */
router.put("/bulk", bulkUpdateToDos);

/**
 * @swagger
 * /api/bulk/delete:
 *   delete:
 *     summary: Remove múltiplas tarefas de uma vez
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type:  object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format:  uuid
 *                 description: Lista de IDs das tarefas a serem removidas
 *                 example: ["550e8400-e29b-41d4-a716-446655440000", "6ba7b810-9dad-11d1-80b4-00c04fd430c8"]
 *     responses:
 *       200:
 *         description:  Tarefas removidas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type:  string
 *                   example: "3 tarefas removidas com sucesso"
 *                 deleted:
 *                   type: integer
 *                   description: Quantidade de tarefas removidas
 *                   example: 3
 *       400:
 *         description: Lista de IDs inválida ou vazia
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Uma ou mais tarefas não encontradas
 *         content:
 *           application/json:
 *             schema:
 *               $ref:  '#/components/schemas/Error'
 */
router.delete("/bulk/delete", bulkDeleteToDos);

/**
 * @swagger
 * /api/item/{id}:
 *   put:
 *     summary: Atualiza uma tarefa existente
 *     tags: [Todos]
 *     parameters:
 *       - in:  path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único da tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TodoInput'
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Tarefa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/item/:id", updateToDo);

/**
 * @swagger
 * /api/item/{id}:
 *   delete:
 *     summary: Remove uma tarefa
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required:  true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único da tarefa
 *     responses:
 *       200:
 *         description:  Tarefa removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tarefa removida com sucesso"
 *       404:
 *         description: Tarefa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/item/:id", deleteToDo);

export default router;

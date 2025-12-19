import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import toDoRoutes from "./routes/todo.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

// Swagger
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Rota de teste
/**
 * @swagger
 * /:
 *   get:
 *     summary: Verifica se a API está funcionando
 *     tags:  [Health]
 *     responses:
 *       200:
 *         description: API funcionando corretamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type:  string
 *                   example:  API funcionando!
 */
app.get("/", (req, res) => {
  res.json({ message: "API funcionando!" });
});

// Rota principal
app.use("/api", toDoRoutes);

export default app;

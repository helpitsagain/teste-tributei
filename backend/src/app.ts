import express from "express";
import cors from "cors";
import toDoRoutes from "./routes/todo.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

// Rota de teste
app.get("/", (req, res) => {
  res.json({ message: "API funcionando!" });
});

// Rota principal
app.use("/api", toDoRoutes);

export default app;

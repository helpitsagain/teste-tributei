import dotenv from "dotenv";
import path from "path";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

// Carrega as variáveis de ambiente - usa process.cwd() para pegar o diretório de trabalho
dotenv.config({
  path: path.resolve(process.cwd(), envFile),
});

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3001", 10),
  apiUrl: process.env.API_URL || "http://localhost:3001",
};

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

// Carrega as variáveis de ambiente
dotenv.config({
  path: path.resolve(__dirname, "../../", envFile),
});

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3001", 10),
  apiUrl: process.env.API_URL || "http://localhost:3001",
};

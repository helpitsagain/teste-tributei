import "./config/env.js";
import app from "./app.js";

const PORT = parseInt(process.env.PORT ?? "3001", 10);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`API URL: ${process.env.API_URL}`);
  console.log(`Swagger docs:  ${process.env.API_URL}/swagger`);
});

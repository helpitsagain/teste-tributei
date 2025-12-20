// Mockando uma DATABASE_URL para as chamadas de neon() nos testes
process.env.DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://user:pass@localhost:5432/testdb";

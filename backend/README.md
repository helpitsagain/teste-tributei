# Backend - Teste Técnico Tributei

API RESTful para gerenciamento de tarefas (To-Do List) construída com Node.js, Express e TypeScript.

## Índice

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
- [Docker](#docker)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Endpoints da API](#endpoints-da-api)
- [Testes](#testes)
- [Build e Deploy](#build-e-deploy)

## Visão Geral

Este diretório contém a API backend da aplicação To-Do List. A API fornece endpoints para:

- Listar tarefas com paginação e filtros
- Criar novas tarefas
- Atualizar tarefas existentes
- Excluir tarefas individualmente
- Operações em massa (atualizar/excluir múltiplas tarefas)

A documentação interativa da API está disponível via Swagger em `/swagger`.

## Tecnologias Utilizadas

- **Node.js** 20.x — Runtime JavaScript
- **Express** 5.x — Framework web minimalista
- **TypeScript** — Superset tipado do JavaScript
- **Vitest** — Framework de testes unitários
- **Swagger** — Documentação interativa da API
- **CORS** — Middleware para Cross-Origin Resource Sharing
- **UUID** — Geração de identificadores únicos
- **Nodemon** + **tsx** — Hot reload durante desenvolvimento
- **Neon Database** — Banco de dados PostgreSQL serverless

## Pré-requisitos

- **Node.js** 18.x ou superior
- **npm** 9.x ou superior (ou yarn/pnpm)
- **Docker** (opcional, para execução containerizada)

Verifique as versões instaladas:

```bash
node --version
npm --version
```

## Estrutura do Projeto

```
backend/
├── src/
│   ├── __tests__/           # Testes unitários
│   ├── config/              # Configurações (env, swagger)
│   ├── controllers/         # Controladores da aplicação
│   ├── models/              # Modelos de dados
│   ├── repositories/        # Camada de acesso a dados
│   ├── routes/              # Definição de rotas
│   ├── services/            # Lógica de negócio
│   ├── app.ts               # Configuração do Express
│   └── server.ts            # Ponto de entrada do servidor
├── .env.development         # Variáveis de ambiente (desenvolvimento)
├── .env.production          # Variáveis de ambiente (produção)
├── Dockerfile               # Build de produção (multi-stage)
├── Dockerfile.dev           # Build de desenvolvimento
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

## Instalação e Configuração

1. Clone o repositório e entre na pasta `backend`:

```bash
git clone https://github.com/helpitsagain/teste-tributei.git
cd teste-tributei/backend
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

Crie os arquivos `.env.development` e/ou `.env.production` na raiz do diretório `backend`:

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:password@host:5432/database
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3001`.

## Docker

O backend pode ser executado em container Docker de forma isolada ou junto com o frontend.

### Arquivos Docker

| Arquivo | Descrição |
|---------|----------|
| `Dockerfile` | Build de produção multi-stage otimizado |
| `Dockerfile.dev` | Build de desenvolvimento com hot-reload |
| `.dockerignore` | Arquivos ignorados no build |

### Executando com Docker (isolado)

```bash
# Build da imagem de produção
docker build -t tributei-backend .

# Executar o container
docker run -p 3001:3001 --env-file .env.production tributei-backend
```

### Executando com Docker Compose (recomendado)

Na raiz do projeto:

```bash
# Desenvolvimento (com hot-reload)
docker compose -f docker-compose.dev.yml up backend

# Produção
docker compose up backend
```

### Portas

| Ambiente | Porta |
|----------|-------|
| Desenvolvimento | `3001` |
| Produção | `3001` |

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento com hot-reload |
| `npm start` | Inicia servidor compilado (produção) |
| `npm run build` | Compila TypeScript para JavaScript |
| `npm test` | Executa testes com Vitest |
| `npm run test:watch` | Executa testes em modo watch |
| `npm run test:coverage` | Gera relatório de cobertura de testes |
| `npm run test:ui` | Executa testes com interface visual |

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `NODE_ENV` | Ambiente de execução (`development` ou `production`) | `development` |
| `PORT` | Porta do servidor | `3001` |
| `DATABASE_URL` | URL de conexão com o banco PostgreSQL | - |
| `API_URL` | URL base da API | `http://localhost:3001` |

## Endpoints da API

### Base URL: `http://localhost:3001`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/` | Verifica se a API está funcionando |
| `GET` | `/health` | Health check do serviço |
| `GET` | `/swagger` | Documentação interativa da API |
| `GET` | `/api/items` | Lista todas as tarefas com paginação |
| `GET` | `/api/items/filter` | Lista tarefas com filtros |
| `POST` | `/api/item/new` | Cria uma nova tarefa |
| `PUT` | `/api/item/:id` | Atualiza uma tarefa |
| `DELETE` | `/api/item/:id` | Remove uma tarefa |
| `PUT` | `/api/bulk` | Atualiza tarefas em lote |
| `DELETE` | `/api/bulk/delete` | Remove tarefas em lote |

### Exemplos de Requisição

```bash
# Verificar status da API
curl http://localhost:3001/

# Health check
curl http://localhost:3001/health

# Listar todas as tarefas
curl http://localhost:3001/api/items

# Listar tarefas com paginação
curl "http://localhost:3001/api/items?page=1&limit=10"

# Criar nova tarefa
curl -X POST http://localhost:3001/api/item/new \
  -H "Content-Type: application/json" \
  -d '{"title": "Minha nova tarefa", "description": "Descrição da tarefa"}'

# Atualizar tarefa
curl -X PUT http://localhost:3001/api/item/<ID> \
  -H "Content-Type: application/json" \
  -d '{"title": "Título atualizado", "completed": true}'

# Excluir tarefa
curl -X DELETE http://localhost:3001/api/item/<ID>
```

## Testes

O projeto usa **Vitest** para testes unitários e de integração.

```bash
# Executar todos os testes
npm test

# Executar com interface visual
npm run test:ui

# Executar com cobertura de código
npm run test:coverage

# Executar em modo watch
npm run test:watch
```

Arquivos de teste estão em `src/__tests__/`.

## Build e Deploy

### Build Local

```bash
# Compilar TypeScript
npm run build

# Iniciar em produção
npm start
```

Os arquivos compilados serão gerados em `dist/`.

### Deploy no Vercel

O projeto está configurado para deploy no Vercel. O arquivo `vercel.json` contém as configurações necessárias.

A documentação da API em produção está disponível em:
- [Swagger - Produção](https://teste-tributei-backend.vercel.app/swagger)

## Links Úteis

- [Documentação do Express](https://expressjs.com/)
- [Documentação do TypeScript](https://www.typescriptlang.org/)
- [Documentação do Vitest](https://vitest.dev/)
- [Swagger/OpenAPI](https://swagger.io/)
- [Frontend da Aplicação](https://teste-tributei-frontend.vercel.app/)

---

Desenvolvido com ❤️ usando Node.js + Express + TypeScript

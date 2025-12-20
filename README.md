# Teste Tributei

Aplicação full-stack para gerenciamento de tarefas (To-Do List) construída com React no front-end e Node.js/Express no back-end.

## Índice

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
  - [Back-end](#back-end)
  - [Front-end](#front-end)
- [Executando a Aplicação](#executando-a-aplicação)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Endpoints da API](#endpoints-da-api)
- [Solução de Problemas](#solução-de-problemas)

## Visão Geral

Este projeto é uma aplicação de lista de tarefas (To-Do) que permite criar, visualizar, editar e excluir tarefas. A arquitetura é dividida em:

- **Front-end**:  Interface de usuário construída com React e Vite
- **Back-end**: API RESTful construída com Express. js

O deploy do projeto foi feito no Vercel e pode ser acessado pelos seguintes links:
- [Front-end](https://teste-tributei-frontend.vercel.app/)
- [Documentação da API (Swagger)](https://teste-tributei-backend.vercel.app/swagger)

## Tecnologias Utilizadas

### Front-end
- **React** 19.x - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset tipado do JavaScript
- **Vite** 7.x - Build tool e dev server
- **Axios** - Cliente HTTP para requisições à API
- **SCSS/Sass** - Pré-processador CSS
- **React Testing Library** - Testes de componentes

### Back-end
- **Node.js** - Runtime JavaScript
- **Express** 5.x - Framework web para Node. js
- **TypeScript** - Superset tipado do JavaScript
- **CORS** - Middleware para Cross-Origin Resource Sharing
- **UUID** - Geração de identificadores únicos
- **Nodemon** + **tsx** - Hot reload durante desenvolvimento

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 18. x ou superior recomendada)
- **npm** (geralmente instalado junto com o Node.js) ou **yarn**
- **Git** (para clonar o repositório)

Para verificar se você tem as ferramentas instaladas, execute:

```bash
node --version
npm --version
git --version
```

## Estrutura do Projeto

```
teste-tributei/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Controladores da aplicação
│   │   ├── models/          # Modelos de dados
│   │   ├── routes/          # Definição de rotas
│   │   ├── services/        # Lógica de negócio
│   │   ├── app. ts          # Configuração do Express
│   │   └── server.ts        # Ponto de entrada do servidor
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # Serviços de API
│   │   ├── styles/          # Arquivos de estilo SCSS
│   │   ├── types/           # Definições de tipos TypeScript
│   │   ├── App.tsx          # Componente principal
│   │   └── index.tsx        # Ponto de entrada
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config. ts
│
└── . gitignore
```

## Instalação e Configuração

### Clonando o Repositório

```bash
git clone https://github.com/helpitsagain/teste-tributei.git
cd teste-tributei
```

### Back-end

1. **Navegue até a pasta do back-end:**

```bash
cd backend
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Compile o TypeScript (para produção):**

```bash
npm run build
```

### Front-end

1. **Navegue até a pasta do front-end:**

```bash
cd frontend
```

> Se você estava na pasta `backend`, use:  `cd ../frontend`

2. **Instale as dependências:**

```bash
npm install
```

## Executando a Aplicação

### Modo Desenvolvimento

Você precisará de **dois terminais** abertos para executar o front-end e o back-end simultaneamente. 

#### Terminal 1 - Back-end

```bash
cd backend
npm run dev
```

O servidor estará disponível em:  `http://localhost:3001`

#### Terminal 2 - Front-end

```bash
cd frontend
npm start
```

A aplicação estará disponível em:  `http://localhost:3000`

### Modo Produção

#### Back-end

```bash
cd backend
npm run build
npm start
```

#### Front-end

```bash
cd frontend
npm run build
```

Os arquivos de build serão gerados na pasta `dist/` e podem ser servidos por qualquer servidor web estático.

## Scripts Disponíveis

### Back-end

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o servidor compilado (produção) |
| `npm run build` | Compila o TypeScript para JavaScript |
| `npm run dev` | Inicia o servidor em modo desenvolvimento com hot reload |
| `npm test` | Executa os testes (a ser configurado) |

### Front-end

| Comando | Descrição |
|---------|-----------|
| `npm run start` | Inicia a aplicação compilada (produção) |
| `npm run build` | Cria build de produção otimizada |
| `npm run dev` | Inicia a aplicação em modo de desenvolvimento com hot reload |
| `npm test` | Executa os testes (a ser configurado) |

## Endpoints da API

### Base URL: `http://localhost:3001`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/` | Verifica se a API está funcionando |
| `GET` | `/api/todos` | Lista todas as tarefas |
| `POST` | `/api/todos` | Cria uma nova tarefa |
| `PUT` | `/api/todos/:id` | Atualiza uma tarefa |
| `DELETE` | `/api/todos/:id` | Remove uma tarefa |

### Exemplo de Requisição

```bash
# Verificar status da API
curl http://localhost:3001/

# Listar todas as tarefas
curl http://localhost:3001/api/todos

# Criar nova tarefa
curl -X POST http://localhost:3001/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Minha nova tarefa", "description": "Descrição da tarefa"}'
```

## Solução de Problemas

### Erro: "EADDRINUSE - Port already in use"

A porta já está sendo utilizada por outro processo.  Encerre o processo ou altere a porta: 

```bash
# Linux/Mac - Encontrar processo usando a porta
lsof -i :3001
kill -9 <PID>

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Erro: "CORS blocked"

Certifique-se de que o back-end está rodando e que o middleware CORS está configurado corretamente no `app.ts`.

### Erro de módulos não encontrados

Certifique-se de remover a pasta `node_modules` e o arquivo `package-lock.json` nos diretórios do front-end e do back-end.

```bash
rm -rf node_modules package-lock.json
```

Execute `npm install` novamente em ambas as pastas (`backend/` e `frontend/`).

---

Desenvolvido com ❤️ como parte do teste técnico Tributei.

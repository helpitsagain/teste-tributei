# Frontend - Teste Técnico Tributei

Interface de usuário para aplicação de gerenciamento de tarefas (To-Do List) construída com React, TypeScript e Vite.

## Índice

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Componentes](#componentes)
- [Serviços](#serviços)
- [Testes](#testes)
- [Estilização](#estilização)
- [Build e Deploy](#build-e-deploy)

## Visão Geral

Este frontend é parte da aplicação To-Do List do Teste Técnico Tributei. Permite aos usuários: 

- Visualizar lista de tarefas com scroll infinito
- Criar novas tarefas
- Editar tarefas existentes
- Marcar tarefas como concluídas
- Excluir tarefas individualmente
- Operações em massa (atualizar/excluir múltiplas tarefas)

## Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **React** | 19.x | Biblioteca para construção de interfaces |
| **TypeScript** | 4.9.x | Superset tipado do JavaScript |
| **Vite** | 7.x | Build tool e dev server ultrarrápido |
| **Axios** | 1.13.x | Cliente HTTP para requisições à API |
| **Vitest** | 4.x | Framework de testes unitários |
| **React Testing Library** | 16.x | Utilitários para testes de componentes |
| **MSW** | 2.x | Mock Service Worker para testes de API |
| **Sass** | 1.97.x | Pré-processador CSS |
| **React Infinite Scroll** | 6.x | Componente para scroll infinito |

## Pré-requisitos

- **Node.js** 18.x ou superior
- **npm** 9.x ou superior (ou yarn/pnpm)
- **Backend** rodando em `http://localhost:3001` (ou URL configurada)

```bash
# Verificar versões instaladas
node --version
npm --version
```

## Estrutura do Projeto

```
frontend/
├── public/                  # Arquivos estáticos públicos
├── src/
│   ├── __tests__/           # Testes unitários
│   │   ├── ToDoItem. test.tsx
│   │   ├── ToDoItemEdit. test.tsx
│   │   ├── ToDoList.test. tsx
│   │   └── toDoService.test.ts
│   ├── components/          # Componentes React
│   │   ├── BulkActionModal/ # Modal para ações em massa
│   │   ├── Error/           # Componente de erro
│   │   ├── Loader/          # Componente de loading
│   │   ├── NewToDoModal/    # Modal para criar tarefa
│   │   └── ToDoList/        # Lista de tarefas principal
│   ├── services/            # Serviços de comunicação com API
│   │   ├── api.ts           # Configuração do Axios
│   │   └── toDoService.ts   # Funções de CRUD de tarefas
│   ├── styles/              # Estilos globais SCSS
│   │   ├── _mixins.scss     # Mixins reutilizáveis
│   │   └── _variables.scss  # Variáveis de estilo
│   ├── types/               # Definições de tipos TypeScript
│   │   └── toDo.ts          # Tipos relacionados a tarefas
│   ├── App.css              # Estilos do componente App
│   ├── App. tsx             # Componente principal
│   ├── App.test.tsx         # Testes do componente App
│   ├── index.css            # Estilos globais
│   ├── index.tsx            # Ponto de entrada da aplicação
│   ├── setupTests.ts        # Configuração dos testes
│   └── reportWebVitals.ts   # Métricas de performance
├── .env.development         # Variáveis de ambiente (desenvolvimento)
├── .env.production          # Variáveis de ambiente (produção)
├── index.html               # Template HTML
├── package.json             # Dependências e scripts
├── tsconfig.json            # Configuração do TypeScript
└── vite.config.ts           # Configuração do Vite
```

## Instalação e Configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/helpitsagain/teste-tributei.git
cd teste-tributei/frontend
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie os arquivos de ambiente na raiz do diretório `frontend/`:

```env name=. env.development
VITE_API_BASE_URL=http://localhost:3001/api
```

```env name=.env.production
VITE_API_BASE_URL=https://teste-tributei-backend.vercel.app/api
```

### 4. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em:  `http://localhost:3000`

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento (modo development) |
| `npm start` | Inicia servidor de desenvolvimento (modo production) |
| `npm run build` | Cria build de produção otimizada |
| `npm test` | Executa testes com Vitest |
| `npm run test:ui` | Executa testes com interface visual |
| `npm run test:coverage` | Executa testes com relatório de cobertura |

## Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_API_BASE_URL` | URL base da API backend | `http://localhost:3001/api` |

> **Nota:** Variáveis de ambiente no Vite devem ter o prefixo `VITE_` para serem expostas ao código cliente.

## Componentes

### ToDoList
Componente principal que renderiza a lista de tarefas com scroll infinito.

### ToDoItem
Representa uma tarefa individual com opções de editar, excluir e marcar como concluída.

### NewToDoModal
Modal para criação de novas tarefas com campos de título e descrição.

### BulkActionModal
Modal para realizar operações em massa (atualizar ou excluir múltiplas tarefas selecionadas).

### Loader
Componente de loading exibido durante carregamentos assíncronos.

### Error
Componente para exibição de mensagens de erro.

## Serviços

### api.ts
Configuração base do Axios com a URL da API. 

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env. VITE_API_BASE_URL,
});
```

### toDoService.ts
Funções para comunicação com a API: 

| Função | Método | Endpoint | Descrição |
|--------|--------|----------|-----------|
| `getToDos` | GET | `/items` | Lista tarefas (paginado) |
| `createToDo` | POST | `/item/new` | Cria nova tarefa |
| `updateToDo` | PUT | `/item/:id` | Atualiza tarefa |
| `deleteToDo` | DELETE | `/item/delete/:id` | Remove tarefa |
| `bulkUpdateToDos` | PUT | `/bulk` | Atualiza múltiplas tarefas |
| `bulkDeleteToDos` | DELETE | `/bulk/delete` | Remove múltiplas tarefas |

## Testes

O projeto utiliza **Vitest** com **React Testing Library** e **MSW** para mocks de API.

### Executar testes

```bash
# Executar todos os testes
npm test

# Executar com interface visual
npm run test:ui

# Executar com cobertura de código
npm run test:coverage
```

### Arquivos de teste

- `ToDoItem.test.tsx` - Testes do componente de item
- `ToDoItemEdit.test.tsx` - Testes da edição de item
- `ToDoList.test.tsx` - Testes da lista de tarefas
- `toDoService.test.ts` - Testes do serviço de API

### Estrutura de um teste

```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the To-Do List title", () => {
    render(<App />);
    expect(screen.getByText("To-Do List")).toBeInTheDocument();
  });
});
```

## Estilização

O projeto utiliza **SCSS** para estilização com arquivos de variáveis e mixins reutilizáveis.

### Variáveis (`_variables.scss`)
Define cores, espaçamentos, fontes e breakpoints globais. 

### Mixins (`_mixins.scss`)
Contém mixins reutilizáveis para responsividade e padrões de estilo.

### Uso em componentes

```scss
@use "../../styles/variables" as *;
@use "../../styles/mixins" as *;

.my-component {
  color: $primary-color;
  @include responsive(tablet) {
    padding: $spacing-md;
  }
}
```

## Build e Deploy

### Build de produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

### Deploy na Vercel

1. Conecte o repositório à Vercel
2. Configure as variáveis de ambiente: 
   - `VITE_API_BASE_URL` = `https://teste-tributei-backend.vercel.app/api`
3. Defina o diretório do projeto como `frontend`
4. A Vercel detectará automaticamente o Vite

### Estrutura de build

```
dist/
├── assets/
│   ├── index-[hash].css
│   └── index-[hash].js
├── index.html
└── ... 
```

## Links Úteis

- [Documentação do React](https://react.dev/)
- [Documentação do Vite](https://vitejs.dev/)
- [Documentação do Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [API Backend - Swagger](https://teste-tributei-backend.vercel.app/swagger)

---

Desenvolvido com ❤️ usando React + TypeScript + Vite

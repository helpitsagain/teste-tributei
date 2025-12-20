# Getting Started with Create React App

Interface de usuário para gerenciamento de tarefas (To-Do List) construída com React, TypeScript e Vite.

## Available Scripts

In the project directory, you can run:

### `npm start`

Este diretório contém apenas o frontend da aplicação To-Do List. A interface permite ao usuário:

- Visualizar a lista de tarefas com scroll infinito
- Criar novas tarefas
- Editar tarefas existentes
- Marcar tarefas como concluídas
- Excluir tarefas individualmente
- Realizar operações em massa (atualizar/excluir múltiplas tarefas)

### `npm test`

- **React** (v17/18/19 compatível) — Biblioteca para construção de interfaces
- **TypeScript** — Superset tipado do JavaScript
- **Vite** — Build tool e dev server ultrarrápido
- **Vitest** — Framework de testes unitários
- **Axios** — Cliente HTTP usado para chamadas à API
- **React Testing Library** — Utilitários para testes de componentes
- **MSW** — Mock Service Worker para testes de integração com API
- **Sass** — Pré-processador CSS
- **React Infinite Scroll** — Componente para scroll infinito

### `npm run build`

- **Node.js** 18.x ou superior
- **npm** 9.x ou superior (ou yarn/pnpm)

Verifique as versões instaladas:

```bash
node --version
npm --version
```

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

```
frontend/
├── public/
├── src/
│   ├── __tests__/           # Testes unitários
│   ├── components/          # Componentes React
│   ├── services/            # Serviços de comunicação com API
│   ├── styles/              # Estilos globais SCSS
│   └── types/               # Definições de tipos TypeScript
├── .env.development
├── .env.production
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

1. Clone o repositório e entre na pasta `frontend`:

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

2. Instale as dependências:

## Learn More

3. Configure variáveis de ambiente (opcional): crie `.env.development` e/ou `.env.production` na raiz do diretório `frontend`.

Exemplo mínimo (substitua pelo endpoint da sua API):

```
VITE_API_BASE_URL=<SUA_API_URL_AQUI>
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000` por padrão.

## Scripts Disponíveis

- `npm run dev` : inicia servidor de desenvolvimento
- `npm start` : inicia em modo production local (se configurado)
- `npm run build` : gera build de produção otimizada em `dist/`
- `npm test` : executa testes com Vitest
- `npm run test:ui` : executa testes com interface visual
- `npm run test:coverage` : gera relatório de cobertura

## Variáveis de Ambiente

- **`VITE_API_BASE_URL`**: URL base usada pelo frontend para se comunicar com uma API. Deve apontar para a API que fornece os endpoints consumidos pela aplicação.

Nota: Variáveis de ambiente no Vite precisam do prefixo `VITE_` para serem expostas ao código cliente.

## Componentes

- **ToDoList**: componente principal que renderiza a lista com scroll infinito.
- **ToDoItem**: representa uma tarefa individual com ações (editar, excluir, marcar concluída).
- **ToDoItemEdit**: formulário de edição inline de uma tarefa.
- **NewToDoModal**: modal para criação de novas tarefas.
- **BulkActionModal**: modal para ações em massa sobre tarefas selecionadas.
- **Loader**: componente de loading usado durante requisições.
- **Error**: componente para exibir mensagens de erro.

## Serviços

- **`src/services/api.ts`**: configuração do cliente HTTP (Axios) que usa `VITE_API_BASE_URL`.
- **`src/services/toDoService.ts`**: funções que encapsulam chamadas à API relacionadas a tarefas (listagem, criação, atualização, remoção, operações em massa).

Mantenha as chamadas centralizadas nesses serviços para facilitar testes e mocks.

## Testes

O projeto usa **Vitest**, **React Testing Library** e **MSW** para mocks de API.

Executar testes:

```bash
# Executar todos os testes
npm test

# Executar com interface visual
npm run test:ui

# Executar com cobertura de código
npm run test:coverage
```

Arquivos de teste principais estão em `src/__tests__/`.

## Estilização

O projeto utiliza **SCSS** com arquivos de variáveis e mixins em `src/styles/`.

Exemplo de uso em componentes:

```scss
@use "../../styles/variables" as *;
@use "../../styles/mixins" as *;

.my-component {
  color: $primary-color;
}
```

## Build e Deploy

Gerar build de produção:

```bash
npm run build
```

Os arquivos otimizados serão gerados em `dist/`.

Ao fazer deploy (Vercel, Netlify, etc.), configure a variável de ambiente `VITE_API_BASE_URL` no ambiente da plataforma.

## Links Úteis

- [Documentação do React](https://react.dev/)
- [Documentação do Vite](https://vitejs.dev/)
- [Documentação do Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [API Backend - Swagger](https://teste-tributei-backend.vercel.app/swagger)

---

Desenvolvido com ❤️ usando React + TypeScript + Vite

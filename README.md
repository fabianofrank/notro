# 🔍 GitHub Repository Search

Uma aplicação fullstack para buscar repositórios no GitHub com interface moderna e responsiva.

## 🚀 Tecnologias

**Frontend:**
- Angular 18+ (Standalone Components)
- Angular Material + Tailwind CSS
- Apollo GraphQL Client
- RxJS

**Backend:**
- Node.js + Express
- GraphQL (express-graphql)
- Axios (GitHub API)
- Jest (Testes)

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Git

## 🛠️ Instalação e Execução

### 1. Clone o repositório
```bash
git clone <seu-repo-url>
cd notro
```

### 2. Backend
```bash
cd backend
npm install
npm start
```
O backend rodará em `http://localhost:4000`

### 3. Frontend (em outro terminal)
```bash
cd frontend
npm install
npm start
```
O frontend rodará em `http://localhost:4200`

## 🧪 Testes

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## 📁 Estrutura do Projeto

```
notro/
├── backend/           # API GraphQL + Express
│   ├── src/
│   │   ├── config/    # Schema GraphQL
│   │   ├── resolvers/ # Resolvers GraphQL
│   │   └── services/  # Lógica de negócio
│   └── test/          # Testes Jest
├── frontend/          # App Angular
│   ├── src/app/
│   │   ├── components/  # Componentes UI
│   │   ├── services/    # Apollo GraphQL
│   │   └── models/      # Tipos TypeScript
└── vercel.json        # Deploy configuration
```

## ✨ Funcionalidades

- 🔍 Busca de repositórios no GitHub
- 📄 Paginação de resultados
- 📱 Interface responsiva
- ⚡ Loading states
- 🎨 Design moderno com Material + Tailwind

## 🌐 Deploy

Faça deploy no Vercel:
1. Conecte seu GitHub ao Vercel
2. Importe este repositório
3. Deploy automático!

## 📝 Licença

MIT License - use como quiser! 🚀
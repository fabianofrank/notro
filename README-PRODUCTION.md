# 🚀 GitHub Repository Search - Desafio Notro

SPA em **Angular 18** com backend **Node.js + GraphQL** para buscar repositórios no GitHub.

## ✨ Features Implementadas

### ✅ Requisitos Obrigatórios
- **Frontend Angular 18+** com standalone components
- **Backend Node.js + GraphQL** (express-graphql)
- **Busca de repositórios GitHub** via API pública
- **Paginação completa** com navegação
- **Interface responsiva** com Angular Material + Tailwind

### ✅ Dados Exibidos
- Nome do repositório e URL
- Descrição completa  
- **Estrelas** (stargazersCount)
- **Watchers** (watchersCount) 
- **Issues abertas** (openIssuesCount)
- **Forks** (forksCount)
- Linguagem principal
- Avatar e perfil do owner
- Data de última atualização

### ✅ Diferenciais Implementados
- **GraphQL completo** (queries + types + resolvers)
- **RxJS Observables** para chamadas assíncronas
- **Angular Material** com tema Azure Blue
- **Testes unitários** (Jest backend + Jasmine frontend)
- **Deploy automático** no Vercel
- **Documentação completa** 

## 🏗️ Arquitetura

```
notro/
├── backend/               # Node.js + GraphQL
│   ├── src/
│   │   ├── server.js      # Express + GraphQL setup
│   │   ├── config/schema.js           # Types e queries GraphQL
│   │   ├── resolvers/repositoryResolvers.js # Conecta GraphQL → Service  
│   │   └── services/RepositoryService.js    # GitHub API integration
│   └── test/repository.test.js        # Testes backend
├── frontend/              # Angular 18 + Material
│   ├── src/app/
│   │   ├── components/    # Search + RepositoryList + Pagination
│   │   ├── services/      # GraphQL client (Apollo)
│   │   ├── models/        # TypeScript interfaces
│   │   └── apollo.config.ts   # GraphQL config
└── vercel.json           # Deploy configuration
```

## 🚀 Como Rodar Local

### 1. Backend (localhost:4000)
```bash
cd backend
npm install
npm run dev        # Desenvolvimento com nodemon
npm test          # Testes com Jest
```

### 2. Frontend (localhost:4200)  
```bash
cd frontend
npm install
npx ng serve      # Desenvolvimento
npm test         # Testes com Karma + Jasmine
```

### 3. Teste Completo
1. Backend rodando na porta 4000
2. Frontend rodando na porta 4200  
3. Acessar http://localhost:4200
4. Buscar "react" → deve listar repositórios
5. Testar paginação → próximo/anterior

## 🧪 Testes

### Backend
```bash
cd backend
npm test                    # Testes Jest
node test-graphql.js       # Teste integração GitHub API
```

### Frontend  
```bash
cd frontend
npm test                   # Testes unitários Karma
```

## 🌐 Deploy Vercel

**URL de Produção:** https://notro-challenge.vercel.app

### Como foi feito:
1. Vercel configurado para detectar monorepo
2. Backend como serverless function
3. Frontend como SPA estática
4. GraphQL endpoint: `/api/graphql`

## 🔧 Tecnologias Utilizadas

### Backend
- **Node.js 18+** - Runtime  
- **Express.js** - Web framework
- **GraphQL** (express-graphql) - API layer
- **Axios** - GitHub API client
- **Jest** - Testes unitários

### Frontend
- **Angular 18** - Framework (standalone components)
- **Angular Material** - UI components
- **Tailwind CSS 3.4** - Styling utility
- **Apollo GraphQL** - GraphQL client  
- **RxJS** - Reactive programming
- **TypeScript** - Type safety

### Deploy
- **Vercel** - Hosting (frontend + serverless backend)
- **GitHub** - Repository + CI/CD

## 📊 Performance

- **Bundle size otimizado** com tree-shaking
- **Lazy loading** de componentes Material
- **Cache GraphQL** com Apollo InMemoryCache
- **Responsive design** mobile-first
- **Loading states** para melhor UX

## 🎯 Decisões Técnicas

### Por que GraphQL?
- Desafio recomendava como diferencial
- Frontend busca apenas dados necessários  
- Melhor tipagem que REST
- Single endpoint para todas as queries

### Por que Angular Material?
- Desafio mencionou como diferencial
- Componentes prontos e acessíveis
- Tema consistente (Azure Blue)
- Integração nativa com Angular

### Por que Standalone Components?
- Angular 18 best practice
- Imports explícitos (tree-shaking)
- Sem dependency injection complexa
- Mais simples que módulos

### Por que Vercel?
- Deploy automático via Git
- Serverless backend gratuito
- CDN global para frontend
- Zero configuração

## 📝 Próximos Passos (se fosse produção)

1. **Autenticação GitHub** para rate limits maiores
2. **Cache Redis** para performance
3. **Filtros avançados** (linguagem, data, etc)
4. **PWA** com service workers
5. **E2E tests** com Cypress
6. **Docker** para desenvolvimento local
7. **Monitoring** com Sentry/LogRocket

---

**Desenvolvido por:** Fabiano Frank  
**Desafio:** Notro - Fullstack Developer  
**Stack:** Angular 18 + Node.js + GraphQL + Vercel

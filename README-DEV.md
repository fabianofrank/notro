# 🚀 Notro Challenge - GitHub Repository Search

## 📝 Resumo do Projeto
SPA (Single Page Application) fullstack para busca de repositórios GitHub.

### Stack Técnica
- **Frontend**: Angular 18+ + Material + Tailwind + RxJS
- **Backend**: Node.js + Express + GraphQL 
- **Testes**: Jest (front + back)
- **Deploy**: Vercel
- **Arquitetura**: MVC no backend, Component+Services no frontend

## 🏗️ Estrutura do Projeto

```
notro-challenge/
├── backend/               # API Node.js + Express + GraphQL
│   ├── src/
│   │   ├── controllers/   # Controllers (MVC)
│   │   ├── models/        # Models/Types
│   │   ├── services/      # Business Logic
│   │   ├── resolvers/     # GraphQL Resolvers
│   │   ├── config/        # Configurações
│   │   └── server.js      # Entry point
│   └── package.json
├── frontend/              # SPA Angular 18+
│   ├── src/
│   │   ├── app/
│   │   ├── assets/
│   │   └── ...
│   └── package.json
└── package.json           # Scripts root
```

## 🛠️ Comandos de Desenvolvimento

```bash
# Instalar todas as dependências
npm run install:all

# Rodar frontend + backend juntos
npm run dev

# Rodar separadamente
npm run dev:backend   # Porta 4000
npm run dev:frontend  # Porta 4200

# Testes
npm run test          # Todos os testes
npm run test:backend  # Só backend
npm run test:frontend # Só frontend
```

## 📋 Funcionalidades Planejadas
- [x] Setup inicial do projeto
- [ ] Backend GraphQL para GitHub API
- [ ] Frontend Angular com busca
- [ ] Paginação
- [ ] Interface responsiva
- [ ] Testes básicos
- [ ] Deploy Vercel

---
*Desafio técnico para Notro - Desenvolvido por Fabiano Frank*

/* 
🎯 PROPÓSITO DESTE ARQUIVO:
Este é o "PORTÃO DE ENTRADA" do nosso backend.
Recebe requisições do Angular e as direciona para o GraphQL.

🤔 DÚVIDA 1: "COMO SERIA SEM GraphQL?"
RESPOSTA: Teríamos múltiplas rotas REST aqui mesmo! Exemplo:

❌ VERSÃO REST (que NÃO fizemos):
app.get('/api/repositories', RepositoryController.searchRepositories);
app.get('/api/repositories/:owner/:name', RepositoryController.getRepository);

✅ VERSÃO GraphQL (que fizemos):
app.use('/graphql', graphqlHTTP({ schema }));

📊 COMPARAÇÃO:
REST: Angular faz 2 requests diferentes → 2 endpoints diferentes
GraphQL: Angular faz 1 request customizado → 1 endpoint universal

📍 FLUXO COMPLETO:
1. Angular faz POST para http://localhost:4000/graphql
2. Express recebe e passa pro middleware graphqlHTTP
3. graphqlHTTP usa nosso schema (config/schema.js)
4. Schema chama resolvers → service → GitHub API
5. Resposta volta: GitHub → service → resolver → schema → Angular

🔄 CONEXÕES:
- RECEBE DE: Frontend Angular (requisições HTTP)
- USA: config/schema.js (define GraphQL queries e types)
- DISPONIBILIZA: Endpoint /graphql para Angular consumir
*/

const express = require('express'); // Framework web para criar servidor HTTP
const { graphqlHTTP } = require('express-graphql'); // Middleware que conecta GraphQL ao Express
const cors = require('cors'); // Permite Angular (localhost:4200) acessar backend (localhost:4000)
require('dotenv').config(); // Carrega variáveis do arquivo .env (se existir)

/* 
🎭 SCHEMA IMPORT - O "cérebro" do GraphQL
CONECTA COM: config/schema.js → repositoryResolvers.js → RepositoryService.js
RESULTADO: Define exatamente quais queries o Angular pode fazer
*/
const schema = require('./config/schema');

/* 
🏗️ EXPRESS APP SETUP - Criando o servidor web
RESPONSABILIDADE: Receber requisições HTTP e devolver respostas
*/
const app = express();
const PORT = process.env.PORT || 4000; // Vercel vai definir a porta, senão usa 4000

/* 
🛡️ MIDDLEWARES - Processamento que acontece ANTES das rotas
ORDEM IMPORTA: cors() → express.json() → rotas
*/
app.use(cors()); // Permite Angular (origem diferente) fazer requisições
app.use(express.json()); // Entende JSON no body das requisições

/* 
🎯 GRAPHQL ENDPOINT - A rota PRINCIPAL que Angular vai usar
URL: POST http://localhost:4000/graphql
BODY: { query: "query { searchRepositories(query: \"react\") { ... } }" }
FLUXO: graphqlHTTP → schema → resolver → service → GitHub → volta tudo
*/
app.use('/graphql', graphqlHTTP({
  schema: schema, // Usa o schema que conecta com resolvers e service
  graphiql: process.env.NODE_ENV === 'development', // Interface visual pra testar (http://localhost:4000/graphql)
}));

/* 
❤️ HEALTH CHECK - Rota simples pra testar se servidor tá vivo
URL: GET http://localhost:4000/health
USO: Vercel/deploy pode usar pra verificar se app tá funcionando
*/
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend rodando!' });
});

/* 
🚀 START SERVER - Inicia o servidor na porta configurada
DESENVOLVIMENTO: http://localhost:4000
PRODUÇÃO: Vercel define a porta automaticamente
*/
// Start server only if not in serverless environment (Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Backend rodando na porta ${PORT}`);
    console.log(`📊 GraphQL playground: http://localhost:${PORT}/graphql`);
    console.log(`❤️ Health check: http://localhost:${PORT}/health`);
  });
}

// Export for Vercel serverless
module.exports = app;

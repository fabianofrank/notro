const express = require('express'); // Framework web para criar servidor HTTP
const { graphqlHTTP } = require('express-graphql'); // Middleware que conecta GraphQL ao Express
const cors = require('cors'); // Permite Angular (localhost:4200) acessar backend (localhost:4000)
require('dotenv').config(); // Carrega variáveis do arquivo .env (se existir)

const schema = require('./config/schema');

const app = express();
const PORT = process.env.PORT || 4000; // Vercel vai definir a porta, senão usa 4000

app.use(cors()); // Permite Angular (origem diferente) fazer requisições
app.use(express.json()); // Entende JSON no body das requisições

app.use('/graphql', graphqlHTTP({
  schema: schema, // Usa o schema que conecta com resolvers e service
  graphiql: process.env.NODE_ENV === 'development', // Interface visual pra testar (http://localhost:4000/graphql)
}));

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend rodando!' });
});
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Backend rodando na porta ${PORT}`);
    console.log(`📊 GraphQL playground: http://localhost:${PORT}/graphql`);
    console.log(`❤️ Health check: http://localhost:${PORT}/health`);
  });
}
module.exports = app;

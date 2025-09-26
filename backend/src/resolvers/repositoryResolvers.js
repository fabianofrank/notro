/* 
🤔 DÚVIDA 5: "COMO O REPOSITORY RESOLVERS ENTRA NA EQUAÇÃO?"
RESPOSTA: É a "PONTE" entre GraphQL Schema e Service! Vou explicar o fluxo completo:

📍 FLUXO COMPLETO DETALHADO:
1. Angular faz: POST /graphql { query: "searchRepositories(query: \"react\")" }
2. server.js recebe e passa pro graphqlHTTP
3. graphqlHTTP usa schema.js para validar a query
4. schema.js identifica query "searchRepositories" 
5. schema.js chama: repositoryResolvers.searchRepositories ← AQUI!
6. repositoryResolvers.searchRepositories chama RepositoryService.searchRepositories
7. RepositoryService faz chamada pra GitHub API
8. Dados voltam: GitHub → Service → Resolver → Schema → Angular

🔗 CONEXÕES ESPECÍFICAS:
- CHAMADO POR: config/schema.js (linha 120: resolve: repositoryResolvers.searchRepositories)
- CHAMA: services/RepositoryService.js 
- RETORNA PARA: GraphQL que manda pro Angular

🎯 RESPONSABILIDADE DOS RESOLVERS:
- Receber argumentos do GraphQL (query, page, perPage)
- Chamar o service apropriado
- Tratar erros e converter pra erros GraphQL
- Retornar dados no formato que schema espera

💡 ANALOGIA:
- Schema = "Cardápio do restaurante" (o que pode ser pedido)
- Resolver = "Garçom" (pega o pedido e vai na cozinha)
- Service = "Cozinha" (prepara o prato)
- GitHub API = "Fornecedor de ingredientes"
*/

const RepositoryService = require('../services/RepositoryService');

/* 
🌉 GRAPHQL RESOLVERS - As "pontes" entre Schema e Service
PAPEL CRUCIAL: Conecta declarações GraphQL com implementações reais
CHAMADO POR: config/schema.js quando Angular faz queries
*/
const repositoryResolvers = {
  
  // SEARCH REPOSITORIES RESOLVER - Resolve a query "searchRepositories"
  searchRepositories: async (parent, { query, page = 1, perPage = 10 }) => {
    // parent: objeto pai (não usado aqui)
    // { query, page, perPage }: argumentos enviados pelo frontend
    try {
      // Chama o service que faz a requisição para GitHub API
      const result = await RepositoryService.searchRepositories(query, page, perPage);
      return result; // Retorna os dados formatados para o frontend
    } catch (error) {
      // Se der erro, lança uma exceção que aparece no frontend
      throw new Error(`Erro ao buscar repositórios: ${error.message}`);
    }
  },

  // SINGLE REPOSITORY RESOLVER - Resolve a query "repository"
  repository: async (parent, { owner, name }) => {
    // owner: nome do usuário/organização (ex: "facebook")
    // name: nome do repositório (ex: "react")
    try {
      // Chama o service para buscar um repo específico
      const result = await RepositoryService.getRepository(owner, name);
      return result; // Retorna os dados do repositório
    } catch (error) {
      // Se repo não existir ou houver erro, informa o frontend
      throw new Error(`Erro ao buscar repositório: ${error.message}`);
    }
  },
};

// EXPORT - Exporta os resolvers para serem usados no schema GraphQL
module.exports = repositoryResolvers;

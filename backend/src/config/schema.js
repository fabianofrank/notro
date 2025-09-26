/* 
🎯 PROPÓSITO DESTE ARQUIVO:
Este arquivo é o "CONTRATO" entre o frontend (Angular) e o backend.
Define EXATAMENTE quais dados o Angular pode pedir e em que formato vai receber.

📍 FLUXO COMPLETO:
1. Angular faz query GraphQL → 2. Este schema valida → 3. Chama resolver → 
4. Resolver chama service → 5. Service busca GitHub API → 6. Dados voltam formatados

🔄 CONEXÕES:
- VEM DE: server.js (usa este schema no endpoint /graphql)
- VAI PARA: repositoryResolvers.js (funções que buscam os dados)
- USADO POR: Frontend Angular (vai fazer queries baseadas nestes tipos)
*/

const { 
  GraphQLSchema,     // Monta o schema final que vai pro servidor
  GraphQLObjectType, // Cria "tipos" customizados (como Repository, Owner)
  GraphQLString,     // Tipo texto
  GraphQLInt,        // Tipo número
  GraphQLList,       // Tipo lista/array
  GraphQLNonNull,    // Torna um campo obrigatório
  GraphQLBoolean,    // Tipo verdadeiro/falso
  GraphQLID          // Tipo identificador único
} = require('graphql');

// Importa as funções que VÃO BUSCAR os dados quando Angular fizer as queries
const repositoryResolvers = require('../resolvers/repositoryResolvers');

/* 
🏗️ OWNER TYPE - Estrutura do "dono" de um repositório
ORIGEM: Dados vêm da API GitHub (campo "owner" em cada repo)
DESTINO: Angular vai receber estes campos quando pedir um repositório
EXEMPLO: { login: "facebook", avatarUrl: "https://...", url: "https://github.com/facebook" }
*/
const OwnerType = new GraphQLObjectType({
  name: 'Owner',
  fields: {
    login: { type: new GraphQLNonNull(GraphQLString) },    // Ex: "facebook", "microsoft"
    avatarUrl: { type: new GraphQLNonNull(GraphQLString) }, // Foto do perfil do GitHub
    url: { type: new GraphQLNonNull(GraphQLString) }        // Link pro perfil do GitHub
  }
});

/* 
🏗️ REPOSITORY TYPE - Estrutura PRINCIPAL de um repositório
ORIGEM: GitHub API retorna dados bagunçados (snake_case, campos extras, etc)
DESTINO: Angular recebe dados limpos e organizados (camelCase, só o que precisa)
TRANSFORMAÇÃO: RepositoryService.formatRepository() converte GitHub → este formato
EXEMPLO FINAL: { id: "123", name: "react", fullName: "facebook/react", stargazersCount: 50000, ... }
*/
const RepositoryType = new GraphQLObjectType({
  name: 'Repository',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },           // GitHub manda como número, convertemos pra string
    name: { type: new GraphQLNonNull(GraphQLString) },      // Ex: "react" (vem direto do GitHub)
    fullName: { type: new GraphQLNonNull(GraphQLString) },  // Ex: "facebook/react" (vem do GitHub como full_name)
    description: { type: GraphQLString },                   // Pode ser null no GitHub, aceitamos aqui também
    url: { type: new GraphQLNonNull(GraphQLString) },       // GitHub manda como html_url, mapeamos pra url
    stargazersCount: { type: new GraphQLNonNull(GraphQLInt) }, // GitHub: stargazers_count → nós: stargazersCount
    watchersCount: { type: new GraphQLNonNull(GraphQLInt) },   // GitHub: watchers_count → nós: watchersCount
    forksCount: { type: new GraphQLNonNull(GraphQLInt) },      // GitHub: forks_count → nós: forksCount
    openIssuesCount: { type: new GraphQLNonNull(GraphQLInt) }, // GitHub: open_issues_count → nós: openIssuesCount
    language: { type: GraphQLString },                      // Linguagem principal (pode ser null)
    owner: { type: new GraphQLNonNull(OwnerType) },        // Usa o tipo Owner definido acima
    createdAt: { type: new GraphQLNonNull(GraphQLString) }, // Data em formato ISO string
    updatedAt: { type: new GraphQLNonNull(GraphQLString) }  // Data em formato ISO string
  }
});

/* 
🏗️ REPOSITORY CONNECTION TYPE - Container para paginação
ORIGEM: RepositoryService monta este objeto juntando dados do GitHub + cálculos de paginação
DESTINO: Angular recebe lista de repos + info pra montar paginação (botões próximo/anterior)
USO: Quando Angular pede página 2 de 10 repos, recebe este formato completo
EXEMPLO: { repositories: [...], currentPage: 2, totalPages: 50, hasNextPage: true, ... }
*/
const RepositoryConnectionType = new GraphQLObjectType({
  name: 'RepositoryConnection',
  fields: {
    totalCount: { type: new GraphQLNonNull(GraphQLInt) },     // Ex: 15.000 repos encontrados no total
    repositories: { 
      type: new GraphQLNonNull(                               // Array que SEMPRE existe (mesmo que vazio)
        new GraphQLList(                                      // de repositórios 
          new GraphQLNonNull(RepositoryType)                  // onde cada repo é obrigatório/válido
        )
      ) 
    },
    hasNextPage: { type: new GraphQLNonNull(GraphQLBoolean) },    // Angular usa pra mostrar botão "Próximo"
    hasPreviousPage: { type: new GraphQLNonNull(GraphQLBoolean) }, // Angular usa pra mostrar botão "Anterior"
    currentPage: { type: new GraphQLNonNull(GraphQLInt) },        // Angular mostra "Página X de Y"
    totalPages: { type: new GraphQLNonNull(GraphQLInt) }          // Angular calcula paginação
  }
});

/* 
🏗️ QUERY TYPE - As "perguntas" que o Angular pode fazer
FUNÇÃO: Define TODAS as operações disponíveis pro frontend
CONEXÃO: Cada query aqui conecta com uma função em repositoryResolvers.js
USADO PELO ANGULAR: vai fazer queries como:
query { searchRepositories(query: "react", page: 1) { repositories { name, stargazersCount } } }
*/
const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    /* 
    📋 QUERY: searchRepositories
    O QUE FAZ: Angular usa pra buscar repos com termo de pesquisa
    FLUXO: Angular → schema → repositoryResolvers.searchRepositories → RepositoryService → GitHub API
    ENTRADA: query="react", page=1, perPage=10
    SAÍDA: RepositoryConnection (lista + paginação)
    */
    searchRepositories: {
      type: new GraphQLNonNull(RepositoryConnectionType), // SEMPRE retorna algo (mesmo que lista vazia)
      args: {
        query: { type: new GraphQLNonNull(GraphQLString) },   // OBRIGATÓRIO: termo de busca
        page: { type: GraphQLInt, defaultValue: 1 },          // OPCIONAL: página (padrão 1)
        perPage: { type: GraphQLInt, defaultValue: 10 }       // OPCIONAL: items por página (padrão 10)
      },
      resolve: repositoryResolvers.searchRepositories        // CHAMA esta função quando Angular fizer a query
    },
    
    /* 
    📋 QUERY: repository
    O QUE FAZ: Angular usa pra pegar detalhes de UM repo específico
    FLUXO: Angular → schema → repositoryResolvers.repository → RepositoryService → GitHub API
    ENTRADA: owner="facebook", name="react"
    SAÍDA: Repository OU null (se não existir)
    */
    repository: {
      type: RepositoryType,                                   // PODE ser null se repo não existir
      args: {
        owner: { type: new GraphQLNonNull(GraphQLString) },   // OBRIGATÓRIO: ex "facebook"
        name: { type: new GraphQLNonNull(GraphQLString) }     // OBRIGATÓRIO: ex "react"
      },
      resolve: repositoryResolvers.repository                // CHAMA esta função quando Angular fizer a query
    }
  }
});

/* 
🎯 SCHEMA FINAL - Junta tudo e entrega pro servidor
FUNÇÃO: Este objeto é usado em server.js no endpoint /graphql
CONEXÃO: server.js importa este schema e disponibiliza pro Angular
RESULTADO: Angular pode acessar http://localhost:4000/graphql e fazer qualquer query definida acima
*/
const schema = new GraphQLSchema({
  query: QueryType // Disponibiliza todas as queries definidas acima
});

module.exports = schema;

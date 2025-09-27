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
const repositoryResolvers = require('../resolvers/repositoryResolvers');

const OwnerType = new GraphQLObjectType({
  name: 'Owner',
  fields: {
    login: { type: new GraphQLNonNull(GraphQLString) },    // Ex: "facebook", "microsoft"
    avatarUrl: { type: new GraphQLNonNull(GraphQLString) }, // Foto do perfil do GitHub
    url: { type: new GraphQLNonNull(GraphQLString) }        // Link pro perfil do GitHub
  }
});

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

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {

    searchRepositories: {
      type: new GraphQLNonNull(RepositoryConnectionType), // SEMPRE retorna algo (mesmo que lista vazia)
      args: {
        query: { type: new GraphQLNonNull(GraphQLString) },   // OBRIGATÓRIO: termo de busca
        page: { type: GraphQLInt, defaultValue: 1 },          // OPCIONAL: página (padrão 1)
        perPage: { type: GraphQLInt, defaultValue: 10 }       // OPCIONAL: items por página (padrão 10)
      },
      resolve: repositoryResolvers.searchRepositories        // CHAMA esta função quando Angular fizer a query
    },

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

const schema = new GraphQLSchema({
  query: QueryType // Disponibiliza todas as queries definidas acima
});

module.exports = schema;

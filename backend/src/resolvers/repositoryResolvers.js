const RepositoryService = require('../services/RepositoryService');

const repositoryResolvers = {
  searchRepositories: async (parent, { query, page = 1, perPage = 10 }) => {
    try {
      const result = await RepositoryService.searchRepositories(query, page, perPage);
      return result; // Retorna os dados formatados para o frontend
    } catch (error) {
      throw new Error(`Erro ao buscar repositórios: ${error.message}`);
    }
  },
  repository: async (parent, { owner, name }) => {
    try {
      const result = await RepositoryService.getRepository(owner, name);
      return result; // Retorna os dados do repositório
    } catch (error) {
      throw new Error(`Erro ao buscar repositório: ${error.message}`);
    }
  },
};
module.exports = repositoryResolvers;

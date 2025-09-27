const axios = require('axios'); // Biblioteca pra fazer requisições HTTP

class RepositoryService {
  constructor() {

    this.githubApi = axios.create({
      baseURL: 'https://api.github.com',                    // Todas as chamadas vão pra GitHub
      headers: {
        'Accept': 'application/vnd.github.v3+json',         // Versão 3 da API (mais estável)
        'User-Agent': 'Notro-Challenge-App'                 // Identificação obrigatória
      }
    });
  }

  async searchRepositories(query, page = 1, perPage = 10) {
    try {

      const response = await this.githubApi.get('/search/repositories', {
        params: {
          q: query,              // Angular digitou "react" → GitHub busca repos com "react"
          page: page,            // Angular quer página 2 → GitHub retorna página 2
          per_page: perPage,     // Angular quer 10 por página → GitHub limita em 10
          sort: 'stars',         // Ordena por popularidade (mais estrelas primeiro)
          order: 'desc'          // Decrescente (50k estrelas antes de 1k estrelas)
        }
      });

      const { data } = response; // GitHub manda: { total_count, items, incomplete_results }
      const totalPages = Math.ceil(data.total_count / perPage); // Ex: 50000 repos ÷ 10 = 5000 páginas

      return {
        totalCount: data.total_count,                           // GitHub: total_count → Nós: totalCount
        repositories: data.items.map(this.formatRepository),    // Array de repos limpos (método abaixo)
        hasNextPage: page < totalPages,                         // Angular mostra botão "Próximo"?
        hasPreviousPage: page > 1,                             // Angular mostra botão "Anterior"?
        currentPage: page,                                      // Angular mostra "Página X"
        totalPages: totalPages                                  // Angular mostra "de Y páginas"
      };
    } catch (error) {

      console.error('Erro GitHub API:', error.response?.data || error.message);
      throw new Error('Falha ao buscar repositórios no GitHub');
    }
  }
  async getRepository(owner, name) {
    try {
      const response = await this.githubApi.get(`/repos/${owner}/${name}`);
      return this.formatRepository(response.data); // Formata e retorna
    } catch (error) {
      console.error('Erro GitHub API:', error.response?.data || error.message);
      throw new Error('Repositório não encontrado');
    }
  }

  formatRepository(repo) {
    return {
      id: repo.id.toString(),                           // GitHub manda number, GraphQL quer string
      name: repo.name,                                  // Ex: "react" (igual no GitHub)
      fullName: repo.full_name,                         // GitHub: full_name → Nós: fullName
      description: repo.description || 'Sem descrição', // GitHub pode mandar null
      url: repo.html_url,                               // GitHub: html_url → Nós: url (pro browser)
      stargazersCount: repo.stargazers_count || 0,      // GitHub: stargazers_count → stargazersCount
      watchersCount: repo.watchers_count || 0,          // GitHub: watchers_count → watchersCount
      forksCount: repo.forks_count || 0,                // GitHub: forks_count → forksCount
      openIssuesCount: repo.open_issues_count || 0,     // GitHub: open_issues_count → openIssuesCount
      language: repo.language || 'N/A',                 // GitHub pode mandar null pra linguagem
      owner: {                                          // Objeto aninhado (bate com OwnerType)
        login: repo.owner.login,                        // Username do dono (ex: "facebook")
        avatarUrl: repo.owner.avatar_url,               // GitHub: avatar_url → avatarUrl
        url: repo.owner.html_url                        // GitHub: html_url → url (perfil do dono)
      },
      createdAt: repo.created_at,                       // ISO string (ex: "2013-05-24T16:15:54Z")
      updatedAt: repo.updated_at                        // ISO string da última atualização
    };
  }
}
module.exports = new RepositoryService();

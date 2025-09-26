/* 
🎯 PROPÓSITO DESTE ARQUIVO:
Esta é a "PONTE" entre nosso backend e a API do GitHub.
Transforma dados bagunçados do GitHub em dados limpos pro Angular.

📍 FLUXO:
1. repositoryResolvers.js chama métodos deste service
2. Service faz requisição HTTP pra GitHub API
3. GitHub retorna JSON bagunçado (snake_case, campos extras)
4. Service limpa/organiza os dados
5. Retorna dados limpos pro resolver
6. Resolver manda pro Angular via GraphQL

🔄 CONEXÕES:
- CHAMADO POR: repositoryResolvers.js (quando Angular faz query)
- FAZ CHAMADAS PARA: api.github.com (API pública do GitHub)
- RETORNA DADOS PARA: repositoryResolvers.js → schema.js → Angular
*/

const axios = require('axios'); // Biblioteca pra fazer requisições HTTP

/* 
🏭 SERVICE CLASS - Fabrica de dados limpos do GitHub
RESPONSABILIDADE: Buscar + limpar + organizar dados do GitHub
PADRÃO: Singleton (uma única instância compartilhada)
*/
class RepositoryService {
  constructor() {
    /* 
    🔧 AXIOS CONFIGURADO - Cliente HTTP específico pro GitHub
    POR QUE: GitHub API tem regras específicas (headers obrigatórios, rate limiting)
    HEADERS OBRIGATÓRIOS: GitHub exige User-Agent senão bloqueia
    */
    this.githubApi = axios.create({
      baseURL: 'https://api.github.com',                    // Todas as chamadas vão pra GitHub
      headers: {
        'Accept': 'application/vnd.github.v3+json',         // Versão 3 da API (mais estável)
        'User-Agent': 'Notro-Challenge-App'                 // Identificação obrigatória
      }
    });
  }

  /* 
  🔍 SEARCH REPOSITORIES - Método PRINCIPAL chamado pelo Angular
  CHAMADO POR: repositoryResolvers.searchRepositories()
  RECEBE: query="react", page=1, perPage=10 (do Angular via GraphQL)
  RETORNA: Objeto RepositoryConnection pronto pro Angular
  */
  async searchRepositories(query, page = 1, perPage = 10) {
    try {
      /* 
      🌐 GITHUB API CALL - Requisição real pro GitHub
      ENDPOINT: GET https://api.github.com/search/repositories
      EXEMPLO URL FINAL: /search/repositories?q=react&page=1&per_page=10&sort=stars&order=desc
      RESPOSTA: JSON com total_count + array "items" com repos
      */
      const response = await this.githubApi.get('/search/repositories', {
        params: {
          q: query,              // Angular digitou "react" → GitHub busca repos com "react"
          page: page,            // Angular quer página 2 → GitHub retorna página 2
          per_page: perPage,     // Angular quer 10 por página → GitHub limita em 10
          sort: 'stars',         // Ordena por popularidade (mais estrelas primeiro)
          order: 'desc'          // Decrescente (50k estrelas antes de 1k estrelas)
        }
      });

      /* 
      🧮 DATA PROCESSING - Transforma resposta bagunçada em dados úteis
      GITHUB RETORNA: { total_count: 50000, items: [...] }
      NÓS TRANSFORMAMOS: Em RepositoryConnection com paginação calculada
      */
      const { data } = response; // GitHub manda: { total_count, items, incomplete_results }
      const totalPages = Math.ceil(data.total_count / perPage); // Ex: 50000 repos ÷ 10 = 5000 páginas

      /* 
      📦 RETURN FORMATTED DATA - Formato final que Angular vai receber
      IMPORTANTE: Este formato DEVE bater com RepositoryConnectionType no schema.js
      TRANSFORMAÇÃO: GitHub snake_case → Nosso camelCase + paginação calculada
      */
      return {
        totalCount: data.total_count,                           // GitHub: total_count → Nós: totalCount
        repositories: data.items.map(this.formatRepository),    // Array de repos limpos (método abaixo)
        hasNextPage: page < totalPages,                         // Angular mostra botão "Próximo"?
        hasPreviousPage: page > 1,                             // Angular mostra botão "Anterior"?
        currentPage: page,                                      // Angular mostra "Página X"
        totalPages: totalPages                                  // Angular mostra "de Y páginas"
      };
    } catch (error) {
      /* 
      ❌ ERROR HANDLING - Se GitHub estiver fora ou API falhar
      CASOS: Rate limit, GitHub fora do ar, query inválida, sem internet
      RESULTADO: Angular recebe erro via GraphQL
      */
      console.error('Erro GitHub API:', error.response?.data || error.message);
      throw new Error('Falha ao buscar repositórios no GitHub');
    }
  }

  // GET SINGLE REPOSITORY - Busca um repositório específico
  async getRepository(owner, name) {
    try {
      // SINGLE REPO API CALL - Busca repo específico (ex: facebook/react)
      const response = await this.githubApi.get(`/repos/${owner}/${name}`);
      return this.formatRepository(response.data); // Formata e retorna
    } catch (error) {
      // ERROR HANDLING - Se repo não existe ou erro de API
      console.error('Erro GitHub API:', error.response?.data || error.message);
      throw new Error('Repositório não encontrado');
    }
  }

  /* 
  🧹 FORMAT REPOSITORY - O "tradutor" principal GitHub → Angular
  ENTRADA: Objeto repo bagunçado do GitHub (snake_case, campos extras, nulls)
  SAÍDA: Objeto limpo que bate exatamente com RepositoryType do schema.js
  
  🔄 TRANSFORMAÇÕES PRINCIPAIS:
  - GitHub: full_name → Nós: fullName (camelCase)
  - GitHub: stargazers_count → Nós: stargazersCount 
  - GitHub: html_url → Nós: url
  - GitHub: owner.avatar_url → Nós: owner.avatarUrl
  - GitHub: null → Nós: valores padrão seguros
  
  ⚠️ CRÍTICO: Se este formato não bater com schema.js, Angular quebra!
  */
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

// EXPORT SINGLETON - Exporta uma única instância da classe (padrão singleton)
module.exports = new RepositoryService();

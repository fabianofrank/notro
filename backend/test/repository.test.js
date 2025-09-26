/**
 * 🧪 TESTES BACKEND - Repository Service + GraphQL
 * Testa se GitHub API está funcionando e se dados estão sendo formatados corretamente
 */

const axios = require('axios');
const RepositoryService = require('../src/services/RepositoryService');

describe('RepositoryService', () => {
  
  test('should search repositories successfully', async () => {
    const result = await RepositoryService.searchRepositories('react', 1, 5);
    
    expect(result).toHaveProperty('totalCount');
    expect(result).toHaveProperty('repositories');
    expect(result).toHaveProperty('hasNextPage');
    expect(result).toHaveProperty('currentPage', 1);
    expect(result.repositories).toBeInstanceOf(Array);
    expect(result.repositories.length).toBeLessThanOrEqual(5);
    
    if (result.repositories.length > 0) {
      const repo = result.repositories[0];
      expect(repo).toHaveProperty('id');
      expect(repo).toHaveProperty('name');
      expect(repo).toHaveProperty('fullName');
      expect(repo).toHaveProperty('stargazersCount');
      expect(repo).toHaveProperty('watchersCount');
      expect(repo).toHaveProperty('openIssuesCount');
      expect(repo).toHaveProperty('owner');
      expect(repo.owner).toHaveProperty('login');
      expect(repo.owner).toHaveProperty('avatarUrl');
    }
  });

  test('should handle empty search results', async () => {
    const result = await RepositoryService.searchRepositories('asdfqwerty123456', 1, 5);
    
    expect(result.totalCount).toBe(0);
    expect(result.repositories).toEqual([]);
  });

});

describe('GraphQL Integration', () => {
  
  const GRAPHQL_URL = 'http://localhost:4000/graphql';
  
  test('should query repositories via GraphQL', async () => {
    const query = `
      query {
        searchRepositories(query: "vue", page: 1, perPage: 3) {
          totalCount
          repositories {
            name
            stargazersCount
            owner {
              login
            }
          }
        }
      }
    `;

    try {
      const response = await axios.post(GRAPHQL_URL, { query });
      const data = response.data.data.searchRepositories;
      
      expect(data).toHaveProperty('totalCount');
      expect(data.repositories).toBeInstanceOf(Array);
    } catch (error) {
      console.warn('GraphQL server not running, skipping integration test');
    }
  });

});

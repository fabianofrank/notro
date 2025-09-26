// Teste do GraphQL + GitHub API
const axios = require('axios');

async function testGraphQL() {
  try {
    console.log('🧪 Testando GraphQL + GitHub API...');
    
    // Query simples para buscar repositórios React
    const query = `
      query {
        searchRepositories(query: "react", page: 1, perPage: 3) {
          totalCount
          currentPage
          totalPages
          hasNextPage
          repositories {
            name
            fullName
            stargazersCount
            description
            language
            owner {
              login
              avatarUrl
            }
          }
        }
      }
    `;

    console.log('📡 Fazendo requisição para GraphQL...');
    const response = await axios.post('http://localhost:4000/graphql', {
      query: query
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Sucesso! Backend + GitHub API funcionando!');
    console.log('📊 Total de repositórios encontrados:', response.data.data.searchRepositories.totalCount);
    console.log('📄 Página atual:', response.data.data.searchRepositories.currentPage);
    console.log('📋 Repositórios retornados:');
    
    response.data.data.searchRepositories.repositories.forEach((repo, index) => {
      console.log(`${index + 1}. ${repo.fullName} (⭐ ${repo.stargazersCount})`);
      console.log(`   Linguagem: ${repo.language}`);
      console.log(`   Descrição: ${repo.description?.substring(0, 80)}...`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('🔴 Servidor não está rodando!');
      console.error('Execute: cd backend && npm run dev');
    } else if (error.response) {
      console.error('🔴 Erro da API:');
      console.error(JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Executar teste
testGraphQL();

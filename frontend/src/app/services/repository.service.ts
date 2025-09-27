import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RepositoryConnection } from '../models/repository.model';

/* 
🎯 REPOSITORY SERVICE - Conecta Angular com Backend GraphQL
RESPONSABILIDADE: Fazer queries GraphQL para buscar repositórios
FLUXO: Component → Service → GraphQL → Backend → GitHub API → volta dados
*/

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {

  constructor(private apollo: Apollo) {}

  /* 
  🔍 SEARCH REPOSITORIES QUERY - Query GraphQL principal
  ENTRADA: query="react", page=1, perPage=10
  SAÍDA: Observable<RepositoryConnection> com repos + paginação
  USO: searchComponent.ts vai chamar este método
  */
  searchRepositories(query: string, page: number = 1, perPage: number = 10): Observable<RepositoryConnection> {
    
    // GraphQL Query que bate exatamente com o schema do backend
    const SEARCH_REPOSITORIES = gql`
      query SearchRepositories($query: String!, $page: Int, $perPage: Int) {
        searchRepositories(query: $query, page: $page, perPage: $perPage) {
          totalCount
          currentPage
          totalPages
          hasNextPage
          hasPreviousPage
          repositories {
            id
            name
            fullName
            description
            url
            stargazersCount
            watchersCount
            forksCount
            openIssuesCount
            language
            owner {
              login
              avatarUrl
              url
            }
            createdAt
            updatedAt
          }
        }
      }
    `;

    return this.apollo.query<{ searchRepositories: RepositoryConnection }>({
      query: SEARCH_REPOSITORIES,
      variables: { query, page, perPage },
      fetchPolicy: 'network-only', // Sempre buscar dados frescos
      errorPolicy: 'all' // Mostra erros + dados parciais
    }).pipe(
      map(result => result.data.searchRepositories)
    );
  }

  /* 
  🔍 GET SINGLE REPOSITORY - Para detalhes de um repo específico
  ENTRADA: owner="facebook", name="react" 
  SAÍDA: Observable<Repository> com dados do repo
  USO: Futuro component de detalhes (se precisar)
  */
  getRepository(owner: string, name: string): Observable<any> {
    const GET_REPOSITORY = gql`
      query GetRepository($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          id
          name
          fullName
          description
          url
          stargazersCount
          watchersCount
          forksCount
          openIssuesCount
          language
          owner {
            login
            avatarUrl
            url
          }
          createdAt
          updatedAt
        }
      }
    `;

    return this.apollo.query({
      query: GET_REPOSITORY,
      variables: { owner, name }
    }).pipe(
      map(result => result.data)
    );
  }
}

// Repository Models - Interfaces que batem com o GraphQL Schema do backend

export interface Owner {
  login: string;
  avatarUrl: string;
  url: string;
}

export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description?: string;
  url: string;
  stargazersCount: number;
  watchersCount: number;
  forksCount: number;
  openIssuesCount: number;
  language?: string;
  owner: Owner;
  createdAt: string;
  updatedAt: string;
}

export interface RepositoryConnection {
  totalCount: number;
  repositories: Repository[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  totalPages: number;
}

// Para usar no search form
export interface SearchParams {
  query: string;
  page: number;
  perPage: number;
}

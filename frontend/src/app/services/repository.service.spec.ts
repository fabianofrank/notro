import { TestBed } from '@angular/core/testing';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular-testing';
import { RepositoryService } from './repository.service';

describe('RepositoryService', () => {
  let service: RepositoryService;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [RepositoryService]
    });
    service = TestBed.inject(RepositoryService);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search repositories', () => {
    const mockResponse = {
      searchRepositories: {
        totalCount: 100,
        currentPage: 1,
        totalPages: 10,
        hasNextPage: true,
        hasPreviousPage: false,
        repositories: [
          {
            id: '1',
            name: 'test-repo',
            fullName: 'user/test-repo',
            description: 'Test repository',
            url: 'https://github.com/user/test-repo',
            stargazersCount: 50,
            watchersCount: 25,
            forksCount: 10,
            openIssuesCount: 5,
            language: 'JavaScript',
            owner: {
              login: 'user',
              avatarUrl: 'https://avatar.url',
              url: 'https://github.com/user'
            },
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-02T00:00:00Z'
          }
        ]
      }
    };

    service.searchRepositories('test', 1, 10).subscribe(result => {
      expect(result).toEqual(mockResponse.searchRepositories);
      expect(result.repositories.length).toBe(1);
      expect(result.repositories[0].name).toBe('test-repo');
    });

    const op = controller.expectOne(service => service.operation.operationName === 'SearchRepositories');
    expect(op.operation.variables).toEqual({ query: 'test', page: 1, perPage: 10 });
    
    op.flush({ data: mockResponse });
  });
});

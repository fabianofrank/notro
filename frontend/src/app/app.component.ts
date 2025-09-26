import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SearchComponent } from './components/search/search.component';
import { RepositoryListComponent } from './components/repository-list/repository-list.component';
import { PaginationComponent } from './components/pagination/pagination.component';

import { RepositoryService } from './services/repository.service';
import { Repository, RepositoryConnection, SearchParams } from './models/repository.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    SearchComponent,
    RepositoryListComponent,
    PaginationComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'GitHub Repository Search';
  
  // Estado da aplicação
  repositories: Repository[] = [];
  loading = false;
  searchParams: SearchParams | null = null;
  repositoryConnection: RepositoryConnection | null = null;

  constructor(private repositoryService: RepositoryService) {}

  // Executar busca quando componente de busca emitir evento
  onSearch(searchParams: SearchParams): void {
    if (!searchParams.query.trim()) {
      this.clearResults();
      return;
    }

    this.searchParams = searchParams;
    this.executeSearch();
  }

  // Navegar para página específica
  onPageChange(page: number): void {
    if (this.searchParams) {
      this.searchParams.page = page;
      this.executeSearch();
    }
  }

  // Executar busca GraphQL
  private executeSearch(): void {
    if (!this.searchParams) return;

    this.loading = true;

    this.repositoryService.searchRepositories(
      this.searchParams.query,
      this.searchParams.page,
      this.searchParams.perPage
    ).subscribe({
      next: (result: RepositoryConnection) => {
        this.repositoryConnection = result;
        this.repositories = result.repositories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao buscar repositórios:', error);
        this.loading = false;
        this.clearResults();
      }
    });
  }

  // Limpar resultados
  private clearResults(): void {
    this.repositories = [];
    this.repositoryConnection = null;
    this.searchParams = null;
  }
}

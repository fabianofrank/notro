import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Repository } from '../../models/repository.model';

/* 
📋 REPOSITORY LIST COMPONENT - Lista de repositórios
RESPONSABILIDADE: Exibir lista de repositórios com informações principais
ENTRADA: Lista de repositórios via @Input
USO: AppComponent passa lista após busca GraphQL
*/

@Component({
  selector: 'app-repository-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './repository-list.component.html',
  styleUrl: './repository-list.component.scss'
})
export class RepositoryListComponent {
  
  // Lista de repositórios recebida do componente pai
  @Input() repositories: Repository[] = [];
  @Input() loading: boolean = false;
  @Input() totalCount: number = 0;

  /* 
  🔗 OPEN REPOSITORY - Abrir repo no GitHub
  FUNÇÃO: Abrir link do repositório em nova aba
  */
  openRepository(url: string): void {
    window.open(url, '_blank');
  }

  /* 
  👤 OPEN OWNER - Abrir perfil do dono
  FUNÇÃO: Abrir perfil do usuário/organização no GitHub
  */
  openOwner(url: string): void {
    window.open(url, '_blank');
  }

  /* 
  📅 FORMAT DATE - Formatar data de forma amigável
  FUNÇÃO: Converter ISO string para formato br
  */
  formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('pt-BR');
  }

  /* 
  🔢 FORMAT NUMBER - Formatar números grandes
  FUNÇÃO: 1000 → 1k, 1000000 → 1M
  */
  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  }
}
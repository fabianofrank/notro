import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() hasNextPage: boolean = false;
  @Input() hasPreviousPage: boolean = false;
  
  @Output() pageChange = new EventEmitter<number>();

  goToPage(page: number): void {
    console.log('🎯 goToPage chamado:', page);
    this.pageChange.emit(page);
  }

  previousPage(): void {
    console.log('⬅️ Anterior clicado');
    if (this.hasPreviousPage) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    console.log('➡️ Próximo clicado');
    if (this.hasNextPage) {
      this.goToPage(this.currentPage + 1);
    }
  }
}
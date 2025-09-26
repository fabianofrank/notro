import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SearchParams } from '../../models/repository.model';

/* 
🔍 SEARCH COMPONENT - Barra de busca de repositórios
RESPONSABILIDADE: Capturar termo de busca do usuário e emitir evento
FLUXO: User digita → form válido → emit searchEvent → AppComponent recebe
*/

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule, 
    MatFormFieldModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  
  // Form reativo para busca
  searchForm: FormGroup;
  
  // Event emitter para comunicar com componente pai (App)
  @Output() searchEvent = new EventEmitter<SearchParams>();
  
  constructor(private fb: FormBuilder) {
    // Criar form com validação
    this.searchForm = this.fb.group({
      query: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  /* 
  📤 ON SEARCH - Executado quando user clica "Buscar" ou pressiona Enter
  FUNÇÃO: Validar form → emitir evento com parâmetros de busca
  RESULTADO: AppComponent recebe e faz query GraphQL
  */
  onSearch(): void {
    if (this.searchForm.valid) {
      const query = this.searchForm.get('query')?.value?.trim();
      
      if (query) {
        // Emitir evento com parâmetros de busca (sempre página 1 em nova busca)
        const searchParams: SearchParams = {
          query: query,
          page: 1,
          perPage: 10
        };
        
        this.searchEvent.emit(searchParams);
      }
    }
  }

  /* 
  🔥 CLEAR SEARCH - Limpar busca
  FUNÇÃO: Reset form + emit evento vazio para limpar resultados
  */
  clearSearch(): void {
    this.searchForm.reset();
    this.searchEvent.emit({ query: '', page: 1, perPage: 10 });
  }

  // Getter para facilitar validação no template
  get queryControl() {
    return this.searchForm.get('query');
  }
}
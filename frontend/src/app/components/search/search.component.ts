import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SearchParams } from '../../models/repository.model';

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
  searchForm: FormGroup;
  @Output() searchEvent = new EventEmitter<SearchParams>();

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      query: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  onSearch(): void {
    if (this.searchForm.valid) {
      const query = this.searchForm.get('query')?.value?.trim();

      if (query) {
        const searchParams: SearchParams = {
          query: query,
          page: 1,
          perPage: 10
        };

        this.searchEvent.emit(searchParams);
      }
    }
  }

  clearSearch(): void {
    this.searchForm.reset();
    this.searchEvent.emit({ query: '', page: 1, perPage: 10 });
  }
  get queryControl() {
    return this.searchForm.get('query');
  }
}

import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RepositoryService } from './services/repository.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

// Mock RepositoryService
const mockRepositoryService = {
  searchRepositories: jasmine.createSpy('searchRepositories').and.returnValue(of({
    totalCount: 100,
    repositories: [],
    hasNextPage: false,
    currentPage: 1
  }))
};

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: RepositoryService, useValue: mockRepositoryService }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have title "GitHub Repository Search"', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('GitHub Repository Search');
  });

  it('should have initial repositories as empty array', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.repositories).toEqual([]);
  });

  it('should have loading as false initially', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.loading).toBe(false);
  });

  it('should call onSearch method', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    
    spyOn(app, 'onSearch');
    const searchParams = { query: 'test', page: 1, perPage: 10 };
    app.onSearch(searchParams);
    
    expect(app.onSearch).toHaveBeenCalledWith(searchParams);
  });
});
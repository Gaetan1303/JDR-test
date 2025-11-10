import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { RouterTestingModule } from '@angular/router/testing';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, RouterTestingModule],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    // The application header uses a toolbar span.title containing the app title
    expect(compiled.querySelector('.title')?.textContent).toContain('Légende des 5 Anneaux');
  });
});

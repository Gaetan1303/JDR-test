import { Injectable, signal } from '@angular/core';

export type Theme = 'bushi' | 'shugenja' | 'moine' | 'marchand' | 'courtisan';

export interface ThemeInfo {
  id: Theme;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'l5r-selected-theme';
  
  currentTheme = signal<Theme>('bushi');
  
  readonly themes: ThemeInfo[] = [
    {
      id: 'bushi',
      name: 'Bushi',
      description: 'Guerrier samouraï, maître des armes'
    },
    {
      id: 'shugenja',
      name: 'Shugenja',
      description: 'Prêtre mystique qui commande aux éléments'
    },
    {
      id: 'moine',
      name: 'Moine',
      description: 'Ascète discipliné en quête d\'illumination'
    },
    {
      id: 'marchand',
      name: 'Marchand',
      description: 'Artisan, forgeron et commerçant'
    },
    {
      id: 'courtisan',
      name: 'Courtisan',
      description: 'Maître de l\'étiquette et de la diplomatie'
    }
  ];

  constructor() {
    this.loadTheme();
    this.applyTheme(this.currentTheme());
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    this.applyTheme(theme);
    this.saveTheme(theme);
  }

  private applyTheme(theme: Theme): void {
    // Retirer tous les thèmes existants
    document.body.classList.remove(
      'theme-bushi',
      'theme-shugenja',
      'theme-moine',
      'theme-marchand',
      'theme-courtisan'
    );
    
    // Appliquer le nouveau thème
    document.body.classList.add(`theme-${theme}`);
  }

  private saveTheme(theme: Theme): void {
    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  private loadTheme(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    if (saved && this.themes.some(t => t.id === saved)) {
      this.currentTheme.set(saved);
    }
  }

  getThemeInfo(themeId: Theme): ThemeInfo | undefined {
    return this.themes.find(t => t.id === themeId);
  }
}

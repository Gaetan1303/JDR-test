import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ThemeService, Theme } from '../services/theme.service';

@Component({
  selector: 'app-theme-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule
  ],
  template: `
    <button 
      mat-button 
      [matMenuTriggerFor]="themeMenu"
      class="theme-button">
      Style: {{ getCurrentThemeName() }}
    </button>

    <mat-menu #themeMenu="matMenu" class="theme-menu">
      <div class="theme-menu-header">
        <span>Choisir un style</span>
      </div>
      
      @for (theme of themeService.themes; track theme.id) {
        <button 
          mat-menu-item 
          (click)="selectTheme(theme.id)"
          [class.selected]="themeService.currentTheme() === theme.id"
          class="theme-menu-item">
          <div class="theme-item-content">
            <div class="theme-item-name">{{ theme.name }}</div>
            <div class="theme-item-desc">{{ theme.description }}</div>
          </div>
          @if (themeService.currentTheme() === theme.id) {
            <span class="check-mark">Actif</span>
          }
        </button>
      }
    </mat-menu>
  `,
  styles: [`
    .theme-button {
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    :host ::ng-deep .theme-menu {
      .mat-mdc-menu-content {
        padding: 0 !important;
      }
    }

    .theme-menu-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px;
      background: linear-gradient(135deg, #1976d2, #42a5f5);
      color: white;
      font-weight: 500;
      font-size: 16px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      justify-content: center;
    }

    .theme-menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px !important;
      min-height: 64px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease;

      &:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }

      &.selected {
        background-color: rgba(25, 118, 210, 0.08);
        border-left: 3px solid #1976d2;
      }

      .theme-item-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;

        .theme-item-name {
          font-weight: 500;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.87);
        }

        .theme-item-desc {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.6);
          line-height: 1.3;
        }
      }

      .check-mark {
        color: #1976d2;
        font-size: 12px;
        font-weight: bold;
        text-transform: uppercase;
      }
    }
  `]
})
export class ThemeSelectorComponent {
  themeService = inject(ThemeService);

  selectTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  getCurrentThemeName(): string {
    const current = this.themeService.getThemeInfo(this.themeService.currentTheme());
    return current?.name || 'Bushi';
  }
}

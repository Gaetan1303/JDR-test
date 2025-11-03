import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Characters } from './characters/characters';
import { CharacterCreator } from './character-creator/character-creator';
import { CharacterSheet } from './character-sheet/character-sheet';
import { Library } from './library/library';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'characters', component: Characters },
  { path: 'character-sheet/:id', component: CharacterSheet },
  { path: 'character-creator', component: CharacterCreator },
  { path: 'library', component: Library },
  // Placeholders pour les futures pages
  { path: 'campaigns', redirectTo: '/dashboard' },
  { path: 'game-master', redirectTo: '/dashboard' }
];


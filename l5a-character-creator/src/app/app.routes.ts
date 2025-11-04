import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Characters } from './characters/characters';
import { CharacterCreator } from './character-creator/character-creator';
import { CharacterSheet } from './character-sheet/character-sheet';
import { Library } from './library/library';
import { Login } from './auth/login';
import { Register } from './auth/register';
import { Multiplayer } from './multiplayer/multiplayer';
import { PlayCharacter } from './play-character/play-character';


export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'characters', component: Characters },
  { path: 'character-sheet/:id', component: CharacterSheet },
  { path: 'character-creator', component: CharacterCreator },
  { path: 'library', component: Library },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'multiplayer', component: Multiplayer },
  { path: 'play-character', component: PlayCharacter },
  // Placeholders pour les futures pages
  { path: 'campaigns', redirectTo: '/dashboard' },
  { path: 'game-master', redirectTo: '/dashboard' }
];


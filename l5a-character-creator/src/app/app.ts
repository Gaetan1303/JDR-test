import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CharacterCreator } from './character-creator/character-creator';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CharacterCreator],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('L5A Character Creator');
}

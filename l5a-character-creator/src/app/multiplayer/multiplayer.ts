import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../services/auth.service';
import { MultiplayerService, Room, ChatMessage, DiceRoll } from '../services/multiplayer.service';

@Component({
  selector: 'app-multiplayer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatListModule, MatCheckboxModule],
  template: `
    <div class="container">
      @if (auth.isAuthenticated()) {
        @if (!currentRoomId()) {
          <div class="lobby">
            <h2>Salon Multijoueur</h2>
            @if (!multi.connected()) {
              <p class="warning">⚠️ Connexion au serveur GM_L5R...</p>
            }
            <mat-card class="create-room">
              <h3>Créer une salle (MJ)</h3>
              <div class="row">
                <mat-form-field appearance="outline" class="grow">
                  <mat-label>Nom de la salle</mat-label>
                  <input matInput [(ngModel)]="roomName" name="roomName">
                </mat-form-field>
                <mat-form-field appearance="outline" class="narrow">
                  <mat-label>Joueurs max</mat-label>
                  <input matInput type="number" [(ngModel)]="maxPlayers" name="maxPlayers" min="1" max="6">
                </mat-form-field>
                <mat-checkbox [(ngModel)]="isPublic" name="isPublic">Publique</mat-checkbox>
                <button mat-raised-button color="primary" (click)="createRoom()" [disabled]="!multi.connected()">Créer</button>
              </div>
              @if (error) {
                <p class="error">{{ error }}</p>
              }
            </mat-card>
            <mat-card class="search-room">
              <h3>Rejoindre par ID</h3>
              <div class="row">
                <mat-form-field appearance="outline" class="grow">
                  <mat-label>ID de la session</mat-label>
                  <input matInput [(ngModel)]="searchRoomId" name="searchRoomId" placeholder="ex: 123e4567-e89b-12d3-a456-426614174000">
                </mat-form-field>
                <button mat-stroked-button color="primary" (click)="findAndJoinRoom()" [disabled]="!multi.connected()">Chercher</button>
              </div>
            </mat-card>
            <mat-card class="rooms">
              <h3>Salles publiques ({{ multi.publicRooms().length }})</h3>
              @if (multi.publicRooms().length > 0) {
                <mat-list>
                  @for (r of multi.publicRooms(); track r) {
                    <mat-list-item>
                      <div class="room-line">
                        <div class="info">
                          <div class="title">{{ r.name }}</div>
                          <div class="sub">MJ: {{ r.gmName }} • {{ r.players.length }}/{{ r.maxPlayers }} joueurs • ID: {{ r.id }}</div>
                        </div>
                        <div class="actions">
                          <button mat-stroked-button color="primary" (click)="enterAsGM(r)">Entrer (MJ)</button>
                          <button mat-raised-button color="accent" (click)="joinAsPlayer(r)">Rejoindre</button>
                        </div>
                      </div>
                    </mat-list-item>
                  }
                </mat-list>
              } @else {
                <p class="no-data">Aucune salle publique disponible</p>
              }
            </mat-card>
          </div>
        } @else {
          <div class="room">
            <div class="header">
              <button mat-stroked-button color="primary" (click)="leaveRoom()">← Retour au salon</button>
              <div class="title">
                <h2>{{ currentRoom()?.name }}</h2>
                <div class="sub">ID: {{ currentRoom()?.id }}</div>
                <div class="sub">MJ: {{ currentRoom()?.gmName }} • Joueurs: {{ (currentRoom()?.players?.length || 0) }}/{{ currentRoom()?.maxPlayers }}</div>
              </div>
            </div>
            <div class="columns">
              <mat-card class="chat">
                <h3>Chat</h3>
                <div class="messages" #scrollMe>
                  @for (m of messages(); track m) {
                    <div class="message">
                      <span class="when">{{ m.timestamp | date:'shortTime' }}</span>
                      <span class="who">{{ m.userName }}:</span>
                      <span class="text">{{ m.text }}</span>
                    </div>
                  }
                  @for (d of dice(); track d) {
                    <div class="roll">
                      <span class="when">{{ d.timestamp | date:'shortTime' }}</span>
                      <span class="who">{{ d.userName }}</span>
                      <span class="text">a lancé {{ d.rolled }}k{{ d.kept }} {{ d.reason ? '(' + d.reason + ')' : '' }} → [{{ d.dice.join(', ') }}] garde [{{ d.keptDice.join(', ') }}] = <b>{{ d.total }}</b></span>
                    </div>
                  }
                </div>
                <div class="composer">
                  <mat-form-field appearance="outline" class="grow">
                    <mat-label>Votre message</mat-label>
                    <input matInput [(ngModel)]="chatText" name="chatText" (keyup.enter)="sendChat()">
                  </mat-form-field>
                  <button mat-raised-button color="primary" (click)="sendChat()">Envoyer</button>
                </div>
              </mat-card>
              <mat-card class="tools">
                <h3>Dés (XkY)</h3>
                <div class="row">
                  <mat-form-field appearance="outline" class="narrow">
                    <mat-label>Jetés (X)</mat-label>
                    <input matInput type="number" [(ngModel)]="rolled" name="rolled" min="1" max="10">
                  </mat-form-field>
                  <mat-form-field appearance="outline" class="narrow">
                    <mat-label>Gardés (Y)</mat-label>
                    <input matInput type="number" [(ngModel)]="kept" name="kept" min="1" max="10">
                  </mat-form-field>
                  <mat-form-field appearance="outline" class="grow">
                    <mat-label>Raison (optionnel)</mat-label>
                    <input matInput [(ngModel)]="reason" name="reason">
                  </mat-form-field>
                  <button mat-raised-button color="accent" (click)="roll()">Lancer</button>
                </div>
                <div class="participants">
                  <h3>Participants</h3>
                  <ul>
                    <li>MJ: {{ currentRoom()?.gmName }}</li>
                    @for (p of (currentRoom()?.players || []); track p) {
                      <li>{{ p.name }} @if (p.characterName) {
                        <span>— {{ p.characterName }}</span>
                      }</li>
                    }
                  </ul>
                </div>
              </mat-card>
            </div>
          </div>
        }
      } @else {
        <mat-card class="guest-card">
          <h2>Multijoueur</h2>
          <p>Vous devez être connecté pour accéder au multijoueur.</p>
          <div class="actions">
            <a mat-stroked-button color="primary" routerLink="/login">Se connecter</a>
            <a mat-raised-button color="accent" routerLink="/register">Créer un compte</a>
          </div>
        </mat-card>
      }
    
    
    </div>
    `,
  styles: [`
    .container { padding: 16px; display: block; }
    .lobby h2 { margin: 0 0 12px; }
    .warning { color: #ff9800; font-weight: 600; }
    .row { display: flex; gap: 12px; align-items: center; }
    .grow { flex: 1; }
    .narrow { width: 140px; }
    .rooms .room-line { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
    .rooms .info .title { font-weight: 600; }
    .rooms .info .sub { opacity: 0.8; font-size: 12px; }
    .no-data { opacity: 0.6; font-style: italic; }
    .guest-card { max-width: 520px; margin: 40px auto; }
    .actions { display: flex; gap: 12px; align-items: center; }
    .error { color: #d32f2f; margin-top: 12px; }

    .room .header { display: flex; gap: 16px; align-items: center; margin-bottom: 12px; }
    .room .title h2 { margin: 0; }
    .room .title .sub { opacity: 0.8; font-size: 13px; }
    .columns { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
    .chat { display: flex; flex-direction: column; }
    .messages { height: 360px; overflow: auto; padding: 8px; display: flex; flex-direction: column; gap: 6px; background: rgba(0,0,0,0.1); }
    .message .when, .roll .when { opacity: 0.7; margin-right: 6px; font-size: 11px; }
    .message .who, .roll .who { font-weight: 600; margin-right: 6px; }
    .composer { display: flex; gap: 12px; align-items: center; margin-top: 8px; }
    .tools .participants ul { margin: 0; padding-left: 18px; }
    .create-room, .search-room, .rooms { margin-bottom: 16px; }
    @media (max-width: 900px) { .columns { grid-template-columns: 1fr; } }
  `]
})
export class Multiplayer implements OnDestroy {
  auth = inject(AuthService);
  multi = inject(MultiplayerService);

  // Lobby state
  roomName = '';
  maxPlayers = 3;
  isPublic = true;
  searchRoomId = '';
  error = '';

  // Room state
  currentRoomId = signal<string | null>(null);
  messages = signal<ChatMessage[]>([]);
  dice = signal<DiceRoll[]>([]);
  chatText = '';
  rolled = 5;
  kept = 3;
  reason = '';

  private unsubscribers: Array<() => void> = [];

  currentRoom = computed(() => {
    const id = this.currentRoomId();
    if (!id) return undefined;
    return this.multi.rooms().find(r => r.id === id);
  });

  async createRoom() {
    try {
      if (!this.roomName.trim()) { this.error = 'Nom requis'; return; }
      const room = await this.multi.createRoom(this.roomName.trim(), this.maxPlayers, this.isPublic);
      this.enterRoom(room);
      this.error = '';
    } catch (e: any) {
      this.error = e?.message || 'Erreur lors de la création';
    }
  }

  async findAndJoinRoom() {
    try {
      if (!this.searchRoomId.trim()) { this.error = 'ID requis'; return; }
      const room = await this.multi.findRoom(this.searchRoomId.trim());
      await this.multi.joinRoom(room.id, 'player');
      this.enterRoom(room);
      this.error = '';
    } catch (e: any) {
      this.error = e?.message || 'Session introuvable';
    }
  }

  async enterAsGM(room: Room) {
    try {
      await this.multi.joinRoom(room.id, 'gm');
      this.enterRoom(room);
    } catch (e: any) {
      this.error = e?.message || 'Erreur';
    }
  }

  async joinAsPlayer(room: Room) {
    try {
      const updated = await this.multi.joinRoom(room.id, 'player');
      this.enterRoom(updated);
    } catch (e: any) {
      this.error = e?.message || 'Impossible de rejoindre';
    }
  }

  private enterRoom(room: Room) {
    this.currentRoomId.set(room.id);
    this.messages.set([]);
    this.dice.set([]);
    
    // Nettoyer les anciens handlers
    this.unsubscribers.forEach(unsub => unsub());
    this.unsubscribers = [];

    // S'abonner aux événements
    this.unsubscribers.push(
      this.multi.on('chat', (msg: ChatMessage) => {
        if (msg.roomId === room.id) {
          this.messages.update(arr => [...arr, msg]);
        }
      })
    );

    this.unsubscribers.push(
      this.multi.on('dice', (roll: DiceRoll) => {
        if (roll.roomId === room.id) {
          this.dice.update(arr => [...arr, roll]);
        }
      })
    );
  }

  leaveRoom() {
    const id = this.currentRoomId();
    if (id) {
      this.multi.leaveRoom(id);
    }
    this.unsubscribers.forEach(unsub => unsub());
    this.unsubscribers = [];
    this.currentRoomId.set(null);
  }

  sendChat() {
    const id = this.currentRoomId();
    if (!id) return;
    const text = this.chatText.trim();
    if (!text) return;
    this.multi.sendChat(id, text);
    this.chatText = '';
  }

  roll() {
    const id = this.currentRoomId();
    if (!id) return;
    const r = Math.max(1, Math.min(10, Math.floor(this.rolled)));
    const k = Math.max(1, Math.min(r, Math.floor(this.kept)));
    this.multi.rollDice(id, r, k, this.reason.trim() || undefined);
    this.reason = '';
  }

  ngOnDestroy(): void {
    this.unsubscribers.forEach(unsub => unsub());
    this.unsubscribers = [];
  }
}

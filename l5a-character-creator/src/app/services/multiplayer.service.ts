import { Injectable, signal, computed } from '@angular/core';
import { AuthService } from './auth.service';
import { io, Socket } from 'socket.io-client';

export type UserType = 'gm' | 'player';

export interface Room {
  id: string;
  name: string;
  gmId: string;
  gmName: string;
  maxPlayers: number;
  isPublic: boolean;
  players: Array<{ id: string; name: string; characterName?: string }>;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface DiceRoll {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  rolled: number;
  kept: number;
  dice: number[];
  keptDice: number[];
  total: number;
  reason?: string;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class MultiplayerService {
  private socket: Socket | null = null;
  private serverUrl = 'http://localhost:3000'; // Backend GM_L5R

  private _rooms = signal<Room[]>([]);
  readonly rooms = this._rooms.asReadonly();
  readonly publicRooms = computed(() => this._rooms().filter(r => r.isPublic));
  readonly connected = signal<boolean>(false);

  private eventHandlers = new Map<string, Set<(data: any) => void>>();

  constructor(private auth: AuthService) {
    this.connect();
  }

  // Connexion au serveur WebSocket
  connect() {
    if (this.socket?.connected) return;
    
    this.socket = io(this.serverUrl, {
      transports: ['websocket'],
      autoConnect: true
    });

    this.socket.on('connect', () => {
      console.log('[WS] Connecté au serveur GM_L5R');
      this.connected.set(true);
      this.refreshRooms();
    });

    this.socket.on('disconnect', () => {
      console.log('[WS] Déconnecté du serveur');
      this.connected.set(false);
    });

    this.socket.on('room-created', (room: Room) => {
      const rooms = [...this._rooms()];
      if (!rooms.find(r => r.id === room.id)) {
        rooms.push(room);
        this._rooms.set(rooms);
      }
    });

    this.socket.on('chat', (message: ChatMessage) => {
      this.notifyHandlers('chat', message);
    });

    this.socket.on('dice', (roll: DiceRoll) => {
      this.notifyHandlers('dice', roll);
    });

    this.socket.on('user-joined', (data: any) => {
      this.notifyHandlers('user-joined', data);
      this.refreshRooms();
    });

    this.socket.on('user-left', (data: any) => {
      this.notifyHandlers('user-left', data);
      this.refreshRooms();
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected.set(false);
    }
  }

  private refreshRooms() {
    if (!this.socket) return;
    this.socket.emit('list-rooms', (response: any) => {
      if (response?.ok) {
        this._rooms.set(response.rooms || []);
      }
    });
  }

  private notifyHandlers(event: string, data: any) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  // Créer une room (MJ)
  createRoom(name: string, maxPlayers = 3, isPublic = true): Promise<Room> {
    return new Promise((resolve, reject) => {
      const user = this.auth.currentUser();
      if (!user) {
        reject(new Error('Non authentifié'));
        return;
      }
      if (!this.socket) {
        reject(new Error('Non connecté au serveur'));
        return;
      }

      const roomData = {
        id: crypto.randomUUID(),
        name,
        gmId: user.id,
        gmName: user.name,
        maxPlayers,
        isPublic
      };

      this.socket.emit('create-room', roomData, (response: any) => {
        if (response?.ok) {
          resolve(response.room);
        } else {
          reject(new Error(response?.error || 'Erreur lors de la création'));
        }
      });
    });
  }

  // Rejoindre une room
  joinRoom(roomId: string, userType: UserType, characterName?: string): Promise<Room> {
    return new Promise((resolve, reject) => {
      const user = this.auth.currentUser();
      if (!user) {
        reject(new Error('Non authentifié'));
        return;
      }
      if (!this.socket) {
        reject(new Error('Non connecté au serveur'));
        return;
      }

      this.socket.emit('join-room', {
        roomId,
        userId: user.id,
        userName: user.name,
        userType,
        characterName
      }, (response: any) => {
        if (response?.ok) {
          resolve(response.room);
        } else {
          reject(new Error(response?.error || 'Impossible de rejoindre'));
        }
      });
    });
  }

  // Quitter une room
  leaveRoom(roomId: string) {
    const user = this.auth.currentUser();
    if (!user || !this.socket) return;

    this.socket.emit('leave-room', {
      roomId,
      userId: user.id
    });
  }

  // Envoyer un message
  sendChat(roomId: string, text: string) {
    const user = this.auth.currentUser();
    if (!user || !this.socket) return;

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      roomId,
      userId: user.id,
      userName: user.name,
      text,
      timestamp: new Date().toISOString()
    };

    this.socket.emit('chat', { roomId, message });
  }

  // Lancer des dés
  rollDice(roomId: string, rolled: number, kept: number, reason?: string) {
    const user = this.auth.currentUser();
    if (!user || !this.socket) return;

    const dice: number[] = Array.from({ length: rolled }, () => 1 + Math.floor(Math.random() * 10));
    const keptDice = [...dice].sort((a, b) => b - a).slice(0, kept);
    const total = keptDice.reduce((a, b) => a + b, 0);

    const roll: DiceRoll = {
      id: crypto.randomUUID(),
      roomId,
      userId: user.id,
      userName: user.name,
      rolled,
      kept,
      dice,
      keptDice,
      total,
      reason,
      timestamp: new Date().toISOString()
    };

    this.socket.emit('dice', { roomId, roll });
  }

  // Rechercher une room par ID
  findRoom(roomId: string): Promise<Room> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Non connecté au serveur'));
        return;
      }

      this.socket.emit('find-room', roomId, (response: any) => {
        if (response?.ok) {
          resolve(response.room);
        } else {
          reject(new Error(response?.error || 'Session introuvable'));
        }
      });
    });
  }

  // Écouter les événements
  on(event: string, handler: (data: any) => void): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);

    return () => {
      const handlers = this.eventHandlers.get(event);
      if (handlers) {
        handlers.delete(handler);
      }
    };
  }
}

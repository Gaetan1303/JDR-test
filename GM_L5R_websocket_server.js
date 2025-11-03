// ========================================
// SERVEUR WEBSOCKET POUR GM_L5R
// À copier dans votre backend GM_L5R
// ========================================

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // En production, spécifier l'origine exacte
    methods: ['GET', 'POST']
  }
});

// Stockage des rooms en mémoire (à remplacer par une base de données si besoin)
const rooms = new Map();

// Obtenir l'IP locale
function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

io.on('connection', (socket) => {
  console.log(`[WS] Client connecté: ${socket.id}`);

  // ============ GESTION DES ROOMS ============
  
  // Créer une room
  socket.on('create-room', (data, callback) => {
    const { id, name, gmId, gmName, maxPlayers, isPublic } = data;
    
    const room = {
      id,
      name,
      gmId,
      gmName,
      maxPlayers,
      isPublic,
      players: [],
      createdAt: new Date().toISOString()
    };
    
    rooms.set(id, room);
    console.log(`[WS] Room créée: "${name}" (${id}) par ${gmName}`);
    
    // Notifier tous les clients
    io.emit('room-created', room);
    
    callback({ ok: true, room });
  });

  // Lister les rooms publiques
  socket.on('list-rooms', (callback) => {
    const publicRooms = Array.from(rooms.values()).filter(r => r.isPublic);
    console.log(`[WS] Liste des rooms demandée: ${publicRooms.length} publiques`);
    callback({ ok: true, rooms: publicRooms });
  });

  // Rejoindre une room
  socket.on('join-room', (data, callback) => {
    const { roomId, userId, userName, userType, characterName } = data;
    const room = rooms.get(roomId);
    
    if (!room) {
      return callback({ ok: false, error: 'Salle introuvable' });
    }

    // Si c'est un joueur, vérifier la capacité
    if (userType === 'player') {
      if (room.players.find(p => p.id === userId)) {
        console.log(`[WS] ${userName} déjà dans ${room.name}`);
        socket.join(roomId);
        return callback({ ok: true, room });
      }
      
      if (room.players.length >= room.maxPlayers) {
        return callback({ ok: false, error: 'Salle pleine' });
      }
      
      room.players.push({ id: userId, name: userName, characterName });
    }

    // Rejoindre la room Socket.IO
    socket.join(roomId);
    
    // Notifier les autres membres
    io.to(roomId).emit('user-joined', { userId, userName, userType, characterName });
    
    console.log(`[WS] ${userName} rejoint "${room.name}" en tant que ${userType}`);
    callback({ ok: true, room });
  });

  // Quitter une room
  socket.on('leave-room', (data) => {
    const { roomId, userId } = data;
    const room = rooms.get(roomId);
    
    if (room) {
      room.players = room.players.filter(p => p.id !== userId);
      socket.leave(roomId);
      io.to(roomId).emit('user-left', { userId });
      console.log(`[WS] User ${userId} quitte "${room.name}"`);
    }
  });

  // ============ CHAT ============
  
  socket.on('chat', (data) => {
    const { roomId, message } = data;
    io.to(roomId).emit('chat', message);
    console.log(`[WS] [${roomId}] ${message.userName}: ${message.text}`);
  });

  // ============ DICES ============
  
  socket.on('dice', (data) => {
    const { roomId, roll } = data;
    io.to(roomId).emit('dice', roll);
    console.log(`[WS] [${roomId}] ${roll.userName} lance ${roll.rolled}k${roll.kept} = ${roll.total}`);
  });

  // ============ RECHERCHE PAR ID ============
  
  socket.on('find-room', (roomId, callback) => {
    const room = rooms.get(roomId);
    
    if (room) {
      console.log(`[WS] Room trouvée: "${room.name}" (${roomId})`);
      callback({ ok: true, room });
    } else {
      console.log(`[WS] Room introuvable: ${roomId}`);
      callback({ ok: false, error: 'Session introuvable' });
    }
  });

  // ============ DÉCONNEXION ============
  
  socket.on('disconnect', () => {
    console.log(`[WS] Client déconnecté: ${socket.id}`);
  });
});

// ============ DÉMARRAGE DU SERVEUR ============

const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIP();
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   🎲 Serveur GM_L5R Multiplayer démarré !    ║');
  console.log('╚════════════════════════════════════════════════╝\n');
  console.log(`   📍 Local:   http://localhost:${PORT}`);
  console.log(`   🌐 Réseau:  http://${localIP}:${PORT}\n`);
  console.log('Les autres appareils sur le réseau peuvent se connecter via l\'IP réseau.\n');
});

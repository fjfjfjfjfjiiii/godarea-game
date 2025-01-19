const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

// Public フォルダへの正しいパスを設定
const publicPath = path.resolve(__dirname, 'Public');

// 静的ファイルを提供
app.use(express.static(publicPath));

// ルートアクセス時に index.html を返す
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // クライアントからのメッセージを受信
  socket.on('message', (msg) => {
    console.log('Message from client:', msg);

    // クライアントにメッセージを返す
    socket.emit('message', 'Hello from server!');
  });

  // クライアントが切断したとき
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});


const { generateRoomId, generateDeck, dealCards } = require('./gameLogic');
const { addPlayer, getPlayersInRoom, removePlayer } = require('./players');

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('createRoom', (playerName) => {
    const roomId = generateRoomId();
    addPlayer(roomId, playerName, socket.id);
    socket.join(roomId);
    socket.emit('roomCreated', { roomId, playerName });
  });

  socket.on('joinRoom', (data) => {
    const { playerName, roomId } = data;
    const players = getPlayersInRoom(roomId);

    if (players.length < 2) {
      addPlayer(roomId, playerName, socket.id);
      socket.join(roomId);
      io.to(roomId).emit('playerList', getPlayersInRoom(roomId));
      io.to(roomId).emit('gameStatus', { currentPlayer: 0 });
    } else {
      socket.emit('error', 'Room is full or does not exist');
    }
  });

  socket.on('startGame', (roomId) => {
    const players = getPlayersInRoom(roomId);
    if (players.length === 2) {
      io.to(roomId).emit('gameStarted', { currentPlayer: 0 });
      io.to(roomId).emit('dealCards', dealCards(players));
    }
  });

  socket.on('playCard', (data) => {
    const { roomId, playerName, cardIndex } = data;
    const players = getPlayersInRoom(roomId);
    const player = players.find(p => p.name === playerName);

    if (player) {
      player.hp -= 5; // ダメージの例
      io.to(roomId).emit('turnPlayed', { currentPlayer: 1, playerHp: player.hp });
    }
  });

  socket.on('disconnect', () => {
    removePlayer(socket.id);
    console.log('A user disconnected:', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

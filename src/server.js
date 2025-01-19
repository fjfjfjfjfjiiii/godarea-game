const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 3000;



// ルートにアクセスしたときにindex.htmlを返す
app.get('/', (req, res) => {
  console.log('Accessing /');
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const { generateRoomId, generateDeck, dealCards } = require('./gameLogic');
const { addPlayer, getPlayersInRoom, removePlayer } = require('./players');

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('createRoom', (playerName) => {
    const roomId = generateRoomId();
    addPlayer(roomId, playerName, socket.id);
    socket.join(roomId);
    socket.emit('roomCreated', { roomId, playerName });
  });

  socket.on('joinRoom', (data) => {
    const { playerName, roomId } = data;
    if (getPlayersInRoom(roomId).length < 2) {
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
    // カードを使用するロジック
    const { roomId, playerName, cardIndex } = data;
    const players = getPlayersInRoom(roomId);
    const player = players.find(p => p.name === playerName);
    player.hp -= 5; // ダメージ例

    io.to(roomId).emit('turnPlayed', { currentPlayer: 1, playerHp: player.hp });
  });

  socket.on('disconnect', () => {
    removePlayer(socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});

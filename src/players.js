// プレイヤーの管理
let rooms = {};

function addPlayer(roomId, playerName, playerId) {
  if (!rooms[roomId]) {
    rooms[roomId] = [];
  }
  rooms[roomId].push({ name: playerName, id: playerId, hp: 20 });
}

function getPlayersInRoom(roomId) {
  return rooms[roomId] || [];
}

function removePlayer(playerId) {
  for (const roomId in rooms) {
    rooms[roomId] = rooms[roomId].filter(player => player.id !== playerId);
  }
}

module.exports = { addPlayer, getPlayersInRoom, removePlayer };

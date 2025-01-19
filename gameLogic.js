// ゲームのロジック
function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generateDeck() {
  return [
    { name: 'Attack Card', damage: 5 },
    { name: 'Heal Card', damage: -3 },
    { name: 'Defense Card', damage: 0 }
  ];
}

function dealCards(players) {
  return players.map(player => ({
    player: player.name,
    hand: [generateDeck()[0], generateDeck()[1], generateDeck()[2]]
  }));
}

module.exports = { generateRoomId, generateDeck, dealCards };

function generateDeck() {
  return [
    { name: 'Attack Card', damage: 5 },
    { name: 'Heal Card', damage: -3 },
    { name: 'Defense Card', damage: 0 }
  ];
}

function dealCards(players) {
  const deck = generateDeck(); // 1つのデッキを作成
  return players.map(player => ({
    player: player.name,
    hand: [...deck] // 同じデッキを全プレイヤーに配布
  }));
}

module.exports = { generateDeck, dealCards };

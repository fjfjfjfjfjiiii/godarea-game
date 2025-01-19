const socket = io();
let myId = null;

// プレイヤー登録
const playerName = prompt("プレイヤー名を入力してください:");
socket.emit("register", playerName);

// プレイヤー情報の更新
socket.on("updatePlayers", (players) => {
  const playerInfoDiv = document.getElementById("player-info");
  playerInfoDiv.innerHTML = "";
  players.forEach((player) => {
    playerInfoDiv.innerHTML += `
      <div>
        <h3>${player.name} (HP: ${player.hp}, MP: ${player.mp})</h3>
      </div>
    `;
  });
});

// ターン終了ボタン
document.getElementById("end-turn").addEventListener("click", () => {
  socket.emit("endTurn");
});

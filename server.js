const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

// 配信する静的ファイルのフォルダ
app.use(express.static("public"));

// ゲームデータの初期化
let players = [];
let currentTurn = 0; // 現在のターン
let cards = []; // デッキのカード

// ゲーム用Socket.IOイベント
io.on("connection", (socket) => {
  console.log("A player connected:", socket.id);

  // プレイヤー登録
  socket.on("register", (playerName) => {
    players.push({
      id: socket.id,
      name: playerName,
      hp: 100,
      mp: 50,
      hand: [],
    });
    console.log(`${playerName} joined the game.`);
    io.emit("updatePlayers", players); // 全プレイヤーに更新情報送信
  });

  // カードの使用
  socket.on("useCard", ({ card, targetId }) => {
    const player = players.find((p) => p.id === socket.id);
    const target = players.find((p) => p.id === targetId);

    if (!player || !target) return;

    if (card.type === "attack") {
      // 攻撃処理
      const damage = Math.max(0, card.damage - (target.defense || 0));
      target.hp -= damage;
      io.emit("attackResult", { attacker: player.id, target: target.id, damage });
    }

    // ターンの進行
    currentTurn = (currentTurn + 1) % players.length;
    io.emit("nextTurn", { nextPlayerId: players[currentTurn].id });
  });

  // 切断処理
  socket.on("disconnect", () => {
    players = players.filter((p) => p.id !== socket.id);
    io.emit("updatePlayers", players);
    console.log("A player disconnected:", socket.id);
  });
});

// サーバー起動
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

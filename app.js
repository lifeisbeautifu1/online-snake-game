const io = require('socket.io')(3000, {
  cors: {
    origin: ['http://127.0.0.1:5500'],
  },
});

const state = {};
const clientRooms = {};

const { FRAME_RATE } = require('./constants');
const { initGame, gameLoop, getUpdatedVelocity } = require('./game');
const { makeid } = require('./utils');

io.on('connection', (socket) => {
  // const state = createGameState();
  //startGameInterval(socket, state);
  socket.on('joinGame', (gameCode) => {
    const room = io.sockets.adapter.rooms.get(gameCode);

    let numClients = room.length;

    if (numClients === 0) {
      socket.emit('unknownGame');
      return;
    } else if (numClients > 1) {
      socket.emit('tooManyPlayers');
      return;
    }
    clientRooms[socket.id] = gameCode;
    socket.join(gameCode);
    socket.number = 2;
    socket.emit('init', 2);
    startGameInterval(gameCode);
  });
  socket.on('keydown', (key) => {
    const roomName = clientRooms[socket.id];

    if (!roomName) {
      return;
    }
    const vel = getUpdatedVelocity(key);
    if (vel) state[roomName].players[socket.number - 1].vel = vel;
  });
  socket.on('newGame', () => {
    let roomName = makeid(5);

    clientRooms[clientRooms.id] = roomName;
    socket.emit('gameCode', roomName);
    state[roomName] = initGame();

    socket.join(roomName);
    socket.number = 1;
    socket.emit('init', 1);
  });
});

function startGameInterval(roomName) {
  const intervalId = setInterval(() => {
    const winner = gameLoop(state[roomName]);
    if (!winner) {
      emitGameState(roomName, state[roomName]);
    } else {
      emitGameOver(roomName, winner);
      state[roomName] = null;
      clearInterval(intervalId);
    }
  }, 1000 / FRAME_RATE);
}

function emitGameState(roomName, state) {
  io.sockets.in(roomName).emit('gameState', JSON.stringify(state));
}

function emitGameOver(roomName, winner) {
  io.sockets.in(roomName).emit('gameOver', JSON.stringify({ winner }));
}

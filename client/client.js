const gameScreen = document.getElementById('gameScreen'),
  initialScreen = document.getElementById('initialScreen'),
  newGameBtn = document.getElementById('newGameBtn'),
  joinGameBtn = document.getElementById('joinGameBtn'),
  gameCodeInput = document.getElementById('gameCodeInput'),
  gameCodeDisplay = document.getElementById('gameCodeDisplay');

newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);

function newGame() {
  socket.emit('newGame');
  init();
}

function joinGame() {
  const code = gameCodeInput.value;
  socket.emit('joinGame', code);
  init();
}

let canvas,
  ctx,
  playerNumber,
  gameActive = false;
const BG_COLOR = '#231f20',
  SNAKE_COLOR = '#c2c2c2',
  FOOD_COLOR = '#e66916';

const socket = io('http://localhost:3000');

socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);
socket.on('gameCode', handleGameCode);
socket.on('unknownGame', handleUnknownGame);
socket.on('tooManyPlayers', handleTooManyPlayers);

function handleUnknownGame() {
  reset();
  alert('too many players');
}

function handleTooManyPlayers() {
  reset();
  alert('this game already in progress');
}

function reset() {
  playerNumber = null;
  gameCodeInput.value = '';
  gameCodeDisplay.textContent = '';
  initialScreen.style.display = 'block';
  gameScreen.style.display = 'none';
}

function handleInit(number) {
  playerNumber = number;
}

function handleGameCode(code) {
  gameCodeDisplay.textContent = code;
}

function handleGameOver(data) {
  if (!gameActive) return;
  data = JSON.parse(data);
  if (data.winner == playerNumber) {
    alert('You win!');
  } else {
    alert('You lose');
  }
  gameActive = false;
}

function handleGameState(gameState) {
  if (!gameState) return;
  gameState = JSON.parse(gameState);
  requestAnimationFrame(() => paintGame(gameState));
}

const init = () => {
  initialScreen.style.display = 'none';
  gameScreen.style.display = 'block';
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  canvas.width = canvas.height = 600;
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  document.addEventListener('keydown', keydown);
  gameActive = true;
};

function keydown(e) {
  socket.emit('keydown', e.key);
}

function paintGame(state) {
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const { food, gridsize } = state;
  const size = canvas.width / gridsize;
  ctx.fillStyle = FOOD_COLOR;
  ctx.fillRect(food.x * size, food.y * size, size, size);

  paintPlayer(state.players[0], size, SNAKE_COLOR);
  paintPlayer(state.players[1], size, 'red');
}

function paintPlayer(playerState, size, color) {
  const { snake } = playerState;
  ctx.fillStyle = color;
  snake.forEach((cell) =>
    ctx.fillRect(cell.x * size, cell.y * size, size, size)
  );
}

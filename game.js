const { GRID_SIZE } = require('./constants');

module.exports = {
  initGame,
  gameLoop,
  getUpdatedVelocity,
};

function initGame() {
  const state = createGameState();
  randomFood(state);
  return state;
}

function createGameState() {
  return {
    players: [
      {
        pos: {
          x: 3,
          y: 10,
        },
        vel: {
          x: 1,
          y: 0,
        },
        snake: [
          {
            x: 1,
            y: 10,
          },
          {
            x: 2,
            y: 10,
          },
          {
            x: 3,
            y: 10,
          },
        ],
      },
      {
        pos: {
          x: 18,
          y: 10,
        },
        vel: {
          x: 0,
          y: 0,
        },
        snake: [
          {
            x: 20,
            y: 10,
          },
          {
            x: 19,
            y: 10,
          },
          {
            x: 18,
            y: 10,
          },
        ],
      },
    ],
    food: {},
    gridsize: GRID_SIZE,
  };
}

function gameLoop(state) {
  if (!state) return;
  const playerOne = state.players[0];
  const playerTwo = state.players[1];
  playerOne.pos.x += playerOne.vel.x;
  playerOne.pos.y += playerOne.vel.y;

  playerTwo.pos.x += playerTwo.vel.x;
  playerTwo.pos.y += playerTwo.vel.y;

  if (
    playerOne.pos.x < 0 ||
    playerOne.pos.x > GRID_SIZE ||
    playerOne.pos.y < 0 ||
    playerOne.pos.y > GRID_SIZE
  )
    return 2;

  if (
    playerTwo.pos.x < 0 ||
    playerTwo.pos.x > GRID_SIZE ||
    playerTwo.pos.y < 0 ||
    playerTwo.pos.y > GRID_SIZE
  )
    return 1;

  if (state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y) {
    playerOne.snake.push({ ...playerOne.pos });
    playerOne.pos.x += playerOne.vel.x;
    playerOne.pos.y += playerOne.vel.y;
    randomFood(state);
  }

  if (state.food.x === playerTwo.pos.x && state.food.y === playerTwo.pos.y) {
    playerTwo.snake.push({ ...playerTwo.pos });
    playerTwo.pos.x += playerTwo.vel.x;
    playerTwo.pos.y += playerTwo.vel.y;
    randomFood(state);
  }

  if (playerOne.vel.x || playerOne.vel.y) {
    playerOne.snake.forEach((cell) => {
      if (cell.x === playerOne.pos.x && cell.y === playerOne.pos.y) return 2;
    });
    playerOne.snake.push({ ...playerOne.pos });
    playerOne.snake.shift();
  }

  if (playerTwo.vel.x || playerTwo.vel.y) {
    playerTwo.snake.forEach((cell) => {
      if (cell.x === playerTwo.pos.x && cell.y === playerTwo.pos.y) return 1;
    });
    playerTwo.snake.push({ ...playerTwo.pos });
    playerTwo.snake.shift();
  }

  return false;
}

function randomFood(state) {
  food = {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  };

  state.players[0].snake.forEach((cell) => {
    if (food.x === cell.x && food.y === cell.y) {
      randomFood(state);
    }
  });

  state.players[1].snake.forEach((cell) => {
    if (food.x === cell.x && food.y === cell.y) {
      randomFood(state);
    }
  });

  state.food = food;
}

function getUpdatedVelocity(key) {
  if (key === 'ArrowUp') {
    return {
      x: 0,
      y: -1,
    };
  } else if (key === 'ArrowDown') {
    return {
      x: 0,
      y: 1,
    };
  } else if (key === 'ArrowRight') {
    return {
      x: 1,
      y: 0,
    };
  } else if (key === 'ArrowLeft') {
    return {
      x: -1,
      y: 0,
    };
  }
  return null;
}

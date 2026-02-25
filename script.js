const size = 4;
let board = Array.from({ length: size }, () => Array(size).fill(0));
let score = 0;
let gameOver = false;
let won = false;

const boardEl = document.getElementById("board");
const scoreEl = document.getElementById("score");
const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restart");

function init() {
  board = Array.from({ length: size }, () => Array(size).fill(0));
  score = 0;
  gameOver = false;
  won = false;
  addRandomTile();
  addRandomTile();
  updateUI();
  statusEl.textContent = "";
}

function getEmptyCells() {
  const empty = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col] === 0) empty.push([row, col]);
    }
  }
  return empty;
}

function addRandomTile() {
  const empty = getEmptyCells();
  if (!empty.length) return;
  const [row, col] = empty[Math.floor(Math.random() * empty.length)];
  board[row][col] = Math.random() < 0.9 ? 2 : 4;
}

function slideAndMerge(line) {
  const compact = line.filter((value) => value !== 0);
  const result = [];

  for (let i = 0; i < compact.length; i++) {
    if (compact[i] === compact[i + 1]) {
      const merged = compact[i] * 2;
      result.push(merged);
      score += merged;
      i++;
    } else {
      result.push(compact[i]);
    }
  }

  while (result.length < size) result.push(0);
  return result;
}

function rotateClockwise(matrix) {
  return matrix[0].map((_, i) => matrix.map((row) => row[i]).reverse());
}

function moveLeft() {
  const before = JSON.stringify(board);
  board = board.map(slideAndMerge);
  return before !== JSON.stringify(board);
}

function move(direction) {
  if (gameOver) return;

  let moved = false;

  if (direction === "left") {
    moved = moveLeft();
  } else if (direction === "up") {
    board = rotateClockwise(rotateClockwise(rotateClockwise(board)));
    moved = moveLeft();
    board = rotateClockwise(board);
  } else if (direction === "right") {
    board = rotateClockwise(rotateClockwise(board));
    moved = moveLeft();
    board = rotateClockwise(rotateClockwise(board));
  } else if (direction === "down") {
    board = rotateClockwise(board);
    moved = moveLeft();
    board = rotateClockwise(rotateClockwise(rotateClockwise(board)));
  }

  if (moved) {
    addRandomTile();
    updateUI();
    evaluateGameState();
  }
}

function hasMoves() {
  if (getEmptyCells().length > 0) return true;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const value = board[row][col];
      if (
        value === board[row + 1]?.[col] ||
        value === board[row - 1]?.[col] ||
        value === board[row]?.[col + 1] ||
        value === board[row]?.[col - 1]
      ) {
        return true;
      }
    }
  }

  return false;
}

function evaluateGameState() {
  if (!won && board.flat().includes(2048)) {
    won = true;
    statusEl.textContent = "🎉 Du nådde 2048! Fortsett gjerne videre.";
  }

  if (!hasMoves()) {
    gameOver = true;
    statusEl.textContent = "💀 Game over! Ingen trekk igjen.";
  }
}

function updateUI() {
  boardEl.innerHTML = "";

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const value = board[row][col];
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.dataset.value = String(value);
      tile.textContent = value === 0 ? "" : String(value);
      boardEl.appendChild(tile);
    }
  }

  scoreEl.textContent = String(score);
}

document.addEventListener("keydown", (event) => {
  const map = {
    ArrowLeft: "left",
    ArrowUp: "up",
    ArrowRight: "right",
    ArrowDown: "down",
  };

  const direction = map[event.key];
  if (!direction) return;

  event.preventDefault();
  move(direction);
});

restartBtn.addEventListener("click", init);

init();

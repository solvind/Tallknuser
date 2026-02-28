const size = 4;
const minSwipeDistance = 30;
const PI_DIGITS = "14159265358979323846264338327950288419716939937510";
const TURN_TIME = 3000;

let board = Array.from({ length: size }, () => Array(size).fill(0));
let score2048 = 0;
let gameOver2048 = false;
let won = false;

let touchStartX = 0;
let touchStartY = 0;

let piNextIndex = 0;
let piScore = 0;
let piGameOver = false;
let piDeadline = 0;
let piTimerInterval;

const game2048El = document.getElementById("game-2048");
const gamePiEl = document.getElementById("game-pi");
const show2048Btn = document.getElementById("show-2048");
const showPiBtn = document.getElementById("show-pi");

const boardEl = document.getElementById("board");
const score2048El = document.getElementById("score-2048");
const status2048El = document.getElementById("status-2048");
const restart2048Btn = document.getElementById("restart-2048");

const sequenceEl = document.getElementById("sequence");
const scorePiEl = document.getElementById("score-pi");
const timerEl = document.getElementById("timer");
const statusPiEl = document.getElementById("status-pi");
const restartPiBtn = document.getElementById("restart-pi");
const digitButtons = [...document.querySelectorAll(".digit")];

function setActiveGame(game) {
  const is2048 = game === "2048";
  game2048El.classList.toggle("active", is2048);
  gamePiEl.classList.toggle("active", !is2048);
  show2048Btn.classList.toggle("active", is2048);
  showPiBtn.classList.toggle("active", !is2048);
}

function init2048() {
  board = Array.from({ length: size }, () => Array(size).fill(0));
  score2048 = 0;
  gameOver2048 = false;
  won = false;
  addRandomTile();
  addRandomTile();
  update2048UI();
  status2048El.textContent = "";
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
      score2048 += merged;
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
  if (gameOver2048) return;

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
    update2048UI();
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
    status2048El.textContent = "🎉 Du nådde 2048! Fortsett gjerne videre.";
  }

  if (!hasMoves()) {
    gameOver2048 = true;
    status2048El.textContent = "💀 Game over! Ingen trekk igjen.";
  }
}

function update2048UI() {
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

  score2048El.textContent = String(score2048);
}

function onDirectionInput(direction) {
  if (!game2048El.classList.contains("active")) return;
  move(direction);
}

function handleTouchStart(event) {
  if (!game2048El.classList.contains("active")) return;
  const touch = event.changedTouches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}

function handleTouchEnd(event) {
  if (!game2048El.classList.contains("active")) return;
  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;

  if (
    Math.abs(deltaX) < minSwipeDistance &&
    Math.abs(deltaY) < minSwipeDistance
  ) {
    return;
  }

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    onDirectionInput(deltaX > 0 ? "right" : "left");
  } else {
    onDirectionInput(deltaY > 0 ? "down" : "up");
  }
}

function setPiTimerDisplay() {
  if (piGameOver || !piDeadline) {
    timerEl.textContent = "3.0";
    return;
  }

  const leftMs = Math.max(0, piDeadline - Date.now());
  timerEl.textContent = (leftMs / 1000).toFixed(1);
}

function startPiTurnTimer() {
  piDeadline = Date.now() + TURN_TIME;
  setPiTimerDisplay();

  clearInterval(piTimerInterval);
  piTimerInterval = setInterval(() => {
    setPiTimerDisplay();
    if (Date.now() >= piDeadline) {
      endPiGame("⏱️ Tiden gikk ut! Game over.");
    }
  }, 100);
}

function endPiGame(message) {
  piGameOver = true;
  clearInterval(piTimerInterval);
  piTimerInterval = undefined;
  statusPiEl.textContent = message;
  setPiTimerDisplay();
}

function updatePiScore() {
  scorePiEl.textContent = String(piScore);
}

function handlePiDigitInput(digit) {
  if (piGameOver) return;

  const expectedDigit = PI_DIGITS[piNextIndex];

  if (digit !== expectedDigit) {
    endPiGame(`❌ Feil! Forventet ${expectedDigit}. Trykk ↺ for ny runde.`);
    return;
  }

  sequenceEl.textContent += digit;
  piNextIndex += 1;
  piScore += 1;
  updatePiScore();

  if (piNextIndex >= PI_DIGITS.length) {
    endPiGame("🏆 Utrolig! Du klarte alle sifrene som er lagt inn.");
    return;
  }

  statusPiEl.textContent = "✅ Riktig! Fortsett.";
  startPiTurnTimer();
}

function initPi() {
  piNextIndex = 0;
  piScore = 0;
  piGameOver = false;
  piDeadline = 0;
  clearInterval(piTimerInterval);
  piTimerInterval = undefined;

  sequenceEl.textContent = "3,";
  updatePiScore();
  timerEl.textContent = "3.0";
  statusPiEl.textContent = "Spillet starter når du trykker et tall.";
}

document.addEventListener("keydown", (event) => {
  const map = {
    ArrowLeft: "left",
    ArrowUp: "up",
    ArrowRight: "right",
    ArrowDown: "down",
  };

  const direction = map[event.key];
  if (!direction || !game2048El.classList.contains("active")) return;

  event.preventDefault();
  onDirectionInput(direction);
});

boardEl.addEventListener("touchstart", handleTouchStart, { passive: true });
boardEl.addEventListener("touchend", handleTouchEnd, { passive: true });

restart2048Btn.addEventListener("click", init2048);
restartPiBtn.addEventListener("click", initPi);

digitButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!piDeadline && !piGameOver) {
      startPiTurnTimer();
    }
    handlePiDigitInput(button.dataset.digit);
  });
});

show2048Btn.addEventListener("click", () => setActiveGame("2048"));
showPiBtn.addEventListener("click", () => setActiveGame("pi"));

init2048();
initPi();
setActiveGame("2048");

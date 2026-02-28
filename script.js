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
}

function updateHighscore() {
  highscoreEl.textContent = String(loadHighscore(activeMode));
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

    timerEl.textContent = `${(remaining / 1000).toFixed(1)}s`;
  }, TIMER_TICK_MS);

  timerEl.textContent = `${(turnLimit / 1000).toFixed(1)}s`;
}

function renderRows(rows) {
  const visibleRows = rows.slice(-VISIBLE_LINES);
  while (visibleRows.length < VISIBLE_LINES) visibleRows.unshift("");
  visibleRows.forEach((line, index) => {
    sequenceLineEls[index].textContent = line;
  });
}

function move(direction) {
  if (gameOver2048) return;

  let moved = false;

function getFibonacciAt(index) {
  while (numberSequences.fibonacci.length <= index) {
    const values = numberSequences.fibonacci;
    const next = values[values.length - 1] + values[values.length - 2];
    values.push(next);
  }
  return numberSequences.fibonacci[index];
}

  if (moved) {
    addRandomTile();
    update2048UI();
    evaluateGameState();
  }
  return numberSequences.pyramid[index];
}

function getExpectedValue() {
  if (activeMode === "prime") return String(getPrimeAt(numberGameIndex));
  if (activeMode === "fibonacci") return String(getFibonacciAt(numberGameIndex));
  if (activeMode === "pyramid") return String(getPyramidAt(numberGameIndex));
  return PI_DIGITS[piIndex];
}

function getTurnLimitMs() {
  if (activeMode === "pi") return BASE_TURN_MS;
  const expected = getExpectedValue();
  return Math.max(3, expected.length) * 1000;
}

function setGameOver(message) {
  isGameOver = true;
  clearInterval(timerId);
  timerEl.textContent = "0.0s";
  statusEl.textContent = message;
  keypadEl.classList.add("disabled");
}

function resetTurnTimer() {
  clearInterval(timerId);
  const turnLimit = getTurnLimitMs();
  turnStart = Date.now();

  timerId = setInterval(() => {
    const remaining = turnLimit - (Date.now() - turnStart);

    if (remaining <= 0) {
      setGameOver("Tiden gikk ut! Game over.");
      return;
    }

    timerEl.textContent = `${(remaining / 1000).toFixed(1)}s`;
  }, TIMER_TICK_MS);

  timerEl.textContent = `${(turnLimit / 1000).toFixed(1)}s`;
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

  renderRows(chunks);
}

function update2048UI() {
  boardEl.innerHTML = "";

function updateDisplay() {
  scoreEl.textContent = String(score);
  if (activeMode === "pi") {
    renderPiSequence();
  } else if (entryInputEl) {
    renderNumberSequence();
    entryInputEl.value = typedValue;
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

  if (activeMode === "pi") {
    if (/^\d$/.test(value)) handlePiDigitInput(value);
    return;
  }

  if (value === "Enter") {
    submitNumberAnswer();
    return;
  }

  if (/^\d$/.test(value)) {
    typedValue += value;
    updateDisplay();
  }

  visibleChunks.forEach(({ chunk, startIndex }, index) => {
    sequenceLineEls[index].textContent = formatChunk(chunk, startIndex);
  });
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

  const meta = MODES[mode];
  if (gameTitleEl) gameTitleEl.textContent = meta.title;
  if (gameDescriptionEl) gameDescriptionEl.textContent = meta.description;
  if (gameRulesEl) gameRulesEl.textContent = meta.rules;

  init();
}

function init() {
  clearInterval(timerId);
  isGameOver = false;
  score = 1;
  piIndex = 1;
  numberGameIndex = 0;
  typedValue = "";
  keypadEl.classList.remove("disabled");

  if (activeMode === "pi") {
    sequenceRows = [];
    if (entryWrapperEl) entryWrapperEl.hidden = true;
  } else {
    const firstValue = getExpectedValue();
    sequenceRows = [firstValue];
    numberGameIndex = 1;
    if (entryWrapperEl) entryWrapperEl.hidden = false;
  }

  statusEl.textContent = MODES[activeMode].startMessage;
  updateHighscore();
  buildKeypad();
  updateDisplay();
  resetTurnTimer();
}

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

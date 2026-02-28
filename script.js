const PI_DIGITS =
  "3141592653589793238462643383279502884197169399375105820974944592";
const TURN_TIME_MS = 3000;
const TIMER_TICK_MS = 100;
const DIGITS_PER_LINE = 12;
const VISIBLE_LINES = 3;

let currentIndex = 1;
let isGameOver = false;
let timerId;
let turnStart = 0;

const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const statusEl = document.getElementById("status");
const keypadEl = document.getElementById("keypad");
const restartBtn = document.getElementById("restart");
const sequenceLineEls = [
  document.getElementById("sequence-line-1"),
  document.getElementById("sequence-line-2"),
  document.getElementById("sequence-line-3"),
];

function buildKeypad() {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  keypadEl.innerHTML = "";

  keys.forEach((digit) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "key";
    button.textContent = digit;
    button.setAttribute("aria-label", `Siffer ${digit}`);
    button.addEventListener("click", () => handleDigitInput(digit));
    keypadEl.appendChild(button);
  });
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
  turnStart = Date.now();

  timerId = setInterval(() => {
    const elapsed = Date.now() - turnStart;
    const remaining = TURN_TIME_MS - elapsed;

    if (remaining <= 0) {
      setGameOver("⏰ Tiden gikk ut! Game over.");
      return;
    }

    timerEl.textContent = `${(remaining / 1000).toFixed(1)}s`;
  }, TIMER_TICK_MS);

  timerEl.textContent = "3.0s";
}

function formatChunk(chunk, chunkStartIndex) {
  return chunk
    .split("")
    .map((digit, digitIndex) => {
      const globalIndex = chunkStartIndex + digitIndex;
      return globalIndex === 0 ? `${digit},` : digit;
    })
    .join(" ");
}

function renderSequenceLines() {
  const typedDigits = PI_DIGITS.slice(0, currentIndex);
  const chunks = [];

  for (let i = 0; i < typedDigits.length; i += DIGITS_PER_LINE) {
    chunks.push({
      chunk: typedDigits.slice(i, i + DIGITS_PER_LINE),
      startIndex: i,
    });
  }

  const visibleChunks = chunks.slice(-VISIBLE_LINES);
  while (visibleChunks.length < VISIBLE_LINES) {
    visibleChunks.unshift({ chunk: "", startIndex: 0 });
  }

  visibleChunks.forEach(({ chunk, startIndex }, index) => {
    sequenceLineEls[index].textContent = formatChunk(chunk, startIndex);
  });
}

function updateDisplay() {
  scoreEl.textContent = String(currentIndex);
  renderSequenceLines();
}

function handleWinIfCompleted() {
  if (currentIndex >= PI_DIGITS.length) {
    setGameOver("🏆 Utrolig! Du fullførte alle sifrene som er med i denne versjonen.");
    return true;
  }

  return false;
}

function handleDigitInput(digit) {
  if (isGameOver) return;

  const expected = PI_DIGITS[currentIndex];
  if (digit !== expected) {
    setGameOver(`Feil siffer. Forventet ${expected}. Game over.`);
    return;
  }

  currentIndex += 1;
  updateDisplay();

  if (handleWinIfCompleted()) return;

  statusEl.textContent = "✅ Riktig! Fortsett.";
  resetTurnTimer();
}

function init() {
  clearInterval(timerId);
  currentIndex = 1;
  isGameOver = false;
  statusEl.textContent = "Start med neste siffer etter 3.";
  keypadEl.classList.remove("disabled");
  updateDisplay();
  resetTurnTimer();
}

restartBtn.addEventListener("click", init);

buildKeypad();
init();

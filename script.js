const PI_DIGITS =
codex/create-mobile-game-pi-yf22so
  "314159265358979323846264338327950288419716939937510582097494459230781640628620";
const TIMER_TICK_MS = 100;
const BASE_TURN_MS = 3000;
const DIGITS_PER_LINE = 12;
const VISIBLE_LINES = 3;

const MODES = {
  pi: {
    title: "π",
    description: "Trykk neste riktige siffer i π.",
    rules: "Ingen Enter i dette spillet. Du har alltid 3 sekunder per siffer.",
    startMessage: "Start med neste siffer etter 3,",
  },
  prime: {
    title: "Prime",
    description: "Skriv neste primtall og trykk Enter.",
    rules:
      "Tiden utvides jo større svarene blir: minst 3 sek, ellers like mange sekunder som antall siffer.",
    startMessage: "Start med første primtall: 2",
  },
  fibonacci: {
    title: "Fibonacci",
    description: "Skriv neste Fibonacci-tall og trykk Enter.",
    rules:
      "Tiden utvides jo større svarene blir: minst 3 sek, ellers like mange sekunder som antall siffer.",
    startMessage: "Start med første tall: 0",
  },
  pyramid: {
    title: "Pyramid",
    description: "Skriv neste tetraedertall og trykk Enter.",
    rules:
      "Tiden utvides jo større svarene blir: minst 3 sek, ellers like mange sekunder som antall siffer.",
    startMessage: "Start med første tetraedertall: 1",
  },
};

const scoreEl = document.getElementById("score");
const highscoreEl = document.getElementById("highscore");

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
 main
const timerEl = document.getElementById("timer");
const statusEl = document.getElementById("status");
const keypadEl = document.getElementById("keypad");
const restartBtn = document.getElementById("restart");
 codex/create-mobile-game-pi-yf22so
const modeTabs = Array.from(document.querySelectorAll(".mode-tab"));
const rulesToggleBtn = document.getElementById("rules-toggle");
const rulesPanel = document.getElementById("rules-panel");
const gameTitleEl = document.getElementById("game-title");
const gameDescriptionEl = document.getElementById("game-description");
const gameRulesEl = document.getElementById("game-rules");
const entryWrapperEl = document.getElementById("entry-wrapper");
const entryInputEl = document.getElementById("entry-input");

 main
const sequenceLineEls = [
  document.getElementById("sequence-line-1"),
  document.getElementById("sequence-line-2"),
  document.getElementById("sequence-line-3"),
];

codex/create-mobile-game-pi-yf22so
let activeMode = "pi";
let isGameOver = false;
let turnStart = 0;
let timerId;
let score = 1;
let piIndex = 1;
let numberGameIndex = 0;
let typedValue = "";
let sequenceRows = [];

const numberSequences = {
  prime: [2],
  fibonacci: [0],
  pyramid: [1],
};

function loadHighscore(mode) {
  return Number(localStorage.getItem(`${mode}-highscore`) ?? 1);
}

function saveHighscore(mode, value) {
  const current = loadHighscore(mode);
  if (value > current) {
    localStorage.setItem(`${mode}-highscore`, String(value));
  }
}

function updateHighscore() {
  highscoreEl.textContent = String(loadHighscore(activeMode));
}

function getPrimeAt(index) {
  while (numberSequences.prime.length <= index) {
    let candidate = numberSequences.prime[numberSequences.prime.length - 1] + 1;
    while (true) {
      let isPrime = true;
      for (let i = 2; i * i <= candidate; i += 1) {
        if (candidate % i === 0) {
          isPrime = false;
          break;
        }
      }
      if (isPrime) {
        numberSequences.prime.push(candidate);
        break;
      }
      candidate += 1;
    }
  }
  return numberSequences.prime[index];
}

function getFibonacciAt(index) {
  while (numberSequences.fibonacci.length <= index) {
    const values = numberSequences.fibonacci;
    const next = values[values.length - 1] + values[values.length - 2];
    values.push(next);
  }
  return numberSequences.fibonacci[index];
}

function getPyramidAt(index) {
  while (numberSequences.pyramid.length <= index) {
    const n = numberSequences.pyramid.length + 1;
    const value = (n * (n + 1) * (n + 2)) / 6;
    numberSequences.pyramid.push(value);
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

function renderRows(rows) {
  const visibleRows = rows.slice(-VISIBLE_LINES);
  while (visibleRows.length < VISIBLE_LINES) visibleRows.unshift("");
  visibleRows.forEach((line, index) => {
    sequenceLineEls[index].textContent = line;
  });
}

function renderPiSequence() {
  const typedDigits = PI_DIGITS.slice(0, piIndex);
  const chunks = [];

  for (let i = 0; i < typedDigits.length; i += DIGITS_PER_LINE) {
    const part = typedDigits.slice(i, i + DIGITS_PER_LINE);
    const formatted = part
      .split("")
      .map((digit, idx) => (i + idx === 0 ? `${digit},` : digit))
      .join(" ");
    chunks.push(formatted);
  }

  renderRows(chunks);
}

function renderNumberSequence() {
  renderRows(sequenceRows);
}

function updateDisplay() {
  scoreEl.textContent = String(score);
  if (activeMode === "pi") {
    renderPiSequence();
  } else {
    renderNumberSequence();
    entryInputEl.value = typedValue;
  }
}

function registerCorrectAnswer() {
  score += 1;
  saveHighscore(activeMode, score);
  updateHighscore();
  updateDisplay();
}

function handlePiDigitInput(digit) {
  const expected = getExpectedValue();

  if (digit !== expected) {
    setGameOver(`Feil siffer. Forventet ${expected}.`);
    return;
  }

  piIndex += 1;
  registerCorrectAnswer();

  if (piIndex >= PI_DIGITS.length) {
    setGameOver("Du fullførte alle sifrene i denne versjonen!");
    return;
  }

  statusEl.textContent = "Riktig!";
  resetTurnTimer();
}

function submitNumberAnswer() {
  if (!typedValue) return;

  const expected = getExpectedValue();
  if (typedValue !== expected) {
    setGameOver(`Feil svar. Forventet ${expected}.`);
    return;
  }

  sequenceRows.push(typedValue);
  typedValue = "";
  numberGameIndex += 1;
  registerCorrectAnswer();
  statusEl.textContent = "Riktig!";
  resetTurnTimer();
}

function handleKeyPress(value) {
  if (isGameOver) return;

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
}

function buildKeypad() {
  keypadEl.innerHTML = "";
  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  digits.forEach((digit) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "key";
    button.textContent = digit;
    button.addEventListener("click", () => handleKeyPress(digit));
    keypadEl.appendChild(button);
  });

  const enterBtn = document.createElement("button");
  enterBtn.type = "button";
  enterBtn.id = "enter-key";
  enterBtn.className = "key enter-key";
  enterBtn.textContent = "Enter";
  enterBtn.addEventListener("click", () => handleKeyPress("Enter"));
  keypadEl.appendChild(enterBtn);

  enterBtn.hidden = activeMode === "pi";
}

function setMode(mode) {
  activeMode = mode;
  modeTabs.forEach((btn) => {
    const isActive = btn.dataset.mode === mode;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", String(isActive));
  });

  const meta = MODES[mode];
  gameTitleEl.textContent = meta.title;
  gameDescriptionEl.textContent = meta.description;
  gameRulesEl.textContent = meta.rules;

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
    entryWrapperEl.hidden = true;
  } else {
    const firstValue = getExpectedValue();
    sequenceRows = [firstValue];
    numberGameIndex = 1;
    entryWrapperEl.hidden = false;
  }

  statusEl.textContent = MODES[activeMode].startMessage;
  updateHighscore();
  buildKeypad();
=======
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
main
  updateDisplay();
  resetTurnTimer();
}

restartBtn.addEventListener("click", init);
rulesToggleBtn.addEventListener("click", () => {
  const expanded = rulesToggleBtn.getAttribute("aria-expanded") === "true";
  rulesToggleBtn.setAttribute("aria-expanded", String(!expanded));
  rulesPanel.hidden = expanded;
});

modeTabs.forEach((btn) => {
  btn.addEventListener("click", () => setMode(btn.dataset.mode));
});

 codex/create-mobile-game-pi-yf22so
setMode("pi");

buildKeypad();
init();
main

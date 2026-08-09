const pieces = {
  tiny: {
    name: "very small",
    step: 7,
    loadWeight: 0.25,
    width: 34,
    height: 30,
    color: "#e64b3c"
  },
  small: {
    name: "small",
    step: 12,
    loadWeight: 0.25,
    width: 52,
    height: 38,
    color: "#f39a31"
  },
  large: {
    name: "large",
    step: 44,
    loadWeight: 1.45,
    width: 116,
    height: 58,
    color: "#7a56b3"
  },
  huge: {
    name: "very large",
    step: 55,
    loadWeight: 1.85,
    width: 146,
    height: 70,
    color: "#7e858b"
  }
};

const target = {
  start: 62,
  end: 68,
  center: 65
};

const sculptTarget = {
  x: 58,
  y: 86,
  unit: 34,
  widthUnits: 13,
  heightUnits: 4
};

const sculptPieces = {
  large: {
    trayName: "4 x 3 rectangle",
    unitsWide: 4,
    unitsHigh: 3,
    color: pieces.large.color
  },
  tiny: {
    trayName: "1 x 3 line",
    unitsWide: 1,
    unitsHigh: 3,
    color: pieces.tiny.color
  }
};

const landingLevels = [
  {
    title: "Big then small",
    start: 8,
    target: [62, 68],
    inventory: { small: 1, large: 1 },
    note: "Large first is quick. Small second is a short load.",
    rule: "Large + small and small + large land in the same place, but the order changes the waiting cost.",
    askAnother: true,
    preferencePrompt: "Which route felt better?"
  },
  {
    title: "Several bigs",
    start: 8,
    target: [92, 100],
    inventory: { large: 2, small: 1 },
    note: "Sometimes the clean path is just more large pieces.",
    rule: "Repeated large moves cover far distance quickly."
  },
  {
    title: "Maybe the small",
    start: 8,
    target: [50, 58],
    inventory: { large: 1, small: 2 },
    note: "Try the large. Decide if the small still helps.",
    rule: "A large piece can be enough by itself; small pieces are for when the edge still needs tuning."
  },
  {
    title: "No second big",
    start: 8,
    target: [86, 90],
    inventory: { large: 1, small: 3 },
    note: "No second large. Several smalls can compensate for the missing big step.",
    rule: "Several small steps can compensate for one missing large step."
  },
  {
    title: "Two larges",
    start: 0,
    target: [86, 90],
    inventory: { large: 2, huge: 1 },
    note: "Use two large pieces. The very large is available, but this target wants the matching pair.",
    rule: "Two matching large pieces make a steady far reach."
  },
  {
    title: "Replace one large",
    start: 0,
    target: [97, 100],
    inventory: { large: 2, huge: 1 },
    note: "Now the target is a little farther. Replace one large with very large.",
    rule: "Replacing one large with very large calibrates the reach by a small extra distance."
  },
  {
    title: "Fine tuning",
    start: 8,
    target: [67, 72],
    inventory: { large: 1, small: 1, tiny: 3 },
    note: "Small and very small pieces are the steering tools.",
    rule: "Small and very small pieces are fine-tuning tools."
  },
  {
    title: "Close target, subtract",
    start: 8,
    target: [12, 14],
    inventory: { small: 1, tiny: 1 },
    note: "Use small first, then subtract very small to land on a very close target.",
    rule: "Subtracting a very small piece makes a tiny leftover move."
  },
  {
    title: "Large minus small",
    start: 8,
    target: [38, 42],
    inventory: { large: 1, small: 1 },
    note: "Use large first, then subtract small. The leftover lands near the middle.",
    rule: "Large minus small leaves a middle-sized leftover."
  },
  {
    title: "Big-only tuning",
    start: 8,
    target: [18, 21],
    inventory: { large: 2, huge: 1 },
    note: "No small pieces. Make a small correction by subtracting large from very large.",
    rule: "When there are no small pieces, close large pieces can subtract into a small correction."
  },
  {
    title: "Same leftover, opposite side",
    start: 50,
    target: [80, 84],
    targets: [[16, 20], [80, 84]],
    inventory: { small: 1, large: 1 },
    note: "Start in the center. Large then subtract small lands right; small then subtract large lands left.",
    rule: "Large - small and small - large have the same leftover size, in opposite directions.",
    mirrorFlip: true,
    askAnother: true,
    preferencePrompt: "Which direction made the leftover clearer?"
  },
  {
    title: "Equal routes",
    start: 12,
    target: [66, 70],
    inventory: { tiny: 1, small: 1, large: 1, huge: 1 },
    steps: { tiny: 7, small: 12, large: 44, huge: 49 },
    note: "Find two ways to land here: small + large, and very small + very large.",
    rule: "Different pieces can compose the same distance: small + large can equal very small + very large.",
    askAnother: true,
    preferencePrompt: "Which equal route felt more natural?"
  },
  {
    title: "Random tuning challenge",
    start: 50,
    target: [52, 54],
    randomTarget: {
      offsets: [-9, -7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 7, 9],
      width: 1.5
    },
    inventory: { small: 1, tiny: 2 },
    steps: { small: 5, tiny: 2 },
    stepScale: 1.3,
    numeric: true,
    note: "Random target. Use one small and two very smalls in either direction.",
    rule: "One small and two very smalls can tune many nearby targets: 5, 2, 2 can combine or subtract in either direction."
  },
  {
    title: "Wide random challenge",
    start: 50,
    target: [50, 53],
    randomTarget: {
      minOffset: -35,
      maxOffset: 35,
      width: 2.5
    },
    randomInventory: {
      min: 3,
      max: 5,
      keys: ["tiny", "small", "large", "huge"]
    },
    inventory: { small: 1, large: 1, tiny: 1 },
    steps: { tiny: 2, small: 5, large: 15, huge: 18 },
    stepScale: 1,
    numeric: true,
    note: "Random wide target. You get 3 to 5 pieces; combine or subtract them to land.",
    rule: "With 2, 5, 15, and 18 pieces, the same blocks can reach many places from -35 to +35."
  }
];

const state = {
  stage: "landing",
  mode: "add",
  levelIndex: 0,
  position: 8,
  moveCount: 0,
  loading: false,
  loadToken: 0,
  won: false,
  inventory: {},
  lastLandingPiece: null,
  firstRoute: null,
  secondRoute: null,
  routeChoice: null,
  sculptCoverage: 0,
  history: [],
  orientation: "horizontal",
  showNumbers: true
};

const marker = document.querySelector("#marker");
const ghostMarker = document.querySelector("#ghostMarker");
const trace = document.querySelector("#trace");
const areaPieces = document.querySelector("#areaPieces");
const cutPieces = document.querySelector("#cutPieces");
const chipBowl = document.querySelector("#chipBowl");
const landingMessage = document.querySelector("#landingMessage");
const sculptMessage = document.querySelector("#sculptMessage");
const stageTitle = document.querySelector("#stageTitle");
const levelTitle = document.querySelector("#levelTitle");
const levelCount = document.querySelector("#levelCount");
const numberHud = document.querySelector("#numberHud");
const targetNumber = document.querySelector("#targetNumber");
const horizontalView = document.querySelector("#horizontalView");
const verticalView = document.querySelector("#verticalView");
const numbersToggle = document.querySelector("#numbersToggle");
const startLabel = document.querySelector("#startLabel");
const targetLabel = document.querySelector("#targetLabel");
const nextLevel = document.querySelector("#nextLevel");
const reflectionCard = document.querySelector("#reflectionCard");
const reflectionActions = document.querySelector("#reflectionActions");
const reflectionKicker = document.querySelector("#reflectionKicker");
const reflectionText = document.querySelector("#reflectionText");
const tryAnother = document.querySelector("#tryAnother");
const preferFirst = document.querySelector("#preferFirst");
const preferSecond = document.querySelector("#preferSecond");
const stageButtons = document.querySelectorAll(".stage-button");
const stagePanels = document.querySelectorAll(".stage-panel");
const areaSculptingEnabled = false;
const modeButtons = document.querySelectorAll(".mode-button");
const pieceButtons = document.querySelectorAll(".piece");
const dropZones = document.querySelectorAll(".drop-zone");
let drag = null;
let suppressNextClick = false;

horizontalView.addEventListener("click", () => setOrientation("horizontal"));
verticalView.addEventListener("click", () => setOrientation("vertical"));
numbersToggle.addEventListener("click", () => {
  state.showNumbers = !state.showNumbers;
  numbersToggle.setAttribute("aria-pressed", String(state.showNumbers));
  numbersToggle.textContent = state.showNumbers ? "Numbers on" : "Numbers off";
  renderNumbers();
  renderTrace();
  updatePieceAvailability();
});

function setOrientation(orientation) {
  if (orientation === state.orientation) return;

  const updateLayout = () => {
    state.orientation = orientation;
    document.body.classList.toggle("layout-vertical", orientation === "vertical");
    document.body.classList.toggle("layout-horizontal", orientation === "horizontal");
    document.querySelector(".target-stage").classList.toggle("is-vertical", orientation === "vertical");
    horizontalView.classList.toggle("is-active", orientation === "horizontal");
    verticalView.classList.toggle("is-active", orientation === "vertical");
    horizontalView.setAttribute("aria-pressed", String(orientation === "horizontal"));
    verticalView.setAttribute("aria-pressed", String(orientation === "vertical"));
    renderTargetBand();
    render();
  };

  if (document.startViewTransition) {
    document.startViewTransition(updateLayout);
  } else {
    updateLayout();
  }
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

stageButtons.forEach((button) => {
  button.addEventListener("click", () => setStage(button.dataset.stage));
});

pieceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (suppressNextClick) return;
    usePieceInZone(button.dataset.piece, state.stage, null);
  });
  button.addEventListener("pointerdown", (event) => startDrag(event, button));
  button.addEventListener("mousedown", (event) => startDrag(event, button));
});

document.querySelectorAll("[data-action='reset']").forEach((button) => {
  button.addEventListener("click", reset);
});

document.querySelectorAll("[data-level-step]").forEach((button) => {
  button.addEventListener("click", () => {
    stepLandingLevel(Number(button.dataset.levelStep));
  });
});

nextLevel.addEventListener("click", () => {
  if (landingLevels[state.levelIndex].randomTarget) {
    resetLandingLevel(true);
    return;
  }

  if (state.levelIndex < landingLevels.length - 1) {
    state.levelIndex += 1;
    resetLandingLevel(true);
  }
});

tryAnother.addEventListener("click", () => {
  resetLandingAttempt(true, false);
});

preferFirst.addEventListener("click", () => chooseRoute("first"));
preferSecond.addEventListener("click", () => chooseRoute("second"));

function stepLandingLevel(step) {
  const nextIndex = clamp(state.levelIndex + step, 0, landingLevels.length - 1);
  if (nextIndex === state.levelIndex) return;
  state.levelIndex = nextIndex;
  setStage("landing");
  resetLandingLevel(true);
}

function setStage(stage) {
  if (stage === "sculpt" && !areaSculptingEnabled) {
    stage = "landing";
  }
  state.stage = stage;
  stageTitle.textContent = stage === "landing" ? "Target Landing" : "Area Sculpting";
  stageButtons.forEach((button) => {
    const active = button.dataset.stage === stage;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  stagePanels.forEach((panel) => {
    const active = panel.dataset.stagePanel === stage;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });
  updateModeAvailability();
  renderMessages();
  updatePieceAvailability();
  updatePieceLabels();
}

function setMode(mode) {
  state.mode = mode;
  modeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === mode);
  });
  renderMessages();
  updatePieceAvailability();
}

function updateModeAvailability() {
  document.querySelector(".mode-switch").classList.add("is-landing");
}

async function landPiece(key) {
  if (state.loading || state.won) return;
  if (!hasLandingPiece(key)) {
    landingMessage.textContent = "that piece is not available here";
    return;
  }

  const piece = pieces[key];
  const level = landingLevels[state.levelIndex];
  let direction = state.mode === "subtract" ? -1 : 1;
  const moveValue = level.steps?.[key] || piece.step;
  let travel = moveValue * (level.stepScale || 1);
  const previous = state.position;
  const moveNumber = state.moveCount + 1;
  const duration = moveNumber === 1 ? 650 : moveNumber * 1400 * piece.loadWeight;
  const destination = clamp(state.position + travel * direction, 0, 100);
  const token = state.loadToken + 1;

  state.loadToken = token;
  consumeLandingPiece(key);
  state.loading = true;
  updatePieceAvailability();
  if (duration > 0) {
    await runLoad(piece, moveNumber, duration, previous, destination, direction);
    if (token !== state.loadToken) return;
  }

  state.position = destination;

  state.history.push({
    from: previous,
    to: state.position,
    color: piece.color,
    piece: key,
    mode: state.mode,
    value: moveValue,
    direction
  });
  if (state.history.length > 7) state.history.shift();

  state.moveCount += 1;
  state.lastLandingPiece = key;
  state.loading = false;
  previewLanding(state.position);
  render();
  checkLandingWin();
  updatePieceAvailability();
}

function usePieceInZone(key, zone, point) {
  if (zone === "landing") {
    landPiece(key);
  }

  if (zone === "sculpt") {
    sculptPiece(key, point || centerOfSculpture());
  }
}

function hasLandingPiece(key) {
  return (state.inventory[key] || 0) > 0;
}

function consumeLandingPiece(key) {
  state.inventory[key] = Math.max(0, (state.inventory[key] || 0) - 1);
}

function runLoad(piece, moveNumber, duration, from, to, direction) {
  const liveBlock = document.createElement("span");
  liveBlock.className = `trace-step live-block ${direction < 0 ? "backward" : "forward"}`;
  liveBlock.style.background = piece.color;
  trace.append(liveBlock);

  const start = performance.now();

  return new Promise((resolve) => {
    function tick(now) {
      const progress = clamp((now - start) / duration, 0, 1);
      const current = from + (to - from) * progress;
      setAxisPosition(marker, current);
      setBlockGeometry(liveBlock, from, current);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => {
          liveBlock.remove();
          resolve();
        }, 120);
      }
    }

    requestAnimationFrame(tick);
  });
}

function sculptPiece(key, point) {
  const piece = sculptPieces[key];
  if (!piece) {
    sculptMessage.textContent = "this primitive belongs to landing";
    return;
  }

  const svgPoint = svgPointFromClient(point);

  if (state.mode === "subtract") {
    carvePiece(piece, svgPoint);
    addChip(key);
    state.sculptCoverage = Math.max(0, state.sculptCoverage - piece.unitsWide * piece.unitsHigh);
  } else {
    addAreaPiece(piece, 1, false, svgPoint);
    state.sculptCoverage += piece.unitsWide * piece.unitsHigh;
  }

  trimSvgChildren(areaPieces, 18);
  trimSvgChildren(cutPieces, 18);
  renderMessages();
}

function previewLanding(position) {
  setAxisPosition(ghostMarker, position);
  ghostMarker.classList.add("is-visible");
  window.clearTimeout(previewLanding.timeout);
  previewLanding.timeout = window.setTimeout(() => {
    ghostMarker.classList.remove("is-visible");
  }, 550);
}

function resetLandingLevel(newTarget = true) {
  state.firstRoute = null;
  state.secondRoute = null;
  state.routeChoice = null;
  resetLandingAttempt(false, newTarget);
}

function resetLandingAttempt(keepFirstRoute, newTarget) {
  const level = landingLevels[state.levelIndex];
  if (newTarget) prepareRandomChallenge(level);
  const primaryTarget = level.targets ? level.targets[0] : level.target;
  if (!keepFirstRoute) {
    state.firstRoute = null;
    state.secondRoute = null;
    state.routeChoice = null;
  }
  state.mode = "add";
  modeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === "add");
  });
  target.start = primaryTarget[0];
  target.end = primaryTarget[1];
  target.center = (target.start + target.end) / 2;
  state.position = level.start;
  state.moveCount = 0;
  state.loading = false;
  state.loadToken += 1;
  state.won = false;
  state.inventory = { ...level.inventory };
  state.lastLandingPiece = null;
  state.history = [];
  nextLevel.hidden = true;
  hideReflection();
  levelTitle.textContent = level.title;
  levelCount.textContent = `${state.levelIndex + 1} / ${landingLevels.length}`;
  numbersToggle.hidden = state.levelIndex !== landingLevels.length - 1;
  if (numbersToggle.hidden) state.showNumbers = true;
  numbersToggle.setAttribute("aria-pressed", String(state.showNumbers));
  numbersToggle.textContent = state.showNumbers ? "Numbers on" : "Numbers off";
  renderTargetBand();
  render();
  updateModeAvailability();
  updatePieceAvailability();
}

function prepareRandomChallenge(level) {
  if (!level.randomTarget) return;

  if (level.randomInventory) {
    level.inventory = buildRandomInventory(level);
    level.randomTarget.offsets = reachableOffsets(level);
  }

  const offsets = level.randomTarget.offsets || [];
  if (!offsets.length) return;
  const scale = level.stepScale || 1;
  const offset = offsets[Math.floor(Math.random() * offsets.length)] * scale;
  const width = (level.randomTarget.width || 4) * scale;
  const center = clamp(level.start + offset, width / 2, 100 - width / 2);
  level.target = [center - width / 2, center + width / 2];
}

function buildRandomInventory(level) {
  const randomInventory = level.randomInventory;
  const total = randomInt(randomInventory.min, randomInventory.max);
  const inventory = {};

  for (let index = 0; index < total; index += 1) {
    const key = randomInventory.keys[Math.floor(Math.random() * randomInventory.keys.length)];
    inventory[key] = (inventory[key] || 0) + 1;
  }

  return inventory;
}

function reachableOffsets(level) {
  const entries = Object.entries(level.inventory).flatMap(([key, count]) => Array.from({ length: count }, () => level.steps[key] || pieces[key].step));
  const offsets = new Set();

  function walk(index, total, used) {
    if (index >= entries.length) {
      if (used && total !== 0 && total >= level.randomTarget.minOffset && total <= level.randomTarget.maxOffset) offsets.add(total);
      return;
    }

    walk(index + 1, total, used);
    walk(index + 1, total + entries[index], true);
    walk(index + 1, total - entries[index], true);
  }

  walk(0, 0, false);
  return Array.from(offsets).sort((a, b) => a - b);
}

function renderTargetBand() {
  const runway = document.querySelector(".runway");
  const level = landingLevels[state.levelIndex];
  const ranges = level.targets || [level.target];
  const primary = ranges[0];
  const secondary = ranges[1];
  const mirrorWidth = Math.max(...ranges.map((range) => Math.abs((range[0] + range[1]) / 2 - level.start)));

  runway.classList.toggle("is-mirror-level", Boolean(level.mirrorFlip));
  startLabel.textContent = level.numeric ? "S" : "start";
  targetLabel.textContent = level.numeric ? "T" : "target";
  runway.style.setProperty("--start-left", `${landingLevels[state.levelIndex].start - 4}%`);
  runway.style.setProperty("--start-label-left", `${landingLevels[state.levelIndex].start}%`);
  runway.style.setProperty("--target-left", `${primary[0]}%`);
  runway.style.setProperty("--target-width", `${primary[1] - primary[0]}%`);
  runway.style.setProperty("--target-label-left", `${primary[0] + (primary[1] - primary[0]) / 2}%`);
  runway.style.setProperty("--target-left-2", `${secondary ? secondary[0] : primary[0]}%`);
  runway.style.setProperty("--target-width-2", `${secondary ? secondary[1] - secondary[0] : 0}%`);
  runway.style.setProperty("--target-secondary-opacity", secondary ? 1 : 0);
  runway.style.setProperty("--mirror-width", `${mirrorWidth}%`);
  runway.style.setProperty("--start-position", `${level.start}%`);
  runway.style.setProperty("--target-top", `${primary[1]}%`);
  runway.style.setProperty("--target-height", `${primary[1] - primary[0]}%`);
  runway.style.setProperty("--target-center", `${primary[0] + (primary[1] - primary[0]) / 2}%`);
}

function landingTargetRanges() {
  const level = landingLevels[state.levelIndex];
  return level.targets || [[target.start, target.end]];
}

function isInLandingTarget(position) {
  return landingTargetRanges().some((range) => position >= range[0] && position <= range[1]);
}

function nearestLandingTarget(position) {
  return landingTargetRanges()
    .map((range) => ({
      range,
      distance: position < range[0] ? range[0] - position : position > range[1] ? position - range[1] : 0
    }))
    .sort((a, b) => a.distance - b.distance)[0].range;
}

function checkLandingWin() {
  const inTarget = isInLandingTarget(state.position);
  if (!inTarget) {
    const hasPieces = Object.values(state.inventory).some((count) => count > 0);
    if (!hasPieces) landingMessage.textContent = "out of pieces; reset this level";
    return;
  }

  state.won = true;
  showLandingSuccess();
  updatePieceAvailability();
}

function showLandingSuccess() {
  const level = landingLevels[state.levelIndex];
  const signature = routeSignature();
  const showRule = !level.randomTarget;
  const showEquation = Boolean(level.numeric);
  reflectionCard.classList.toggle("is-empty", !(showRule || showEquation));
  reflectionKicker.textContent = showEquation ? "equation" : "rule";
  reflectionText.textContent = showEquation ? equationText(level) : showRule ? level.rule || "You landed inside the target band." : "";
  tryAnother.hidden = true;
  preferFirst.hidden = true;
  preferSecond.hidden = true;

  if (level.askAnother && !state.firstRoute) {
    state.firstRoute = signature;
    nextLevel.hidden = true;
    tryAnother.hidden = false;
    landingMessage.textContent = "landed; now try a different route";
    syncReflectionActions();
    return;
  }

  if (level.askAnother && state.firstRoute && !state.secondRoute) {
    if (signature === state.firstRoute) {
      nextLevel.hidden = true;
      tryAnother.hidden = false;
      reflectionKicker.textContent = "same route";
      reflectionText.textContent = "That was the same path. Reset this attempt and try a different order or direction.";
      landingMessage.textContent = "same route; try another";
      syncReflectionActions();
      return;
    }

    state.secondRoute = signature;
    reflectionKicker.textContent = "compare";
    reflectionText.textContent = level.preferencePrompt || "Which route did you like more?";
    preferFirst.hidden = false;
    preferSecond.hidden = false;
  }

  nextLevel.hidden = state.levelIndex >= landingLevels.length - 1 && !level.randomTarget;
  landingMessage.textContent = level.randomTarget
    ? "landed; next random target is ready"
    : state.levelIndex >= landingLevels.length - 1
      ? "progression complete"
      : "landed; next target is ready";
  syncReflectionActions();
}

function chooseRoute(choice) {
  const level = landingLevels[state.levelIndex];
  state.routeChoice = choice;
  reflectionKicker.textContent = choice === "first" ? "first route" : "second route";
  reflectionText.textContent = level.rule || "Both routes helped show the rule.";
  preferFirst.hidden = true;
  preferSecond.hidden = true;
  nextLevel.hidden = state.levelIndex >= landingLevels.length - 1;
  syncReflectionActions();
}

function syncReflectionActions() {
  reflectionActions.hidden = tryAnother.hidden && preferFirst.hidden && preferSecond.hidden;
}

function routeSignature() {
  return state.history.map((move) => `${move.mode}:${move.piece}`).join("|");
}

function equationText(level) {
  const terms = state.history.map((move) => `${move.direction > 0 ? "+" : "-"} ${formatNumber(move.value)}`);
  return `0 ${terms.join(" ")} = ${formatSigned(currentResult(level))}`;
}

function targetOffset(level) {
  return (((target.start + target.end) / 2) - level.start) / (level.stepScale || 1);
}

function currentResult(level) {
  return (state.position - level.start) / (level.stepScale || 1);
}

function formatSigned(value) {
  const rounded = normalizeNumber(value);
  return rounded > 0 ? `+${formatNumber(rounded)}` : formatNumber(rounded);
}

function formatNumber(value) {
  return String(normalizeNumber(value));
}

function normalizeNumber(value) {
  const rounded = Math.round(value * 10) / 10;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function hideReflection() {
  reflectionCard.classList.add("is-empty");
  reflectionKicker.textContent = "rule";
  reflectionText.textContent = "";
  tryAnother.hidden = true;
  preferFirst.hidden = true;
  preferSecond.hidden = true;
  syncReflectionActions();
}

function addAreaPiece(piece, direction, ghosted = false, point = { x: 280, y: 150 }) {
  const width = piece.unitsWide * sculptTarget.unit;
  const height = piece.unitsHigh * sculptTarget.unit;
  const snapped = snapSculptPiece(point, width, height);
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("class", "area-piece");
  rect.setAttribute("x", String(snapped.x));
  rect.setAttribute("y", String(snapped.y));
  rect.setAttribute("width", String(width));
  rect.setAttribute("height", String(height));
  rect.setAttribute("rx", "4");
  rect.setAttribute("fill", piece.color);
  rect.setAttribute("opacity", ghosted ? ".46" : ".9");
  areaPieces.append(rect);

  const all = areaPieces.querySelectorAll(".area-piece");
  if (all.length > 18) all[0].remove();
}

function carvePiece(piece, point) {
  const width = piece.unitsWide * sculptTarget.unit;
  const height = piece.unitsHigh * sculptTarget.unit;
  const snapped = snapSculptPiece(point, width, height);
  const cut = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  cut.setAttribute("class", "cut-piece");
  cut.setAttribute("x", String(snapped.x));
  cut.setAttribute("y", String(snapped.y));
  cut.setAttribute("width", String(width));
  cut.setAttribute("height", String(height));
  cut.setAttribute("rx", "4");
  cutPieces.append(cut);
}

function snapSculptPiece(point, width, height) {
  const maxX = sculptTarget.x + sculptTarget.widthUnits * sculptTarget.unit - width;
  const maxY = sculptTarget.y + sculptTarget.heightUnits * sculptTarget.unit - height;
  const rawX = point.x - width / 2;
  const rawY = point.y - height / 2;
  const snappedX = sculptTarget.x + Math.round((rawX - sculptTarget.x) / sculptTarget.unit) * sculptTarget.unit;
  const snappedY = sculptTarget.y + Math.round((rawY - sculptTarget.y) / sculptTarget.unit) * sculptTarget.unit;

  return {
    x: clamp(snappedX, sculptTarget.x, maxX),
    y: clamp(snappedY, sculptTarget.y, maxY)
  };
}

function svgPointFromClient(point) {
  const svg = document.querySelector(".goal-shape");
  const matrix = svg.getScreenCTM();
  const svgPoint = svg.createSVGPoint();
  svgPoint.x = point.x;
  svgPoint.y = point.y;
  return svgPoint.matrixTransform(matrix.inverse());
}

function centerOfSculpture() {
  const svg = document.querySelector(".goal-shape");
  const box = svg.getBoundingClientRect();
  return {
    x: box.left + box.width / 2,
    y: box.top + box.height / 2
  };
}

function addChip(key) {
  const chip = document.createElement("span");
  chip.className = "chip";
  chip.style.background = pieces[key].color;
  chip.style.setProperty("--turn", `${Math.round(Math.random() * 50 - 25)}deg`);
  chipBowl.append(chip);
  if (chipBowl.children.length > 5) chipBowl.firstElementChild.remove();
}

function render() {
  setAxisPosition(marker, state.position);
  marker.classList.toggle("is-inside", isInLandingTarget(state.position));
  renderTrace();
  renderNumbers();
  renderMessages();
}

function renderTrace() {
  trace.innerHTML = "";
  state.history.forEach((move, index) => {
    const left = Math.min(move.from, move.to);
    const width = Math.max(4, Math.abs(move.to - move.from));
    const step = document.createElement("span");
    step.className = `trace-step ${move.direction < 0 ? "backward" : "forward"} ${index === state.history.length - 1 ? "is-current" : ""}`;
    setBlockGeometry(step, move.from, move.to);
    step.style.background = move.color;
    if (landingLevels[state.levelIndex].numeric && state.showNumbers) {
      const label = document.createElement("span");
      label.className = "trace-label";
      label.textContent = formatSigned(move.value * move.direction);
      step.append(label);
    }
    trace.append(step);
  });
}

function renderNumbers() {
  const level = landingLevels[state.levelIndex];
  numberHud.hidden = !level.numeric || !state.showNumbers;
  if (!level.numeric) return;

  targetNumber.textContent = formatSigned(targetOffset(level));
}

function renderMessages() {
  const level = landingLevels[state.levelIndex];
  const nearestTarget = nearestLandingTarget(state.position);
  const inTarget = isInLandingTarget(state.position);
  const short = state.position < nearestTarget[0] && nearestTarget[0] - state.position <= 14;
  const long = state.position > nearestTarget[1] && state.position - nearestTarget[1] <= 14;
  const modeCopy = {
    add: "push right",
    subtract: "pull left"
  };

  if (state.loading) {
    landingMessage.textContent = "waiting for the piece to load";
  } else if (state.won) {
    landingMessage.textContent = level.randomTarget
      ? "landed; next random target is ready"
      : state.levelIndex >= landingLevels.length - 1
        ? "progression complete"
        : "landed; next target is ready";
  } else if (state.moveCount === 0) {
    landingMessage.textContent = level.note;
  } else if (inTarget) {
    landingMessage.textContent = "inside the target band";
  } else if (short) {
    landingMessage.textContent = "just short of the band";
  } else if (long) {
    landingMessage.textContent = "just past the band";
  } else {
    landingMessage.textContent = `${modeCopy[state.mode]} on the lane`;
  }

  if (state.sculptCoverage <= 0) {
    sculptMessage.textContent = "fill the 13 x 4 triangle territory";
  } else if (state.mode === "subtract") {
    sculptMessage.textContent = "cut the difference from the placed forms";
  } else {
    sculptMessage.textContent = `${formatNumber(state.sculptCoverage)} square units placed`;
  }
}

function updatePieceAvailability() {
  pieceButtons.forEach((button) => {
    const key = button.dataset.piece;
    const level = landingLevels[state.levelIndex];
    const count = state.inventory[key] || 0;
    const countBadge = button.querySelector(".piece-count");
    const valueBadge = button.querySelector(".piece-value");

    if (state.stage === "landing") {
      const belongsToLevel = Object.prototype.hasOwnProperty.call(level.inventory, key);
      button.hidden = false;
      button.disabled = !belongsToLevel || count <= 0 || state.loading || state.won;
      button.classList.toggle("is-unavailable", button.disabled && belongsToLevel);
      button.classList.toggle("is-not-in-level", !belongsToLevel);
      if (countBadge) countBadge.textContent = belongsToLevel ? String(count) : "no";
      if (valueBadge) valueBadge.textContent = level.numeric && state.showNumbers && belongsToLevel ? formatNumber(level.steps?.[key] || pieces[key].step) : "";
    } else {
      const belongsToSculpt = Object.prototype.hasOwnProperty.call(sculptPieces, key);
      button.hidden = !belongsToSculpt;
      button.disabled = !belongsToSculpt;
      button.classList.remove("is-unavailable");
      button.classList.remove("is-not-in-level");
      if (countBadge) countBadge.textContent = "";
      if (valueBadge) valueBadge.textContent = belongsToSculpt ? `${sculptPieces[key].unitsWide}x${sculptPieces[key].unitsHigh}` : "";
    }
  });
}

function setAxisPosition(element, position) {
  if (state.orientation === "vertical") {
    element.style.left = "50%";
    element.style.top = `${100 - position}%`;
  } else {
    element.style.left = `${position}%`;
    element.style.top = "62%";
  }
}

function setBlockGeometry(element, from, to) {
  const start = Math.min(from, to);
  const length = Math.max(1.2, Math.abs(to - from));
  if (state.orientation === "vertical") {
    element.style.left = "50%";
    element.style.top = `${100 - Math.max(from, to)}%`;
    element.style.width = "54px";
    element.style.height = `${length}%`;
  } else {
    element.style.left = `${start}%`;
    element.style.top = "62%";
    element.style.width = `${length}%`;
    element.style.height = "36px";
  }
}

function updatePieceLabels() {
  pieceButtons.forEach((button) => {
    const key = button.dataset.piece;
    const name = button.querySelector(".piece-name");
    if (!name) return;
    if (state.stage === "sculpt" && sculptPieces[key]) {
      name.textContent = sculptPieces[key].trayName;
      return;
    }
    name.textContent = pieces[key].name;
  });
}

function reset() {
  setMode("add");
  if (state.stage === "landing") {
    resetLandingLevel(false);
    return;
  }

  state.sculptCoverage = 0;
  areaPieces.innerHTML = "";
  cutPieces.innerHTML = "";
  chipBowl.innerHTML = "";
  renderMessages();
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function trimSvgChildren(parent, max) {
  while (parent.children.length > max) parent.firstElementChild.remove();
}

resetLandingLevel();

function startDrag(event, button) {
  if (drag) return;
  if (event.button && event.button !== 0) return;
  if (button.disabled || button.classList.contains("is-not-in-level")) return;
  const piece = dragVisualPiece(button.dataset.piece);
  const isMouse = event.type === "mousedown";
  drag = {
    key: button.dataset.piece,
    button,
    isMouse,
    startX: event.clientX,
    startY: event.clientY,
    moved: false,
    visual: piece,
    proxy: document.createElement("div")
  };
  button.classList.add("is-dragging");
  drag.proxy.className = `drag-proxy ${piece.directionClass || ""}`;
  drag.proxy.style.width = `${piece.width}px`;
  drag.proxy.style.height = `${piece.height}px`;
  drag.proxy.style.background = piece.color;
  document.body.append(drag.proxy);
  if (!isMouse && button.setPointerCapture) button.setPointerCapture(event.pointerId);
  moveDrag(event);
  document.addEventListener(isMouse ? "mousemove" : "pointermove", moveDrag);
  document.addEventListener(isMouse ? "mouseup" : "pointerup", endDrag, { once: true });
  if (!isMouse) document.addEventListener("pointercancel", cancelDrag, { once: true });
}

function dragVisualPiece(key) {
  if (state.stage === "sculpt" && sculptPieces[key]) {
    return {
      width: sculptPieces[key].unitsWide * sculptTarget.unit,
      height: sculptPieces[key].unitsHigh * sculptTarget.unit,
      color: sculptPieces[key].color
    };
  }

  const runwayBox = document.querySelector(".runway").getBoundingClientRect();
  const level = landingLevels[state.levelIndex];
  const moveValue = (level.steps?.[key] || pieces[key].step) * (level.stepScale || 1);
  const direction = state.mode === "subtract" ? -1 : 1;
  const destination = clamp(state.position + moveValue * direction, 0, 100);
  const span = Math.max(1.2, Math.abs(destination - state.position));

  if (state.orientation === "vertical") {
    return {
      width: 54,
      height: Math.max(18, runwayBox.height * span / 100),
      color: pieces[key].color,
      axis: "vertical",
      direction,
      directionClass: direction > 0 ? "drag-up" : "drag-down"
    };
  }

  return {
    width: Math.max(18, runwayBox.width * span / 100),
    height: 36,
    color: pieces[key].color,
    axis: "horizontal",
    direction,
    directionClass: direction > 0 ? "drag-right" : "drag-left"
  };
}

function moveDrag(event) {
  if (!drag) return;
  const travel = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
  drag.moved = drag.moved || travel > 6;
  positionDragProxy(event.clientX, event.clientY);
  dropZones.forEach((zone) => {
    const box = zone.getBoundingClientRect();
    const inside = event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
    zone.classList.toggle("is-hovered", inside && drag.moved);
  });
}

function positionDragProxy(x, y) {
  const visual = drag.visual;
  if (!visual.axis) {
    drag.proxy.style.left = `${x - visual.width / 2}px`;
    drag.proxy.style.top = `${y - visual.height / 2}px`;
    return;
  }

  if (visual.axis === "horizontal") {
    drag.proxy.style.left = `${visual.direction > 0 ? x : x - visual.width}px`;
    drag.proxy.style.top = `${y - visual.height / 2}px`;
    return;
  }

  drag.proxy.style.left = `${x - visual.width / 2}px`;
  drag.proxy.style.top = `${visual.direction > 0 ? y - visual.height : y}px`;
}

function endDrag(event) {
  if (!drag) return;
  const zone = Array.from(dropZones).find((candidate) => {
    const box = candidate.getBoundingClientRect();
    return event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
  });
  if (zone && drag.moved) {
    usePieceInZone(drag.key, zone.dataset.zone, { x: event.clientX, y: event.clientY });
    suppressNextClick = true;
    window.setTimeout(() => {
      suppressNextClick = false;
    }, 140);
  }
  cancelDrag();
}

function cancelDrag() {
  if (!drag) return;
  drag.button.classList.remove("is-dragging");
  document.removeEventListener(drag.isMouse ? "mousemove" : "pointermove", moveDrag);
  document.removeEventListener(drag.isMouse ? "mouseup" : "pointerup", endDrag);
  if (!drag.isMouse) document.removeEventListener("pointercancel", cancelDrag);
  drag.proxy.remove();
  drag = null;
  dropZones.forEach((zone) => zone.classList.remove("is-hovered"));
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // Browsers that block service workers still run the game normally.
    });
  });
}


/**
 * @file Holds the game logic: drawing cards, checking answers, and moving between screens.
 */

// The ids of every screen, so showScreen can hide all but one
const screenIds = ["start-screen", "intro-screen", "play-screen", "end-screen"];

// Position of the level being played in the levels array from levels.js
let currentLevelIndex = 0;

/**
 * Shows one screen and hides all the others.
 * @param {string} screenId - The id of the screen to show.
 */
function showScreen(screenId) {
  for (let i = 0; i < screenIds.length; i++) {
    const screen = document.getElementById(screenIds[i]);
    screen.classList.remove("screen-active");
  }
  document.getElementById(screenId).classList.add("screen-active");
}

/**
 * Starts a level by drawing its cards and showing the play screen.
 * @param {number} levelIndex - Position of the level in the levels array, starting at 0.
 */
function startLevel(levelIndex) {
  currentLevelIndex = levelIndex;
  const level = levels[levelIndex];
  document.getElementById("level-title").innerText = level.title;
  drawCards(level.bitValues);
  updateTotal();
  showScreen("play-screen");
}

/**
 * Removes the old cards and draws one new card for each bit value.
 * @param {Array} bitValues - The value of each card, from left to right.
 */
function drawCards(bitValues) {
  const cardRow = document.getElementById("play-cards");
  while (cardRow.children.length > 0) {
    cardRow.removeChild(cardRow.children[0]);
  }
  for (let i = 0; i < bitValues.length; i++) {
    cardRow.appendChild(createCard(bitValues[i]));
  }
}

/**
 * Builds one card button that starts in the off position.
 * @param {number} bitValue - The number this card is worth, such as 16.
 * @returns {HTMLElement} The new card button.
 */
function createCard(bitValue) {
  const card = document.createElement("button");
  card.classList.add("card");
  // aria-pressed tells screen readers whether the card is on or off
  card.setAttribute("aria-pressed", "false");

  const valueLabel = document.createElement("span");
  valueLabel.classList.add("card-value");
  valueLabel.innerText = bitValue;
  card.appendChild(valueLabel);

  const stateLabel = document.createElement("span");
  stateLabel.classList.add("card-state");
  stateLabel.innerText = "Off (0)";
  card.appendChild(stateLabel);

  card.addEventListener("click", flipCard);
  return card;
}

/**
 * Flips the clicked card on or off and updates the running total.
 * @param {Object} event - The click event. Space and Enter on a button also send a click.
 */
function flipCard(event) {
  const card = event.currentTarget;
  card.classList.toggle("card-on");
  // The second span inside the card shows the on or off label
  const stateLabel = card.children[1];
  if (card.classList.contains("card-on")) {
    stateLabel.innerText = "On (1)";
    card.setAttribute("aria-pressed", "true");
  } else {
    stateLabel.innerText = "Off (0)";
    card.setAttribute("aria-pressed", "false");
  }
  updateTotal();
}

/**
 * Adds up the values of the cards that are turned on.
 * @returns {number} The sum of the cards that are on.
 */
function getSum() {
  const cards = document.getElementById("play-cards").children;
  const bitValues = levels[currentLevelIndex].bitValues;
  let sum = 0;
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].classList.contains("card-on")) {
      sum = sum + bitValues[i];
    }
  }
  return sum;
}

/**
 * Writes the cards as binary digits, such as "01101".
 * @returns {string} A 1 for each card that is on and a 0 for each card that is off.
 */
function getBinaryText() {
  const cards = document.getElementById("play-cards").children;
  let binaryText = "";
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].classList.contains("card-on")) {
      binaryText = binaryText + "1";
    } else {
      binaryText = binaryText + "0";
    }
  }
  return binaryText;
}

/**
 * Shows the binary digits and their total, or hides them if the level turns the total off.
 */
function updateTotal() {
  const totalText = document.getElementById("running-total");
  if (levels[currentLevelIndex].showTotal) {
    totalText.innerText = "Binary " + getBinaryText() + " = " + getSum();
  } else {
    totalText.innerText = "";
  }
}

/**
 * Starts the game for a player who is new to binary.
 */
function startNew() {
  // The intro comes before Level 1 in a later step. For now this goes straight to Level 1.
  startLevel(0);
}

/**
 * Starts the game at Level 2 for a player who knows a little binary.
 */
function startSome() {
  startLevel(1);
}

/**
 * Starts the game at Level 3 for a player who wants a challenge.
 */
function startChallenge() {
  startLevel(2);
}

document.getElementById("start-new").addEventListener("click", startNew);
document.getElementById("start-some").addEventListener("click", startSome);
document.getElementById("start-challenge").addEventListener("click", startChallenge);

/**
 * @file Holds the game logic: drawing cards, checking answers, and moving between screens.
 */

// The ids of every screen, so showScreen can hide all but one
const screenIds = ["start-screen", "intro-screen", "play-screen", "end-screen"];

// After this many wrong tries, the game shows the answer and moves on
const maxWrongTries = 3;

// Position of the level being played in the levels array from levels.js
let currentLevelIndex = 0;

// Position of the current target number in the level's targets array
let targetIndex = 0;

// How many wrong answers the player has given for the current target
let wrongTries = 0;

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
 * Starts a level from its first target number.
 * @param {number} levelIndex - Position of the level in the levels array, starting at 0.
 */
function startLevel(levelIndex) {
  currentLevelIndex = levelIndex;
  targetIndex = 0;
  document.getElementById("level-title").innerText = levels[levelIndex].title;
  showScreen("play-screen");
  startRound();
}

/**
 * Starts one round: shows the target number and a fresh row of cards.
 */
function startRound() {
  wrongTries = 0;
  document.getElementById("target-text").innerText = "Make the number " + getTarget();
  drawCards(levels[currentLevelIndex].bitValues);
  updateTotal();
  showFeedback("", "");
  document.getElementById("check-button").style.display = "";
  document.getElementById("next-button").style.display = "none";
  // Put focus on the first card so keyboard players can start right away
  getCards()[0].focus();
}

/**
 * Gets the number the player is trying to make this round.
 * @returns {number} The current target number.
 */
function getTarget() {
  return levels[currentLevelIndex].targets[targetIndex];
}

/**
 * Gets the card buttons on the play screen, from left to right.
 * @returns {Array} The card buttons.
 */
function getCards() {
  return document.getElementById("play-cards").children;
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

  const valueLabel = document.createElement("span");
  valueLabel.classList.add("card-value");
  valueLabel.innerText = bitValue;
  card.appendChild(valueLabel);

  const stateLabel = document.createElement("span");
  stateLabel.classList.add("card-state");
  card.appendChild(stateLabel);

  setCard(card, false);
  card.addEventListener("click", flipCard);
  return card;
}

/**
 * Turns one card on or off and updates its label.
 * @param {HTMLElement} card - The card button to change.
 * @param {boolean} turnOn - True to turn the card on, false to turn it off.
 */
function setCard(card, turnOn) {
  // The second span inside the card shows the on or off label
  const stateLabel = card.children[1];
  if (turnOn) {
    card.classList.add("card-on");
    stateLabel.innerText = "On (1)";
    // aria-pressed tells screen readers whether the card is on or off
    card.setAttribute("aria-pressed", "true");
  } else {
    card.classList.remove("card-on");
    stateLabel.innerText = "Off (0)";
    card.setAttribute("aria-pressed", "false");
  }
}

/**
 * Checks whether a card is turned on.
 * @param {HTMLElement} card - The card button to check.
 * @returns {boolean} True if the card is on.
 */
function isCardOn(card) {
  return card.classList.contains("card-on");
}

/**
 * Flips the clicked card and updates the running total.
 * @param {Object} event - The click event. Space and Enter on a button also send a click.
 */
function flipCard(event) {
  const card = event.currentTarget;
  setCard(card, !isCardOn(card));
  updateTotal();
}

/**
 * Adds up the values of the cards that are turned on.
 * @returns {number} The sum of the cards that are on.
 */
function getSum() {
  const cards = getCards();
  const bitValues = levels[currentLevelIndex].bitValues;
  let sum = 0;
  for (let i = 0; i < cards.length; i++) {
    if (isCardOn(cards[i])) {
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
  const cards = getCards();
  let binaryText = "";
  for (let i = 0; i < cards.length; i++) {
    if (isCardOn(cards[i])) {
      binaryText = binaryText + "1";
    } else {
      binaryText = binaryText + "0";
    }
  }
  return binaryText;
}

/**
 * Writes the cards that are on as an addition, such as "8 + 4 + 1 = 13."
 * @returns {string} The addition sentence.
 */
function getSumText() {
  const cards = getCards();
  const bitValues = levels[currentLevelIndex].bitValues;
  let sumText = "";
  let cardsOn = 0;
  // No plus sign before the first number, then a plus sign before each one after it
  let separator = "";
  for (let i = 0; i < cards.length; i++) {
    if (isCardOn(cards[i])) {
      sumText = sumText + separator + bitValues[i];
      separator = " + ";
      cardsOn = cardsOn + 1;
    }
  }
  if (cardsOn === 0) {
    return "All the cards are off, so the total is 0.";
  } else if (cardsOn === 1) {
    return "Only the " + sumText + " card is on, so the total is " + sumText + ".";
  }
  return sumText + " = " + getSum() + ".";
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
 * Shows a message in the feedback box with a matching color.
 * @param {string} message - The words to show.
 * @param {string} feedbackClass - "feedback-correct", "feedback-wrong", "feedback-help", or "" for none.
 */
function showFeedback(message, feedbackClass) {
  const feedback = document.getElementById("feedback");
  feedback.classList.remove("feedback-correct", "feedback-wrong", "feedback-help");
  if (feedbackClass !== "") {
    feedback.classList.add(feedbackClass);
  }
  feedback.innerText = message;
}

/**
 * Checks the player's cards against the target number and gives feedback.
 */
function checkAnswer() {
  const sum = getSum();
  if (sum === getTarget()) {
    showFeedback("Correct! " + getSumText(), "feedback-correct");
    endRound();
  } else {
    wrongTries = wrongTries + 1;
    showWrongFeedback(sum);
  }
}

/**
 * Gives help after a wrong answer, with stronger help after each wrong try.
 * @param {number} sum - The total of the player's cards.
 */
function showWrongFeedback(sum) {
  const feedbackStyle = levels[currentLevelIndex].feedbackStyle;
  if (wrongTries >= maxWrongTries) {
    showAnswer();
    endRound();
  } else if (wrongTries === 2 && feedbackStyle === "full") {
    showFeedback(getCardHint(), "feedback-wrong");
  } else if (wrongTries === 2) {
    showFeedback(getDirectionText(sum) + " Tip: start with the biggest card that fits.", "feedback-wrong");
  } else {
    showFeedback(getDirectionText(sum), "feedback-wrong");
  }
}

/**
 * Says whether the player's total is too much or too little.
 * @param {number} sum - The total of the player's cards.
 * @returns {string} A sentence such as "Your cards make 17. That's too much for 13."
 */
function getDirectionText(sum) {
  let direction = "too little";
  if (sum > getTarget()) {
    direction = "too much";
  }
  return "Not yet. Your cards make " + sum + ". That's " + direction + " for " + getTarget() + ".";
}

/**
 * Finds the first wrong card, going from the biggest card to the smallest, and asks about it.
 * @returns {string} A question such as "Look at the 8 card. You still need 5. Is 8 too big?"
 */
function getCardHint() {
  const cards = getCards();
  const bitValues = levels[currentLevelIndex].bitValues;
  let stillNeed = getTarget();
  for (let i = 0; i < cards.length; i++) {
    const shouldBeOn = bitValues[i] <= stillNeed;
    if (shouldBeOn !== isCardOn(cards[i])) {
      return "Not yet. Look at the " + bitValues[i] + " card. You still need " + stillNeed + ". Is " + bitValues[i] + " too big?";
    }
    if (shouldBeOn) {
      stillNeed = stillNeed - bitValues[i];
    }
  }
  return "Not yet. Check each card again.";
}

/**
 * Sets every card to the right answer and explains each card, biggest first.
 */
function showAnswer() {
  const cards = getCards();
  const bitValues = levels[currentLevelIndex].bitValues;
  let stillNeed = getTarget();
  let explanation = "Here's how to make " + getTarget() + ", starting with the biggest card:";
  for (let i = 0; i < cards.length; i++) {
    if (bitValues[i] <= stillNeed) {
      stillNeed = stillNeed - bitValues[i];
      setCard(cards[i], true);
      explanation = explanation + "\n" + bitValues[i] + " fits, so it's on. You still need " + stillNeed + ".";
    } else if (stillNeed === 0) {
      setCard(cards[i], false);
      explanation = explanation + "\n" + "Nothing is left to make, so " + bitValues[i] + " is off.";
    } else {
      setCard(cards[i], false);
      explanation = explanation + "\n" + bitValues[i] + " is too big, so it's off.";
    }
  }
  updateTotal();
  showFeedback(explanation, "feedback-help");
}

/**
 * Ends the round by swapping the Check button for the Next button.
 */
function endRound() {
  document.getElementById("check-button").style.display = "none";
  const nextButton = document.getElementById("next-button");
  nextButton.style.display = "";
  // Move focus to Next, because the Check button the player just pressed is now hidden
  nextButton.focus();
}

/**
 * Moves to the next target number, the next level, or the end screen.
 */
function goToNext() {
  targetIndex = targetIndex + 1;
  if (targetIndex < levels[currentLevelIndex].targets.length) {
    startRound();
  } else if (currentLevelIndex + 1 < levels.length) {
    startLevel(currentLevelIndex + 1);
  } else {
    showScreen("end-screen");
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
document.getElementById("check-button").addEventListener("click", checkAnswer);
document.getElementById("next-button").addEventListener("click", goToNext);

/**
 * @file Holds the game logic: drawing cards, checking answers, and moving between screens.
 */

// The ids of every screen, so showScreen can hide all but one
const screenIds = ["start-screen", "intro-screen", "play-screen", "level-screen", "end-screen"];

// After this many wrong tries, the game shows the answer and moves on
const maxWrongTries = 3;

// The screen the player is looking at
let currentScreenId = "start-screen";

// The row that holds the cards on screen, and the value of each card from left to right.
// The intro and the levels each have their own row, but only one is on screen at a time.
let cardRowId = "play-cards";
let cardValues = [];

// Position of the current lesson in the introLessons array from levels.js
let lessonIndex = 0;

// Position of the level being played in the levels array from levels.js
let currentLevelIndex = 0;

// Position of the current target number in the level's targets array
let targetIndex = 0;

// How many wrong answers the player has given for the current target
let wrongTries = 0;

// In guided play: which card the game is asking about, and how much is left to make
let guidedCardIndex = 0;
let stillNeed = 0;

// Points earned in each level, and whether the player has played it, in the same order as levels
let levelPoints = [];
let levelPlayed = [];

// Correct first tries in a row, which earn bonus points in levels that use a streak
let streak = 0;
let bestStreak = 0;

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
  currentScreenId = screenId;
  updateNav();
  closeMenu();
}

/**
 * Starts the intro from its first lesson.
 */
function startIntro() {
  lessonIndex = 0;
  showScreen("intro-screen");
  showLesson();
}

/**
 * Shows the current intro lesson and its cards.
 */
function showLesson() {
  const lesson = introLessons[lessonIndex];
  // Add 1 so players count lessons from 1, not 0
  document.getElementById("intro-step").innerText = "Lesson " + (lessonIndex + 1) + " of " + introLessons.length;
  document.getElementById("intro-text").innerText = lesson.text;
  drawCards("intro-cards", lesson.bitValues);
  document.getElementById("intro-total").innerText = getTotalText();
  const introFeedback = document.getElementById("intro-feedback");
  introFeedback.classList.remove("feedback-correct", "feedback-help");
  introFeedback.innerText = "";
  document.getElementById("intro-next").style.display = "none";
  getCards()[0].focus();
}

/**
 * Updates the intro total and message after every flip, and shows Next only while the target is met.
 */
function checkLesson() {
  const lesson = introLessons[lessonIndex];
  const introFeedback = document.getElementById("intro-feedback");
  document.getElementById("intro-total").innerText = getTotalText();
  introFeedback.classList.remove("feedback-correct", "feedback-help");
  if (getSum() === lesson.target) {
    introFeedback.classList.add("feedback-correct");
    introFeedback.innerText = lesson.doneText;
    document.getElementById("intro-next").style.display = "";
  } else {
    introFeedback.classList.add("feedback-help");
    introFeedback.innerText = getSumText() + " The goal is " + lesson.target + ".";
    document.getElementById("intro-next").style.display = "none";
  }
}

/**
 * Moves to the next intro lesson, or to Level 1 after the last lesson.
 */
function goToNextLesson() {
  lessonIndex = lessonIndex + 1;
  if (lessonIndex < introLessons.length) {
    showLesson();
  } else {
    startLevel(0);
  }
}

/**
 * Starts a level from its first target number.
 * @param {number} levelIndex - Position of the level in the levels array, starting at 0.
 */
function startLevel(levelIndex) {
  currentLevelIndex = levelIndex;
  targetIndex = 0;
  // Starting a level again replaces its old points, so the score shows the latest try
  levelPoints[levelIndex] = 0;
  levelPlayed[levelIndex] = true;
  streak = 0;
  document.getElementById("level-title").innerText = levels[levelIndex].title;
  updateScoreBar();
  showScreen("play-screen");
  startRound();
}

/**
 * Starts one round: shows the target number and a fresh row of cards.
 */
function startRound() {
  wrongTries = 0;
  document.getElementById("target-text").innerText = "Make the number " + getTarget();
  drawCards("play-cards", levels[currentLevelIndex].bitValues);
  updateTotal();
  showFeedback("", "");
  document.getElementById("next-button").style.display = "none";
  if (levels[currentLevelIndex].guided) {
    startGuidedRound();
  } else {
    startFreeRound();
  }
}

/**
 * Sets up a round where the player flips cards freely and presses Check.
 */
function startFreeRound() {
  document.getElementById("guided-question").innerText = "";
  showGuidedButtons(false);
  document.getElementById("check-button").style.display = "";
  // Put focus on the first card so keyboard players can start right away
  getCards()[0].focus();
}

/**
 * Sets up a round where the game asks about one card at a time.
 */
function startGuidedRound() {
  guidedCardIndex = 0;
  stillNeed = getTarget();
  document.getElementById("check-button").style.display = "none";
  showGuidedButtons(true);
  lockCards();
  askGuidedQuestion();
  // Put focus on the first answer button so keyboard players can answer right away
  document.getElementById("answer-too-big").focus();
}

/**
 * Shows or hides the two answer buttons used in guided play.
 * @param {boolean} show - True to show the buttons, false to hide them.
 */
function showGuidedButtons(show) {
  let display = "none";
  if (show) {
    display = "";
  }
  document.getElementById("answer-too-big").style.display = display;
  document.getElementById("answer-fits").style.display = display;
}

/**
 * Gets the number the player is trying to make this round.
 * @returns {number} The current target number.
 */
function getTarget() {
  return levels[currentLevelIndex].targets[targetIndex];
}

/**
 * Gets the card buttons on screen, from left to right.
 * @returns {Array} The card buttons.
 */
function getCards() {
  return document.getElementById(cardRowId).children;
}

/**
 * Removes the old cards from a row and draws one new card for each bit value.
 * @param {string} rowId - The id of the row to draw the cards in.
 * @param {Array} bitValues - The value of each card, from left to right.
 */
function drawCards(rowId, bitValues) {
  cardRowId = rowId;
  cardValues = bitValues;
  const cardRow = document.getElementById(rowId);
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

  // Screen readers say "Card worth 16" and then whether it is pressed (on) or not
  card.setAttribute("aria-label", "Card worth " + bitValue);

  const placeLabel = document.createElement("span");
  placeLabel.classList.add("card-place");
  placeLabel.innerText = "worth " + bitValue;
  card.appendChild(placeLabel);

  const digitLabel = document.createElement("span");
  digitLabel.classList.add("card-digit");
  card.appendChild(digitLabel);

  setCard(card, false);
  card.addEventListener("click", flipCard);
  return card;
}

/**
 * Locks every card so pressing it does nothing, for guided play.
 */
function lockCards() {
  const cards = getCards();
  for (let i = 0; i < cards.length; i++) {
    cards[i].classList.add("card-locked");
    // aria-disabled tells screen readers the card can't be pressed right now
    cards[i].setAttribute("aria-disabled", "true");
  }
}

/**
 * Turns one card on or off and updates its label.
 * @param {HTMLElement} card - The card button to change.
 * @param {boolean} turnOn - True to turn the card on, false to turn it off.
 */
function setCard(card, turnOn) {
  // The second span inside the card shows the binary digit, 1 for on and 0 for off
  const digitLabel = card.children[1];
  if (turnOn) {
    card.classList.add("card-on");
    digitLabel.innerText = "1";
    // aria-pressed tells screen readers whether the card is on or off
    card.setAttribute("aria-pressed", "true");
  } else {
    card.classList.remove("card-on");
    digitLabel.innerText = "0";
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
 * Flips the pressed card, then updates the intro or the running total.
 * @param {Object} event - The click event. Space and Enter on a button also send a click.
 */
function flipCard(event) {
  const card = event.currentTarget;
  // In guided play the game turns cards on itself, so pressing a locked card does nothing
  if (card.classList.contains("card-locked")) {
    return;
  }
  setCard(card, !isCardOn(card));
  if (currentScreenId === "intro-screen") {
    checkLesson();
  } else {
    updateTotal();
  }
}

/**
 * Adds up the values of the cards that are turned on.
 * @returns {number} The sum of the cards that are on.
 */
function getSum() {
  const cards = getCards();
  let sum = 0;
  for (let i = 0; i < cards.length; i++) {
    if (isCardOn(cards[i])) {
      sum = sum + cardValues[i];
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
  let sumText = "";
  let cardsOn = 0;
  // No plus sign before the first number, then a plus sign before each one after it
  let separator = "";
  for (let i = 0; i < cards.length; i++) {
    if (isCardOn(cards[i])) {
      sumText = sumText + separator + cardValues[i];
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
 * Writes the binary digits and their total, such as "Binary 01010 = 10".
 * @returns {string} The binary digits and the total.
 */
function getTotalText() {
  return "Binary " + getBinaryText() + " = " + getSum();
}

/**
 * Shows the binary digits and their total, or hides them if the level turns the total off.
 */
function updateTotal() {
  const totalText = document.getElementById("running-total");
  if (levels[currentLevelIndex].showTotal) {
    totalText.innerText = getTotalText();
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
 * Asks whether the current card is too big for what is still needed, and rings that card.
 */
function askGuidedQuestion() {
  const cards = getCards();
  const bitValue = cardValues[guidedCardIndex];
  for (let i = 0; i < cards.length; i++) {
    cards[i].classList.remove("card-current");
  }
  cards[guidedCardIndex].classList.add("card-current");
  document.getElementById("guided-question").innerText = "You still need " + stillNeed + ". The " + bitValue + " card is worth " + bitValue + ". Is " + bitValue + " too big?";
}

/**
 * Checks the player's answer to the guided question and moves to the next card if it's right.
 * @param {boolean} saysTooBig - True if the player answered "Yes, too big".
 */
function answerGuided(saysTooBig) {
  const bitValue = cardValues[guidedCardIndex];
  const isTooBig = bitValue > stillNeed;
  if (saysTooBig !== isTooBig) {
    showFeedback("Not quite. Is " + bitValue + " bigger than " + stillNeed + "? If it is, it's too big. If not, it fits.", "feedback-wrong");
    return;
  }
  const stepText = applyGuidedAnswer(bitValue, isTooBig);
  guidedCardIndex = guidedCardIndex + 1;
  if (guidedCardIndex < cardValues.length) {
    showFeedback(stepText, "feedback-correct");
    askGuidedQuestion();
  } else {
    finishGuidedRound(stepText);
  }
}

/**
 * Turns the current card on if it fits, and explains what happened.
 * @param {number} bitValue - The value of the current card.
 * @param {boolean} isTooBig - True if the card is bigger than what is still needed.
 * @returns {string} A sentence explaining why the card is on or off.
 */
function applyGuidedAnswer(bitValue, isTooBig) {
  if (isTooBig) {
    return "Right. " + bitValue + " is bigger than " + stillNeed + ", so the " + bitValue + " card stays off.";
  }
  stillNeed = stillNeed - bitValue;
  setCard(getCards()[guidedCardIndex], true);
  updateTotal();
  return "Right. " + bitValue + " fits, so the " + bitValue + " card turns on. You still need " + stillNeed + ".";
}

/**
 * Ends a guided round by showing the finished number in binary.
 * @param {string} stepText - The explanation for the last card.
 */
function finishGuidedRound(stepText) {
  const cards = getCards();
  // The last card is always the one being asked about when the round ends
  cards[cards.length - 1].classList.remove("card-current");
  document.getElementById("guided-question").innerText = "";
  showGuidedButtons(false);
  addPoints(1);
  showFeedback(stepText + "\nDone! " + getSumText() + " In binary, " + getTarget() + " is " + getBinaryText() + ". +" + getPointsText(1) + ".", "feedback-correct");
  endRound();
}

/**
 * Answers "Yes, too big" to the guided question.
 */
function answerTooBig() {
  answerGuided(true);
}

/**
 * Answers "No, it fits" to the guided question.
 */
function answerFits() {
  answerGuided(false);
}

/**
 * Checks the player's cards against the target number and gives feedback.
 */
function checkAnswer() {
  const sum = getSum();
  if (sum === getTarget()) {
    showFeedback("Correct! " + getSumText() + scoreCorrectAnswer(), "feedback-correct");
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
    // No points this round, and the streak starts over
    streak = 0;
    updateScoreBar();
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
  let stillNeedHere = getTarget();
  for (let i = 0; i < cards.length; i++) {
    const shouldBeOn = cardValues[i] <= stillNeedHere;
    if (shouldBeOn !== isCardOn(cards[i])) {
      return "Not yet. Look at the " + cardValues[i] + " card. You still need " + stillNeedHere + ". Is " + cardValues[i] + " too big?";
    }
    if (shouldBeOn) {
      stillNeedHere = stillNeedHere - cardValues[i];
    }
  }
  return "Not yet. Check each card again.";
}

/**
 * Sets every card to the right answer and explains each card, biggest first.
 */
function showAnswer() {
  const cards = getCards();
  let stillNeedHere = getTarget();
  let explanation = "Here's how to make " + getTarget() + ", starting with the biggest card:";
  for (let i = 0; i < cards.length; i++) {
    if (cardValues[i] <= stillNeedHere) {
      stillNeedHere = stillNeedHere - cardValues[i];
      setCard(cards[i], true);
      explanation = explanation + "\n" + cardValues[i] + " fits, so it's on. You still need " + stillNeedHere + ".";
    } else if (stillNeedHere === 0) {
      setCard(cards[i], false);
      explanation = explanation + "\n" + "Nothing is left to make, so " + cardValues[i] + " is off.";
    } else {
      setCard(cards[i], false);
      explanation = explanation + "\n" + cardValues[i] + " is too big, so it's off.";
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
  // Move focus to Next, because the button the player just pressed is now hidden
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
    showLevelComplete();
  } else {
    showEndScreen();
  }
}

/**
 * Writes a number of points with the right word, such as "1 point" or "3 points".
 * @param {number} points - How many points.
 * @returns {string} The number and the word point or points.
 */
function getPointsText(points) {
  if (points === 1) {
    return "1 point";
  }
  return points + " points";
}

/**
 * Adds points to the current level and updates the score bar.
 * @param {number} points - How many points to add.
 */
function addPoints(points) {
  levelPoints[currentLevelIndex] = levelPoints[currentLevelIndex] + points;
  updateScoreBar();
}

/**
 * Adds up the points from every level.
 * @returns {number} The total score.
 */
function getTotalScore() {
  let total = 0;
  for (let i = 0; i < levelPoints.length; i++) {
    total = total + levelPoints[i];
  }
  return total;
}

/**
 * Gives points for a correct answer in free play and says how many were earned.
 * @returns {string} The points message, such as " +3 points."
 */
function scoreCorrectAnswer() {
  // 3 points on the first try, 2 on the second, 1 on the third
  const points = maxWrongTries - wrongTries;
  addPoints(points);
  let message = " +" + getPointsText(points) + ".";
  if (levels[currentLevelIndex].useStreak) {
    message = message + updateStreak(wrongTries === 0);
  }
  return message;
}

/**
 * Grows the streak after a correct first try, or starts it over, and gives a bonus point for 2 or more in a row.
 * @param {boolean} firstTry - True if the answer was right on the first try.
 * @returns {string} A bonus message, or "" if there is no bonus.
 */
function updateStreak(firstTry) {
  if (!firstTry) {
    streak = 0;
    updateScoreBar();
    return "";
  }
  streak = streak + 1;
  if (streak > bestStreak) {
    bestStreak = streak;
  }
  if (streak < 2) {
    updateScoreBar();
    return "";
  }
  addPoints(1);
  return " " + streak + " in a row! +1 bonus point.";
}

/**
 * Shows the total score and the streak. The streak only shows in levels that use it.
 */
function updateScoreBar() {
  document.getElementById("score").innerText = getTotalScore();
  document.getElementById("streak").innerText = streak;
  document.getElementById("best-streak").innerText = bestStreak;
  let streakDisplay = "none";
  if (levels[currentLevelIndex].useStreak) {
    streakDisplay = "";
  }
  document.getElementById("streak-display").style.display = streakDisplay;
}

/**
 * Sets every level's points to 0 and clears the streak, for a new game.
 */
function resetScores() {
  for (let i = 0; i < levels.length; i++) {
    levelPoints[i] = 0;
    levelPlayed[i] = false;
  }
  streak = 0;
  bestStreak = 0;
}

/**
 * Shows the level complete screen with the points for the level just finished.
 */
function showLevelComplete() {
  const level = levels[currentLevelIndex];
  const nextLevelButton = document.getElementById("next-level-button");
  document.getElementById("level-done-title").innerText = "You finished " + level.title + "!";
  document.getElementById("level-done-text").innerText = "You earned " + getPointsText(levelPoints[currentLevelIndex]) + ". " + level.doneText;
  nextLevelButton.innerText = "Go to " + levels[currentLevelIndex + 1].title;
  showScreen("level-screen");
  nextLevelButton.focus();
}

/**
 * Starts the level after the one just finished.
 */
function goToNextLevel() {
  startLevel(currentLevelIndex + 1);
}

/**
 * Starts the level just finished again, from its first target number.
 */
function replayLevel() {
  startLevel(currentLevelIndex);
}

/**
 * Shows the end screen with the points for each level the player played.
 */
function showEndScreen() {
  const endList = document.getElementById("end-list");
  while (endList.children.length > 0) {
    endList.removeChild(endList.children[0]);
  }
  for (let i = 0; i < levels.length; i++) {
    if (levelPlayed[i]) {
      const item = document.createElement("li");
      item.innerText = levels[i].title + ": " + getPointsText(levelPoints[i]);
      endList.appendChild(item);
    }
  }
  document.getElementById("end-summary").innerText = levels[levels.length - 1].doneText;
  document.getElementById("end-total").innerText = "Total: " + getPointsText(getTotalScore());
  showScreen("end-screen");
  document.getElementById("play-again").focus();
}

/**
 * Clears the score and goes back to the start screen.
 */
function playAgain() {
  resetScores();
  showScreen("start-screen");
  document.getElementById("start-new").focus();
}

/**
 * Adds one button for each level to the level menu in the header.
 */
function buildLevelNav() {
  const levelButtons = document.getElementById("level-buttons");
  for (let i = 0; i < levels.length; i++) {
    const button = document.createElement("button");
    button.classList.add("nav-button");
    // Short labels keep the menu on one row. Add 1 so levels count from 1, not 0.
    button.innerText = "Level " + (i + 1);
    button.addEventListener("click", chooseLevel);
    levelButtons.appendChild(button);
  }
}

/**
 * Starts the level whose button was pressed in the level menu.
 * @param {Object} event - The click event from a level button.
 */
function chooseLevel(event) {
  const buttons = document.getElementById("level-buttons").children;
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i] === event.currentTarget) {
      startLevel(i);
    }
  }
}

/**
 * Marks the menu button for the screen being played: the intro or one level.
 */
function updateNav() {
  markNavButton(document.getElementById("nav-intro"), currentScreenId === "intro-screen");
  const buttons = document.getElementById("level-buttons").children;
  for (let i = 0; i < buttons.length; i++) {
    markNavButton(buttons[i], currentScreenId === "play-screen" && i === currentLevelIndex);
  }
}

/**
 * Shows one menu button as current or not current.
 * @param {HTMLElement} button - The menu button to mark.
 * @param {boolean} isCurrent - True if this button's screen is being played.
 */
function markNavButton(button, isCurrent) {
  if (isCurrent) {
    button.classList.add("nav-button-current");
    // aria-current tells screen readers which screen is being played
    button.setAttribute("aria-current", "true");
  } else {
    button.classList.remove("nav-button-current");
    button.setAttribute("aria-current", "false");
  }
}

/**
 * Opens or closes the level menu on narrow screens.
 */
function toggleMenu() {
  const navList = document.getElementById("nav-list");
  navList.classList.toggle("nav-list-open");
  // aria-expanded tells screen readers whether the menu is open
  if (navList.classList.contains("nav-list-open")) {
    document.getElementById("menu-button").setAttribute("aria-expanded", "true");
  } else {
    document.getElementById("menu-button").setAttribute("aria-expanded", "false");
  }
}

/**
 * Closes the level menu, so it doesn't cover the new screen.
 */
function closeMenu() {
  document.getElementById("nav-list").classList.remove("nav-list-open");
  document.getElementById("menu-button").setAttribute("aria-expanded", "false");
}

/**
 * Starts the game with the intro, for a player who is new to binary.
 */
function startNew() {
  startIntro();
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
document.getElementById("intro-next").addEventListener("click", goToNextLesson);
document.getElementById("answer-too-big").addEventListener("click", answerTooBig);
document.getElementById("answer-fits").addEventListener("click", answerFits);
document.getElementById("check-button").addEventListener("click", checkAnswer);
document.getElementById("next-button").addEventListener("click", goToNext);
document.getElementById("nav-intro").addEventListener("click", startIntro);
document.getElementById("menu-button").addEventListener("click", toggleMenu);
document.getElementById("next-level-button").addEventListener("click", goToNextLevel);
document.getElementById("replay-level-button").addEventListener("click", replayLevel);
document.getElementById("play-again").addEventListener("click", playAgain);

// Set up a fresh game when the page loads
resetScores();
buildLevelNav();

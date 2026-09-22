/**
 * @file Holds the game content: the intro lessons and the levels.
 * Change this file to change what players see. game.js never needs editing for that.
 */

// The intro lessons, shown in order before Level 1 to players who are new to binary.
// text: what the lesson says. bitValues: the cards to show.
// target: the total that finishes the lesson. doneText: what the game says when it's reached.
const introLessons = [
  {
    text: "Computers store numbers with switches that are only on or off. Each card here is a switch. An off card shows 0 and an on card shows 1. Press the card to turn it on.",
    bitValues: [1],
    target: 1,
    doneText: "It's on, so it shows 1. You can press it again to see it turn off and show 0."
  },
  {
    text: "Each card is worth a number. A card showing 1 adds its number to the total. A card showing 0 adds nothing. Turn on both cards.",
    bitValues: [2, 1],
    target: 3,
    doneText: "Both cards show 1, so the total is 2 + 1 = 3. In binary, 3 is 11."
  },
  {
    text: "Card values double as you go left: 1, then 2, then 4. Turn on cards to make 6.",
    bitValues: [4, 2, 1],
    target: 6,
    doneText: "4 + 2 = 6. The cards read 1, 1, 0, so 6 in binary is 110."
  }
];

// Each level is one plain object. Support fades from Level 1 to Level 3.
// bitValues: the value of each card, from left to right.
// targets: the numbers the player makes, in order.
// guided: true means the game asks about one card at a time.
// showTotal: true means the running total is shown while playing.
// feedbackStyle: "full" points to a wrong card, "count" only says too much or too little.
// useStreak: true means correct first tries in a row earn bonus points.
const levels = [
  {
    title: "Level 1: Guided",
    bitValues: [4, 2, 1],
    targets: [5, 2, 7, 0],
    guided: true,
    showTotal: true,
    feedbackStyle: "full",
    useStreak: false
  },
  {
    title: "Level 2: Helped",
    bitValues: [16, 8, 4, 2, 1],
    targets: [9, 16, 12, 21],
    guided: false,
    showTotal: true,
    feedbackStyle: "full",
    useStreak: false
  },
  {
    title: "Level 3: On your own",
    bitValues: [16, 8, 4, 2, 1],
    targets: [13, 31, 6, 26, 19],
    guided: false,
    showTotal: false,
    feedbackStyle: "count",
    useStreak: true
  }
];

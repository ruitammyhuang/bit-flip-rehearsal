/**
 * @file Holds the game content: the intro lessons and the levels.
 * Change this file to change what players see. game.js never needs editing for that.
 */

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

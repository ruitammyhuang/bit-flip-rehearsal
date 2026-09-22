# Bit Flip decision log

## Step 0: Project brief

**Decisions:**
- [Human, before any code] Goal: a browser game where learners turn 0 to 31 into 5-bit binary and explain each bit. Audience: adults new to CS and middle or high school students; one sitting, no login.
- [Human, before any code] Constraints: plain HTML, CSS, and JS only; opens from `index.html` with no server; nothing loads from the web; JavaScript a first-course student can read; works on laptop and tablet, not phone.
- [Human, before any code] Architecture: `index.html` for structure, `css/styles.css` for style, `js/levels.js` for content, `js/game.js` for logic. Levels change without editing game.js.
- [Human, before any code] Done means: keyboard-only play, feedback on every answer, semantic HTML with ordered headings, WCAG AA contrast, no console errors, short functions with JSDoc, cards big enough to tap.
- [Human, before any code] Workflow: plan first, build one step at a time, run beginner-code-review before calling a step done, log and commit after approval.

## Step 1: Game design and page skeleton

**Built:** Game plan approved. Added `index.html` (start, intro, play, and end screens), `css/styles.css`, empty `js/levels.js` and `js/game.js`, and a game section at the top of `README.md`.

**Problems:** The beginner-code-review found no failures. I fixed a CSS comment that called the narrow-screen rules "tablet" rules, when tablets actually get the full-size cards.

**Decisions:**
- [Human] Asked for at least three levels, with support that fades and 3 bits at the start, instead of picking one of my three ideas. Reason: gradual release of scaffolding matters most.
- [Human] Changed "five minutes of play" from a target to a rough guide. Reason: learners differ in needs and prior knowledge.
- [Human] Asked for an intro or beginner wording before "Does 4 fit into 5?" Reason: a player with no binary knowledge would not understand the question.
- [Human] Removed my Level 2 Hint button. Reason: a hint before trying gives the answer away, so there is no learning.
- [Human] Asked for points in Level 3. Reason: without them it supports learning but is less like a game.
- [AI] Added a start screen with three starting points, help that gets stronger after each wrong try, the 3/2/1 points scale, and a streak bonus.
- [AI] Chose colors, system fonts, and card sizes. Put files in the project root. Kept the workshop guide below the new README section.

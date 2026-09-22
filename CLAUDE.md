# Bit Flip: project brief

I wrote this brief before asking the AI for anything. It is the context the AI reads at the start of every session.

## Vision and goal

Bit Flip is a browser game that teaches binary place value. After five minutes of play, a learner can turn any number from 0 to 31 into 5-bit binary and say why each bit is on or off.

The players are adults new to computer science and middle or high school students. One sitting, no login, no setup.

## Constraints

- Plain HTML, CSS, and JavaScript. No frameworks, libraries, or build tools.
- The game opens by double-clicking `index.html`. No server.
- Every file the game uses lives in this project folder. Nothing loads from another website: no outside fonts, scripts, or stylesheets.
- JavaScript stays at beginner level. A student in their first programming course should be able to read every line.
- It must work on a laptop screen and a tablet screen for broader K-12 learning context compatibility. Mobile phone screen is beyond minimum viable product scope.

## Project architecture

```
bit-flip/
+-- index.html      structure only
+-- css/
|   +-- styles.css  all styling, no inline styles
+-- js/
|   +-- levels.js   game levels, content within each level
|   +-- game.js     main game logic and control
+-- assets/         images or sounds, only if needed
+-- README.md       what the game teaches and how to run it

```

Content stays separate from logic, so the code is easier to read and maintain. Changing the levels should never require editing game.js.

## Quality criteria (my definition of done)

1. A learner can play from start to finish using only the keyboard.
2. Every answer gets feedback.
3. The HTML is semantic. Clickable things are `<button>` elements, and headings go in order without skipping levels.
4. Text is readable against its background (WCAG AA contrast).
5. The browser console shows no errors.
6. Every function is short enough to read aloud and carries a JSDoc comment block.
7. Cards are big enough to tap with a finger (compatible for tablet).

## Workflow

- Propose a plan before writing any code, then wait for my approval.
- Build one step at a time. Stop after each step so I can check it in the browser.
- After I approve a step, commit it with a short, plain commit message.

## Skills and tools

- Before you tell me a step is done, run the `beginner-code-review` skill on the HTML, CSS, and JavaScript, and fix anything it flags.
- After I approve a step, run the `decision-log` skill before you commit.

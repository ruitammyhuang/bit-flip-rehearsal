# Bit Flip: project brief

I wrote this brief before asking the AI for anything. It is the context the AI reads at the start of every session.

## Vision and goal

Bit Flip is a browser game that teaches binary place value. After five minutes of play, a learner can turn any number from 0 to 31 into 5-bit binary and say why each bit is on or off.

The players are adults new to computer science and middle or high school students. One sitting, no login, no setup.

## Constraints

- Plain HTML, CSS, and JavaScript. No frameworks, libraries, build tools, or CDN links.
- The game opens by double-clicking `index.html`. No server.
- JavaScript stays at beginner level. A student in their first programming course should be able to read every line.
- It must work on a laptop screen. Phones are a bonus.

## Architecture

```
bit-flip/
├── index.html        structure only
├── css/
│   └── styles.css    all styling, no inline styles
├── js/
│   ├── levels.js     game content: the target numbers
│   └── game.js       game logic
├── assets/           images or sounds, only if needed
└── README.md         what the game teaches and how to run it
```

Content stays separate from logic. Changing the target numbers should never require editing `game.js`.

## Quality criteria (my definition of done)

1. A learner can play from start to finish using only the keyboard.
2. Every answer gets feedback.
3. The HTML is semantic. Clickable things are `<button>` elements, and headings go in order without skipping levels.
4. Text is readable against its background (WCAG AA contrast).
5. The browser console shows no errors.
6. Every function is short enough to read aloud and has a one-line comment above it saying what it does.

## Workflow

- Propose a plan before writing any code, then wait for my approval.
- Build one step at a time. Stop after each step so I can check it in the browser.
- After I approve a step, commit it with a short, plain commit message.

## Skills and tools

- Before you tell me a step with JavaScript is done, run the `beginner-js-review` skill on the `js/` folder and fix anything it flags.

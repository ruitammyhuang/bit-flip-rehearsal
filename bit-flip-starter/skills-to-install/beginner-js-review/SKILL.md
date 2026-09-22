---
name: beginner-js-review
description: Check the JavaScript in this project against beginner-level rules. Use after writing or changing any file in js/, and before saying a step is done.
---

# Beginner JS review

Read every `.js` file in `js/`. Check each rule below. Report the result as a table with three columns: rule, pass or fail, and the file and line numbers for any failure. Fix every failure, then run the check again and show the second table.

## Allowed

- `const` and `let`
- Numbers, strings, booleans, arrays, and plain objects
- Function declarations: `function checkAnswer() { ... }`
- `if` / `else if` / `else`
- `for` loops
- `addEventListener`
- `document.getElementById` and `document.querySelector`
- `textContent`, `classList.add`, `classList.remove`, `classList.toggle`
- Template literals for building short strings

## Not allowed

- `var`
- Arrow functions: `() => { ... }`
- Classes
- `async`, `await`, promises, or `fetch`
- `.map()`, `.filter()`, or `.reduce()`. Use a `for` loop instead.
- Nested ternaries
- `innerHTML`
- `import` or `export`

## Also check

- No function is longer than 15 lines.
- Every function has a one-line comment above it saying what it does.
- Variable and function names are whole words: `targetNumber`, not `tn`.
- The target numbers live in `levels.js`, not in `game.js`.

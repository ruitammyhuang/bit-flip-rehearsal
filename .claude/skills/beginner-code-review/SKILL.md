---
name: beginner-code-review
description: Check the HTML, CSS, and JavaScript in this project against beginner-level rules for readability, structure, accessibility, and documentation. Use after writing or changing any .html, .css, or .js file, and before saying a step is done.
---

# Beginner code review

This skill keeps the code readable for a learner, or designer/developer at the beginner level.

## What to read

- Every `.html` file in the project folder, including pages added later.
- Every `.js` file in `js/`.
- `css/styles.css`, and any other `.css` file in `css/`.

## How to report

1. Check every rule below that applies to each file.
2. Report the results as one table with three columns: rule, pass or fail, and the file and line numbers for any failure. List the HTML rules first, then the CSS rules, then the JavaScript rules.
3. Under the table, add the counts from "JavaScript: documentation."
4. Fix every failure, then run the check again and show the second table.

## HTML rules

- No `<script>` or `<link>` tag points to a web address (anything starting with http). All files load from this folder.
- Every clickable control is a `<button>` or an `<a href>`. Nothing clickable is a `<div>` or `<span>`.
- Each page has exactly one `<h1>`, and heading levels never skip (no `<h2>` followed by `<h4>`).
- The `<html>` tag has `lang="en"`, and the page has a `<title>`.
- Every `<img>` has `alt` text that describes the image, not the file name.
- No `style="..."` attributes. All styling lives in `css/styles.css`.
- `<script>` tags sit at the end of `<body>`, and `levels.js` loads before `game.js`.

## CSS rules

- All styling lives in `css/styles.css`. No `<style>` blocks and no `style="..."` attributes in the HTML.
- Selectors use a tag name (`body`), a class (`.card`), or an id (`#score`). Two names separated by a space is fine for something inside something else (`.board .card`).
- No `!important`.
- Class names say what the thing is, not what it looks like. `.card-on` passes. `.green` fails.
- No `@import`, and no `url()` pointing to a web address. Everything loads from this folder.
- Layout uses `display: flex` or `display: grid`, whichever fits the shape: flex for a row of cards, grid for a board with rows and columns. Use one or the other per container, not both. Avoid `float` for layout, since modern pages use flex and grid instead.
- Every clickable element has a visible focus style, written with `:focus-visible`. `outline: none` fails unless another visible style replaces it on the same selector.
- Buttons and cards are at least 44 pixels wide and 44 pixels tall, so they can be tapped on a tablet.
- The file starts with a `/* */` comment naming the file, and each group of rules has a `/* */` comment above it.

For every pair of text color and background color in the file, calculate the contrast ratio and list it in the report. A pair below 4.5 to 1 fails.

## JavaScript: allowed

- `const` and `let`
- Numbers, strings, booleans, arrays, and plain objects
- Function declarations: `function checkAnswer() { ... }`
- `if` / `else if` / `else`
- `for` loops
- `while` loops
- `addEventListener`
- `document.getElementById`, `document.getElementsByClassName`, `document.getElementsByTagName`
- `innerText`, `classList.add`, `classList.remove`, `classList.toggle`, `classList.contains`
- `setAttribute`, for ARIA attributes such as `aria-pressed`
- `event.currentTarget`, to find which element was clicked
- `.focus()`, to move keyboard focus when a button hides or a new round starts
- String joining with `+`
- `console.log`
- `element.style.display` and other style properties
- `.value`, for reading what a user typed
- `createElement`, `appendChild`, `removeChild`
- `cloneNode(true)` and `.children`

## JavaScript: not allowed

- `var`
- Arrow functions: `() => { ... }`
- Classes
- `async`, `await`, promises, or `fetch`
- `.map()`, `.filter()`, or `.reduce()`. Use a `for` loop instead.
- Nested ternaries
- `innerHTML`
- `import` or `export`

## JavaScript: also check

- Aim for functions under 15 lines. A longer function is fine if it does one job
  and reads top to bottom. Flag it in the report and say why it's longer.
  Don't split a function or squeeze lines together just to hit the number.
- No more than two levels of nesting. An if inside a for loop is fine.
  An if inside an if inside a for loop is not.
- Variable and function names are whole words: `targetNumber`, not `tn`.
- The target numbers live in `levels.js`, not in `game.js`.

## JavaScript: documentation

Use JSDoc, the standard comment format for JavaScript. VS Code reads JSDoc and shows it when you hover over a function name. Comments never run, so they can't change how the game works.

Every function gets a block like this directly above it:

```js
/**
 * Flips one card on or off and updates the running sum.
 * @param {number} cardIndex - Position of the card, from 0 to 4.
 */
function flipCard(cardIndex) {
```

A function that returns a value also gets `@returns`:

```js
/**
 * Adds up the place values of the cards that are turned on.
 * @param {Array} cards - The five card objects.
 * @returns {number} The sum of the cards that are on.
 */
function getSum(cards) {
```

Check each of these. Each one is pass or fail:

1. Every `.js` file starts with a `/** ... */` block that has an `@file` tag and one sentence on what the file holds.
2. Every function has a `/** ... */` block directly above it, with no blank line between the block and the function.
3. The first line of each block is one sentence that starts with a verb and ends with a period. "Flips one card on or off." passes. "This function flips the card" fails.
4. Each block has one `@param` for each parameter, in the same order, and each name matches the code exactly.
5. Every `@param` and `@returns` has a type in braces: `{number}`, `{string}`, `{boolean}`, `{Array}`, `{Object}`, or `{HTMLElement}`.
6. `@returns` appears only when the function returns a value.
7. Every `//` comment sits on its own line above the code it explains. A `//` comment that only repeats the next line in words fails. Example: `// add 1 to score` above `score = score + 1;`. A comment that says why passes: `// Start at level 1, not 0, so the display matches what players count`.

Under the results table, report these counts:

- Interactive elements with a visible focus style: X of Y
- Color pairs meeting 4.5 to 1 contrast: X of Y
- Files with an `@file` header: X of Y
- Functions with a JSDoc block: X of Y
- Parameters documented with matching names: X of Y
- Functions that return a value and have `@returns`: X of Y

Every count must be X of X to pass.
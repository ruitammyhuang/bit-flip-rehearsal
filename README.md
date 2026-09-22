# Bit Flip

Bit Flip is a browser game that teaches binary place value. Players learn to turn any number from 0 to 31 into 5-bit binary and to explain why each bit is on or off.

**What it teaches.** Each card is a bit worth 16, 8, 4, 2, or 1. A card that is on counts toward the total, and a card that is off counts as 0. Players start from what they already know:

- **Intro:** short, hands-on screens that explain what binary is.
- **Level 1 (Guided):** three cards (4, 2, 1). The game asks about each card in turn: "Is 4 too big?"
- **Level 2 (Helped):** five cards, with a running total. Help appears only after a wrong try, and it gets stronger each time.
- **Level 3 (On your own):** five cards, no running total, and bonus points for correct first tries in a row.

Every level gives points: 3 for a first try, 2 for a second, and 1 for a third. A finished guided round in Level 1 gives 1 point. Players can change levels at any time from the menu at the top of every screen. On narrow screens, the menu folds behind a Levels button.

**Changing the content.** Levels, target numbers, and intro lessons live in `js/levels.js`. Changing target numbers, lesson text, or level settings never requires editing `js/game.js`.

**How to run it.** Double-click `index.html`. It opens in any modern browser, needs no internet connection or server, and can be played with only a keyboard.

---

# Bit Flip starter package

This is the starting point from the Live 3 session: the project brief and two skills, and no game code. The game gets built from here, with an AI, in front of you.

You can use this package three ways: follow along during the session, rebuild the game yourself afterward, or swap in your own brief and build something else.

It works with **Claude Code** or **OpenAI Codex**. The instructions below cover Claude Code first, and the "Using Codex instead" section at the end covers what changes.

## What's in the package

```
bit-flip-starter/
+-- AGENTS.md                                the project brief
+-- CLAUDE.md                                one line, pointing at AGENTS.md
+-- skills-to-install/
|   +-- beginner-code-review/SKILL.md        checks HTML, CSS, and JS against beginner rules
|   +-- decision-log/SKILL.md                records each step and who decided what
+-- README.md                                this file
```

**`AGENTS.md`** is the brief: the goal, the rules, the folder structure, and what counts as done. The AI reads it at the start of every session in this folder, so you don't repeat yourself.

**`CLAUDE.md`** holds one line telling Claude Code to read `AGENTS.md`. Claude Code looks for `CLAUDE.md` and Codex looks for `AGENTS.md`, so the pointer lets one brief serve both. Edit `AGENTS.md`, and leave `CLAUDE.md` alone.

**Skills** are checklists the AI runs on its own work. `beginner-code-review` checks the code against the rules from Modules 2 and 3, plus accessibility checks. `decision-log` writes `DEVLOG.md`, a record of each build step and who made each call.

## Before you start

You need three things:

1. **VS Code**, with a folder open.
2. **An AI coding assistant**, installed and signed in: Claude Code (needs a Claude Pro plan or API credits, since the free plan doesn't include it) or Codex.
3. **The unzipped starter folder**, somewhere outside Google Drive, OneDrive, or Dropbox. Sync services can interfere with the files Git writes.

## Step 1. Install the skills

An AI assistant only finds skills in one specific folder, and the folder name starts with a dot, which makes it hidden. So you move them with a command rather than by dragging.

Open the starter folder in VS Code (File, then Open Folder). Open the terminal with **Ctrl + `** (Control and the backtick key, above Tab), or View, then Terminal.

**Claude Code, on macOS:**

```
mkdir -p .claude/skills
mv skills-to-install/* .claude/skills/
rmdir skills-to-install
ls .claude/skills
```

**Claude Code, on Windows (PowerShell):**

```
mkdir .claude\skills
move skills-to-install\* .claude\skills\
rmdir skills-to-install
dir .claude\skills
```

(Codex users: same commands, with `.codex` in place of `.claude`. See the last section.)

The final line lists what's there. You should see `beginner-code-review` and `decision-log`.

What each command does: `mkdir` makes a folder, `mv` (or `move`) moves files into it, `rmdir` deletes the empty folder left behind, and `ls` (or `dir`) lists a folder's contents.

## Step 2. Check that the AI sees everything

If you are using Claude Code, type:

```
/beginner-code-review
```

and

```
/decision-log
```

For Codex, type:

```
/skill
```

In either cases, `beginner-code-review` and `decision-log` should appear. If they don't, the folder is in the wrong place. Check the folder again, and confirm each skill folder holds a file named exactly `SKILL.md`.


## Step 3. Make the AI prove it read the brief

Before asking for any code, ask this:

```
Read AGENTS.md. Tell me back in your own words what we are building, who it is for, what the rules are, and what counts as done. Don't write any code.
```

Read the answer against the brief. If anything comes back wrong or fuzzy, the brief is unclear, not the AI. Fix that line in `AGENTS.md` and ask again.

This step takes 30 seconds and saves a lot of rework. A brief the AI misreads is a brief your teammates would misread too.

## Step 4. Plan the game before building it

In Claude Code, switch into **plan mode**, where it can think and propose but cannot change files. Press **Shift + Tab** until the status line says plan mode.

Ask for options first:

```
Give me three different game ideas that meet the learning goal in AGENTS.md.
For each one, write one sentence on how it plays and one sentence on what it teaches well or badly. Don't write any code yet.
```

Pick one, and say why in terms of the learning goal, not in terms of what looks fun. If none of them fits, say so and describe what you want instead. Rejecting all three is a legitimate move.

Then ask for a plan:

```
Let's go with [your choice]. Break the build into small steps I can check in the browser after each one, and list the risks you see.
```

Read the plan. Push back on anything that looks too big to check in one pass. Then approve it and leave plan mode with Shift + Tab.

## Step 5. Build one step at a time

```
Build the first step. Stop when it's done so I can check it in the browser.
```

After each step, open `index.html` in a browser and try it yourself. The brief tells the AI to run `beginner-code-review` before calling a step done, and to run `decision-log` after you approve it, so you should see a results table and a new entry in `DEVLOG.md` as you go.

Then keep going, one step at a time, checking each one.

## Using Codex instead

Everything above works with Codex, with three differences.

**1. The brief is already in the right place.** Codex reads `AGENTS.md`, which is where the brief lives. Ignore `CLAUDE.md`, and don't delete it, so the package keeps working for both tools.

**2. Skills go in `.codex/skills/` instead.** In Step 1, run these instead.

On macOS:

```
mkdir -p .codex/skills
mv skills-to-install/* .codex/skills/
rmdir skills-to-install
ls .codex/skills
```

On Windows (PowerShell):

```
mkdir .codex\skills
move skills-to-install\* .codex\skills\
rmdir skills-to-install
dir .codex\skills
```

The `SKILL.md` files themselves need no changes. Start Codex instead of `claude`.

**3. There's no plan mode.** Claude Code can be locked into proposing without touching files. Codex has approval settings, but those control whether edits need your OK, not whether the AI plans first. So in Step 4, ask for it directly:

```
Don't write or change any files yet. Give me three different game ideas that meet the learning goal in AGENTS.md, one sentence each on how it plays and what it teaches well or badly.
```

Then, before building:

```
Still no files. Break the build into small steps I can check in the browser after each one, and list the risks you see.
```

Worth noticing: the discipline is yours either way. Plan mode enforces a habit, it doesn't create one.

## What you're practicing

The AI writes most of the code. You decide what gets built, whether it's good enough, and what changes. Those decisions live in three places you can point at afterward: `AGENTS.md`, which says what good means here; the review reports, which say whether the code met it; and `DEVLOG.md`, which says who decided what along the way.

That record is also what a design reflection is built from. A reflection explains why the decisions were made. The log only documents what they were.

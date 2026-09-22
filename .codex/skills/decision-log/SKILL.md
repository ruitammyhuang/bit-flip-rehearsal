---
name: decision-log
description: Keep DEVLOG.md, a running record of each build step, the problems that came up, and who made each decision. Use after every step the user approves, right before committing, and whenever the user asks who decided what.
---

# Decision log

After each step I approve, and before you commit, add one entry to the end of `DEVLOG.md` in the project root. Commit `DEVLOG.md` together with that step's code.

If `DEVLOG.md` doesn't exist yet, create it with the heading `# Bit Flip decision log`. Then add a Step 0 entry listing the decisions in `AGENTS.md` that will shape the build: the goal, the architecture, the constraints, and the quality criteria. One line each, and group related ones into a single line rather than repeating the brief. Mark them all [Human, before any code].

## Entry format

```
## Step N: short name of the step

**Built:** one or two sentences on what changed. Name the files.

**Problems:** what went wrong and how it was fixed, including anything the
beginner-code-review skill flagged. Write "None" if nothing went wrong.

**Decisions:**
- [Human] what I decided, and the reason I gave.
- [AI] what you decided on your own, and why.
```

## Rules for the Decisions list

- Mark a decision [Human] only if I stated it, picked it from options you gave me, or changed something you proposed.
- Use my reason if I gave one. If I didn't give a reason, write "no reason given." Never make up a reason for me.
- Mark a decision [AI] if you made it without asking me. Examples: colors, names, layout details, the wording of messages, how the code is organized inside a file.
- When I change something you proposed, log it as [Human] and say what your version was. Example: "[Human] Changed wrong-answer feedback from 'Try again' to showing the learner's sum. Reason: 'Try again' tells a learner nothing."
- Keep each entry under 12 lines. Use plain words.
- Never edit or delete earlier entries. The log is a record of what happened.

## When I ask who made the decisions

Count the items and show three numbers: decisions made before any code (Step 0), [Human] decisions during the build, and [AI] decisions during the build. Then list the three [Human] decisions that shaped the game most, one line each.

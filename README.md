# Advent of Code puzzleData grabber

Quick and dirty script grab to puzzle data from Advent of Code using NodeJS.

## Table of Contents

1. [Output](#output)
2. [Setup](#setup)
3. [Usage](#usage)
4. [Examples](#examples)

## Output

The script outputs files in the following structure:

```zsh
.
├── 2021
│   ├── 1
│   │   ├── answer.js
│   │   ├── puzzle.md
│   │   └── puzzleData.js
│   ├── 2
│   │   ├── answer.js
│   │   ├── puzzle.md
│   │   └── puzzleData.js
│   └── etc
│       ├── answer.js
│       ├── puzzle.md
│       └── puzzleData.js
├── 2022
│   ├── 1
│   │   ├── answer.js
│   │   ├── puzzle.md
│   │   └── puzzleData.js
│   ├── 2
│   │   ├── answer.js
│   │   ├── puzzle.md
│   │   └── puzzleData.js
│   └── etc
│       ├── answer.js
│       ├── puzzle.md
│       └── puzzleData.js
└── etc
    ├── 1
    │   ├── answer.js
    │   ├── puzzle.md
    │   └── puzzleData.js
    ├── 2
    │   ├── answer.js
    │   ├── puzzle.md
    │   └── puzzleData.js
    └── etc
        ├── answer.js
        ├── puzzle.md
        └── puzzleData.js
```

Example of `puzzleData.js`:

```js
// puzzleData.js
const exampleDataPart1 = `123
456
789`;

const exampleDataPart2 = `abc
def
ghi`;

const puzzleData = `foo
bar
daz`;

export { puzzleData, exampleDataPart1, exampleDataPart2 };
```

Example of `answer.js`:

```js
// answer.js
// https://www.adventofcode.com/2023/day/2
import { puzzleData } from "./puzzleData.js";
import { exampleDataPart1, exampleDataPart2 } from "./puzzleData.js";

const dataArg = process.argv[2];

const allData = [puzzleData, exampleDataPart1, exampleDataPart2];
const input = allData[dataArg || 0].split("\n").slice(0, -1);

function solve(input) {
  console.log(input);
}

solve(input);
```

Example of `puzzle.md`

```md
\--- Day 1: Elves Elfin' Everything  ---
--------------------------------
...
```

## Setup

Grab Node packages using your CLI:

`npm ci`

The script requires your `session` cookie from the Advent of Code website. You will need to [be logged in](https://adventofcode.com/2023/auth/login) to obtain it.

The cookie should then be saved to `./sessionCookie/session.js` as follows:

```js
// ./session/session.js
const session = "123...";

export { session };
```

## Usage

`main.js` takes up to 4 arguments to run:

  1. `{year}` (required)
  2. `{day}` (required)
  3. `{exampleCodePart1Index}` : `indexNumber` | `auto` | `none` (optional)
  4. `{exampleCodePart2Index}` : `indexNumber` | `auto` | `none` (optional)

The `{year}` and `{day}` should be filled in according to the puzzle you wish to fetch.

The script scrapes the question page in order to populate `puzzle.md` as well as `exampleDataPart1` and `exampleDataPart2` in `puzzleData.js`.

Each `exampleData` is populated with `<code>` blocks on each part of the puzzle page. The `<code>` block arrays are 0-indexed:

- `indexNumber`
  1. Returns the `<code>` block at the index number given.

- `auto`
  1. Returns the first `<code>` block with length > 20.
  2. Returns the `<code>` block with the greatest length.

- `none`
  1. Returns a blank (` `` `) String.

The script mostly picks the correct example code however there are some times you will need to manually pick a `codeIndex` in order to correctly populate each `exampleData`.

To help with this, a summary of the `<code>` blocks are printed in stdout. [Year 2016, Day 6](https://adventofcode.com/2016/day/6) outputs:

```zsh
Part 1:
  <code>[0]     | eedadn
    + 16 lines
  <code>[1]     | e
  <code>[2]     | a
  <code>[3]     | s
  <code>[4]     | easter

======================
```

## Examples

### Example 1

For [Year 2022, Day 1](https://adventofcode.com/2022/day/1), run the following:

```zsh
node main.js 2022 1
```

When we successfully answer part 1, we can then run the command again to repopulate `puzzle.md` and `puzzleData.js`:

```zsh
node main.js 2022 1
```

Then reading through the question, we find we don't actually have any additional test data for part 2, we could instead request `auto` for part 1 and `none` for part 2 and get the same results:

```zsh
node main.js 2022 auto none
```

### Example 2

[Year 2022, Day 9](https://adventofcode.com/2022/day/9) grabs the wrong `<code>` block by default because the first code block that is >20 characters long isn't the one we're after! Part 2 also has example data after a very long `<code>` block.

With the stdout, we can find the matching first line being `"R 4"` for part 1 and `"R 5"` for part 2:

```zsh
Part 1:
  <code>[0]     | H
  <code>[1]     | T
  <code>[2]     | ....
    + 12 lines
  <code>[3]     | .....    .....    .....
    + 9 lines
  <code>[4]     | .....    .....    .....
    + 11 lines
  <code>[5]     | R 4
    + 8 lines
  ...
  <code>[11]    | 13

======================

Part 2:
  <code>[0]     | H
  ...
  <code>[4]     | == Initial State ==
  + 167 lines
  ...
  <code>[7]     | R 5
    + 8 lines
  ...
  <code>[12]    | ..........................
    + 21 lines

======================
```

Therefore, you would need to run:

```zsh
node main.js 2022 9 5 7
```

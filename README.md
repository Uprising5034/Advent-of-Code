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
│   ├── 3
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
// https://www.adventofcode.com/2021/day/3
import { exampleData } from "./puzzleData.js";
import { puzzleData } from "./puzzleData.js";

let useExampleData;
useExampleData = true;

const inputData = useExampleData && exampleData ? exampleData : puzzleData;

console.log(inputData);
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

## Examples

### Example 1

For [Year 2022, Day 1](https://adventofcode.com/2022/day/1), run the following:

`node main.js 2022 1`

When we successfully answer part 1, we can then run the command again to repopulate `puzzle.md` and `puzzleData.js`:

`node main.js 2022 1`

Then reading through the question, we find we don't actually have any additional test data for part 2, we could instead request `auto` for part 1 and `none` for part 2 and get the same results:

`node main.js 2022 auto none`

### Example 2

[Year 2022, Day 9](https://adventofcode.com/2022/day/9) grabs the wrong `<code>` block by default because the first code block that is greater than 20 characters long isn't the one we're after! Part 2 also has example data after a very long `<code>` block. Therefore, you would need to run:

`node main.js 2022 20 9 5 7`

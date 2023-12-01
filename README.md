# Advent of Code puzzleData grabber

Quick and dirty script grab to puzzle data from Advent of Code using NodeJS.

## Table of Contents

1. [Output](#output)
2. [Setup](#setup)
3. [Usage](#usage)

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

`main.js` takes up to 3 arguments to run:

  1. `{year}` (required)
  2. `{day}` (required)
  3. `{codeIndex}` (optional)

The `{year}` and `{day}` should be filled in according to the puzzle you wish to fetch.

The script scrapes the question page in order to populate `question.md` and `exampleData`.

`exampleData` is populated by searching for `<code>` blocks on each puzzle page. It pushes all the `<code>` blocks in an array and then picks one to use based on the first criteria which is met:

  1. Using `{codeIndex}` given in the args when running the script.
  2. The first `<code>` block with length > 20.
  3. The `<code>` block with the greatest length.

The script mostly picks the correct example code however there are some times you will need to manually pick a `codeIndex` in order to correctly populate `exampleData`.

For example, in order to grab the data for [Year 2022, Day 1](https://adventofcode.com/2022/day/1), run the following:

`node main.js 2022 1`

[Year 2022, Day 20](https://adventofcode.com/2022/day/20) however, grabs the wrong `<code>` block by default. Therefore, you would need to run:

`node main.js 2022 20 8`

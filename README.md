# Advent of Code puzzleData grabber

Quick and dirty script grab to puzzle data from Advent of Code using NodeJS.

The script outputs files in the following structure:

```zsh
.
├── 2021
│   ├── 1
│   │   ├── answer.js
│   │   └── puzzleData.js
│   ├── 2
│   │   ├── answer.js
│   │   └── puzzleData.js
│   ├── 3
│   │   ├── answer.js
│   │   └── puzzleData.js
│   └── etc
└── 2022
    ├── 1
    │   ├── answer.js
    │   └── puzzleData.js
    ├── 2
    │   ├── answer.js
    │   └── puzzleData.js
    ├── 3
    │   ├── answer.js
    │   └── puzzleData.js
    └── etc
```

Example of `puzzleData.js`:

```js
// puzzleData.js
const testData = ``;

const puzzleData = `123
456
789
`;

export { puzzleData, testData };
```

Script currently doesn't fetch `testData` (for now).

Example of `answer.js`:

```js
// answer.js
import { testData } from "./puzzleData.js";
import { puzzleData } from "./puzzleData.js";

let useTestData
useTestData = true;

const inputData = useTestData && testData ? testData : puzzleData

console.log(inputData);
```

## Setup

The script requires your `session` cookie from the Advent of Code website. You will need to [be logged in](https://adventofcode.com/2023/auth/login) to obtain it.

The cookie should then be saved to `./sessionCookie/session.js` as follows:

```js
// ./session/session.js
const session = "123...";

export { session };
```

## Usage Instructions

`main.js` takes two additional arguments to run:

  1. `{year}`
  2. `{day}`

For example, in order to grab the data for `Day 1, Year 2022`, run the following:

`node main.js 2022 1`

import fs from "node:fs";

import { session } from "./sessionCookie/session.js";

const BASE_URL = "https://www.adventofcode.com";

const testData = "puzzleData\npuzzleData\npuzzleData";

const args = process.argv.slice(2);

if (args.length != 2) {
  throw console.error("script requires args:\n{year} {day} \neg. 2022 1");
}

async function fetchPuzzleInput(year, day) {
  const opts = {
    headers: {
      cookie: `session=${session}`,
    },
  };

  const url = `${BASE_URL}/${year}/day/${day}/input`;

  const response = await fetch(url, opts);
  const puzzleData = await response.text();
  return puzzleData;
}

function writePuzzleData(year, day, puzzleData) {
  const dir = `./${year}/${day}`;
  const filePath = dir + "/puzzleData.js";

  const jsData =
    "const testData = ``;\n\nconst puzzleData = `" +
    puzzleData +
    "`;\n\nexport { puzzleData, testData };\n";

  const handleError = (err) => {
    if (err) {
      if (err.errno === -2) {
        fs.mkdir(dir, { recursive: true }, (err) => {
          if (err) {
            console.error(err);
          }
        });
        fs.writeFile(filePath, jsData, handleError);
      } else {
        console.error(err.errno);
      }
    }
  };

  fs.writeFile(filePath, jsData, handleError);
  return dir;
}

function writeAnswerFile(dir) {
  const filePath = dir + "/answer.js";

  const jsData = `import { testData } from "./puzzleData.js";\nimport { puzzleData } from "./puzzleData.js";\n\nlet useTestData;\nuseTestData = true;\n\nconst inputData = useTestData && testData ? testData : puzzleData;\n\nconsole.log(inputData);\n`;

  fs.writeFile(filePath, jsData, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

async function init() {
  const year = args[0];
  const day = args[1];

  const puzzleData = await fetchPuzzleInput(year, day);

  // const dir = writePuzzleData(year, day, testData);
  const dir = writePuzzleData(year, day, puzzleData);

  setTimeout(() => writeAnswerFile(dir), 10); // it's a bit of a bodge, but node can't find the directory without it...
}

init();

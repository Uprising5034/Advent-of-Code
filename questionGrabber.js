import fs from "node:fs";

import { session } from "./session.js";

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
    "const puzzleData = ```" + puzzleData + "```;\nexport { puzzleData };\n";

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
}

async function init() {
  const year = args[0];
  const day = args[1];

  const puzzleData = await fetchPuzzleInput(year, day)

  writePuzzleData(year, day, puzzleData);
}

init();

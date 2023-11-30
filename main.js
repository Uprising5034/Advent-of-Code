import fs from "node:fs";
import * as cheerio from "cheerio";
import TurndownService from "turndown";

import { session } from "./sessionCookie/session.js";

const BASE_URL = "https://www.adventofcode.com";

const testData = "puzzleData\npuzzleData\npuzzleData";

const args = process.argv.slice(2);

if (args.length != 2) {
  throw console.error("script requires args:\n{year} {day} \neg. 2022 1");
}

async function fetchPuzzleData(year, day) {
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

function writePuzzleData(year, day, puzzleData, exampleData) {
  const dir = `./${year}/${day}`;
  const filePath = dir + "/puzzleData.js";

  const jsData =
    "const exampleData = `" +
    exampleData +
    "`;\n\nconst puzzleData = `" +
    puzzleData +
    "`;\n\nexport { puzzleData, exampleData };\n";

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

  const jsData = `import { exampleData } from "./puzzleData.js";\nimport { puzzleData } from "./puzzleData.js";\n\nlet useExampleData;\nuseExampleData = true;\n\nconst inputData = useExampleData && exampleData ? exampleData : puzzleData;\n\nconsole.log(inputData);\n`;

  fs.writeFile(filePath, jsData, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

async function init() {
  const year = args[0];
  const day = args[1];

  const { exampleData, articleMarkdown } = await fetchPage(year, day);
  const puzzleData = await fetchPuzzleData(year, day);

  // const dir = writePuzzleData(year, day, testData);
  const dir = writePuzzleData(year, day, puzzleData, exampleData);

  setTimeout(() => writeAnswerFile(dir), 10); // it's a bit of a bodge, but node can't find the directory without it...
}

async function fetchPage(year, day) {
  const turndownService = new TurndownService();
  const url = `${BASE_URL}/${year}/day/${day}`;

  const opts = {
    headers: {
      cookie: `session=${session}`,
    },
  };

  const response = await fetch(url);
  const page = await response.text();
  const $ = cheerio.load(page);

  const articleContent = $("article").html();

  const codeElements = [];
  $("code").each((index, element) => {
    const codeContent = $(element).text();
    codeElements.push(codeContent);
  });
  const exampleData = codeElements.reduce((a, b) =>
    a.length > b.length ? a : b
  );

  const articleMarkdown = turndownService.turndown(articleContent);

  return {
    exampleData,
    articleMarkdown,
  };
}

fetchPage(args[0], args[1]);

init();

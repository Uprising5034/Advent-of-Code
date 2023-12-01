import fs from "node:fs";
import * as cheerio from "cheerio";
import TurndownService from "turndown";

import { session } from "./sessionCookie/session.js";

const BASE_URL = "https://www.adventofcode.com";

const testData = "puzzleData\npuzzleData\npuzzleData";

let args;
const [year, day, codeIndex] = (args = process.argv.slice(2));

if (args.length < 2) {
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
  const url = `${BASE_URL}/${year}/day/${day}`

  const jsData = `// ${url}\nimport { exampleData } from "./puzzleData.js";\nimport { puzzleData } from "./puzzleData.js";\n\nlet useExampleData;\nuseExampleData = true;\n\nconst inputData = useExampleData && exampleData ? exampleData : puzzleData;\n\nconsole.log(inputData);\n`;

  fs.writeFile(filePath, jsData, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

async function init() {
  const { exampleData, articleMarkdown } = await fetchPuzzlePage(
    year,
    day,
    codeIndex
  );
  const puzzleData = await fetchPuzzleData(year, day);

  // const dir = writePuzzleData(year, day, testData);
  const dir = writePuzzleData(year, day, puzzleData, exampleData);

  setTimeout(() => writeAnswerFile(dir), 10); // it's a bit of a bodge, but node can't find the directory without it...
  setTimeout(() => writePuzzleArticle(dir, articleMarkdown), 10);
}

async function fetchPuzzlePage(year, day, codeIndex) {
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

  let exampleData;
  if (codeIndex) {
    exampleData = codeElements[codeIndex];
  } else {
    exampleData = codeElements.find((element) => element.length > 20)
    if (!exampleData) {
      exampleData = codeElements.reduce((a, b) => (a.length > b.length ? a : b));
    }
  }

  const articleMarkdown = turndownService.turndown(articleContent);

  return {
    exampleData,
    articleMarkdown,
  };
}

function writePuzzleArticle(dir, articleMarkdown) {
  const filePath = dir + "/puzzle.md";

  fs.writeFile(filePath, articleMarkdown, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

init();

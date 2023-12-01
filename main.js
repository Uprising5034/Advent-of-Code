import fs from "node:fs";
import * as cheerio from "cheerio";
import TurndownService from "turndown";

import { session } from "./sessionCookie/session.js";

const BASE_URL = "https://www.adventofcode.com";

let args;
const [year, day, codeIndexArg1, codeIndexArg2] = (args =
  process.argv.slice(2));

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

  if (!exampleData.part2) {
    exampleData.part2 = ""
  }

  const jsData =
    "const exampleDataPart1 = `" +
    exampleData.part1 +
    "`;\n\nconst exampleDataPart2 = `" +
    exampleData.part2 +
    "`;\n\nconst puzzleData = `" +
    puzzleData +
    "`;\n\nexport { puzzleData, exampleDataPart1, exampleDataPart2 };\n";

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
  const url = `${BASE_URL}/${year}/day/${day}`;

  fs.open(filePath, (err) => {
    if (err) {
      if (err.errno === -2) {
        const jsData = `// ${url}\nimport { puzzleData } from "./puzzleData.js";\nimport { exampleDataPart1, exampleDataPart2 } from "./puzzleData.js";\n\nconst allData = [puzzleData, exampleDataPart1, exampleDataPart2];\n\nconst inputData = allData[0];\n\nconsole.log(inputData);\n`;
        fs.writeFile(filePath, jsData, (err) => {});
      } else {
        console.error(err);
      }
    }
  });
}

async function fetchPuzzlePage(year, day, codeIndexArg1, codeIndexArg2) {
  const turndownService = new TurndownService();
  const url = `${BASE_URL}/${year}/day/${day}`;

  const opts = {
    headers: {
      cookie: `session=${session}`,
    },
  };

  const response = await fetch(url, opts);
  const page = await response.text();
  const $ = cheerio.load(page);

  const articles = [];
  $("article").each((i, element) => {
    articles.push($(element).html());
  });

  const codeIndexArgs = [codeIndexArg1, codeIndexArg2]
  let articleStr = "";
  const exampleData = {}
  articles.forEach((article, index) => {
    const codeElements = selectCodeElements(article)
    exampleData[`part${index + 1}`] = filterCodeElements(codeElements, codeIndexArgs[index])

    articleStr += article;
  });

  const articleMarkdown = turndownService.turndown(articleStr);

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

function selectCodeElements(article) {
  const $article = cheerio.load(article);

  const codeElements = [];
  $article("code").each((index, element) => {
    const codeContent = $article(element).text();
    codeElements.push(codeContent);
  });
  return codeElements;
}

function filterCodeElements(codeArray, codeIndexArg) {
  const bigCodeLength = 20

  if (codeIndexArg === "none") return null

  if (codeIndexArg && codeIndexArg !== "auto") {
    return codeArray[codeIndexArg];
  } else {
    const firstBigCode = codeArray.find((element) => element.length > bigCodeLength);
    return (
      firstBigCode || codeArray.reduce((a, b) => (a.length > b.length ? a : b))
    );
  }
}

async function init() {
  const { exampleData, articleMarkdown } = await fetchPuzzlePage(
    year,
    day,
    codeIndexArg1,
    codeIndexArg2,
  );
  const puzzleData = await fetchPuzzleData(year, day);

  const dir = writePuzzleData(year, day, puzzleData, exampleData);

  setTimeout(() => writeAnswerFile(dir), 10); // it's a bit of a bodge, but node can't find the directory without it...
  setTimeout(() => writePuzzleArticle(dir, articleMarkdown), 10);
}

init();

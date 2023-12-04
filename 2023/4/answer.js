// https://www.adventofcode.com/2023/day/4
import { puzzleData } from "./puzzleData.js";
import { exampleDataPart1, exampleDataPart2 } from "./puzzleData.js";

const dataArg = process.argv[2];

const allData = [puzzleData, exampleDataPart1, exampleDataPart2];
const input = allData[dataArg || 0].split("\n").slice(0, -1);

function parseInput(input) {
  return input.map((line) => {
    const [cardId, nums] = line.split(": ");

    const [winNums, ownNums] = nums.split(" | ");

    return {
      id: cardId.split(" ")[1],
      winNums: winNums.split(" "),
      ownNums: ownNums.split(" "),
    };
  });
}

function matchNums(scratchCards) {
  scratchCards.forEach((card) => {
    card.matchNums = [];
    card.winNums.forEach((num) => {
      const wNum = Number(num);
      const matchedNum = card.ownNums.find((oNum) => Number(oNum) === wNum);

      if (matchedNum) {
        card.matchNums.push(Number(matchedNum));
      }
    });

    const tally = card.matchNums.length;
    card.tally = tally
    if (tally) {
      card.score = 2 ** (tally - 1);
    } else {
      card.score = 0;
    }
  });
}

function solve(input) {
  const scratchCards = parseInput(input);

  matchNums(scratchCards);

  const part1 = scratchCards.reduce((a, b) => a + b.score, 0)
  console.log(part1)
}

solve(input);

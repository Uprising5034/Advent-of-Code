// https://www.adventofcode.com/2023/day/6
import { puzzleData } from "./puzzleData.js";
import { exampleDataPart1, exampleDataPart2 } from "./puzzleData.js";

const dataArg = process.argv[2];

const allData = [puzzleData, exampleDataPart1, exampleDataPart2];
const input = allData[dataArg || 0].split("\n").slice(0, -1);

function parseText1(input) {
  return input.map((line) => {
    return line
      .split(" ")
      .filter(Boolean)
      .slice(1)
      .map((char) => Number(char));
  });
}

function parseText2(input) {
  return input.map((line) => {
    return line
      .split(":")
      .slice(1).map(seg => seg.replaceAll(" ", ""))
      .map((char) => Number(char));
  });
}

function calc(records) {
  const [times, distances] = records;

  const rounds = [];

  times.forEach((time, timeIdx) => {
    const record = distances[timeIdx];

    const wins = [];
    for (let i = 0; i <= time; i++) {
      const distance = (time - i) * i;
      if (distance > record) {
        wins.push(i);
      }
    }
    rounds.push(wins.length);
  });

  return rounds.reduce((a, b) => a * b, 1);
}

function solve(input) {
  const records1 = parseText1(input);
  const records2 = parseText2(input);

  const answer1 = calc(records1);
  const answer2 = calc(records2);

  console.log("answer1", answer1);
  console.log('answer2', answer2)
}

solve(input);

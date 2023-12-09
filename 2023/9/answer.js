// https://www.adventofcode.com/2023/day/9
import { puzzleData } from "./puzzleData.js";
import { exampleDataPart1, exampleDataPart2 } from "./puzzleData.js";

const dataArg = process.argv[2];

const allData = [puzzleData, exampleDataPart1, exampleDataPart2];
const input = allData[dataArg || 0].split("\n").slice(0, -1);

function parse(input) {
  return input.map((line) => line.split(" ").map((num) => Number(num)));
}

function calc(oasis, part2) {
  const history = oasis.map((sequence) => {
    const layers = !part2 ? [sequence] : [sequence.toReversed()];

    let lastLayer = layers[layers.length - 1];
    while (lastLayer.some((value) => value !== 0)) {
      const nextLayer = [];
      lastLayer.forEach((num, numidx) => {
        const nextNum = lastLayer[numidx + 1];

        if (!isNaN(nextNum)) {
          nextLayer.push(nextNum - num);
        } else if (nextLayer.length === 0) {
          nextLayer.push(0);
        }
      });
      layers.push(nextLayer);
      lastLayer = layers[layers.length - 1];
    }
    return layers;
  });

  history.forEach((report) => {
    for (let i = report.length - 2; i > -1; i--) {
      const sequence = report[i];
      const calcSequence = report[i + 1];

      const value = sequence[sequence.length - 1];
      const calcValue = calcSequence[calcSequence.length - 1];

      const nextValue = value + calcValue;

      sequence.push(nextValue);
    }
  });

  return history.reduce((a, b) => {
    return a + b[0][b[0].length - 1];
  }, 0);
}

function solve(input) {
  const oasis = parse(input);

  const answer1 = calc(oasis);
  const answer2 = calc(oasis, true);

  console.log("answer1", answer1);
  console.log("answer2", answer2);
}

solve(input);

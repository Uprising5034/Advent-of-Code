// https://www.adventofcode.com/2023/day/5
import { puzzleData } from "./puzzleData.js";
import { exampleDataPart1, exampleDataPart2 } from "./puzzleData.js";

const dataArg = process.argv[2];

const allData = [puzzleData, exampleDataPart1, exampleDataPart2];
const input = allData[dataArg || 0].slice(0, -1).split("\n\n");

function parseInput(input) {
  const output = {
    maps: [],
  };
  input.map((cat, catIdx) => {
    const [key, values] = cat.split(catIdx === 0 ? ": " : ":\n");
    const splitValues = values.split("\n");

    if (catIdx === 0) {
      output.seeds = [79];
      output.seeds = values.split(" ").map((char) => Number(char));
    }

    const ranges = [];
    if (catIdx > 0) {
      splitValues.forEach((m) => {
        const [destStart, sourceStart, range] = m
          .split(" ")
          .map((char) => Number(char));

        ranges.push({
          start: sourceStart,
          end: sourceStart + range,
          diff: destStart - sourceStart,
        });
      });
      output.maps.push({
        category: key.slice(0, -4),
        ranges: ranges,
      });
    }
  });
  return output;
}

function part1(alm) {
  const { seeds, maps } = alm;

  const locations = [];
  seeds.forEach((seed) => {
    let curId = seed;
    maps.forEach((map) => {
      const matchRange = map.ranges.find(
        (range) => curId >= range.start && curId <= range.end
      );
      if (matchRange) curId = curId + matchRange.diff;
    });
    locations.push(curId);
  });

  return locations.reduce((a, b) => {
    if (b < a) {
      return b;
    }
    return a;
  }, locations[0]);
}

function solve(input) {
  const alm = parseInput(input);

  console.log(part1(alm));
}

solve(input);

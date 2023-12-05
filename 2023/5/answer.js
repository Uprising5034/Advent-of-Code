// https://www.adventofcode.com/2023/day/5
import { puzzleData } from "./puzzleData.js";
import { exampleDataPart1, exampleDataPart2 } from "./puzzleData.js";

const dataArg = process.argv[2];

const allData = [puzzleData, exampleDataPart1, exampleDataPart2];
const input = allData[dataArg || 1].slice(0, -1).split("\n\n");

function parseInput(input) {
  const output = {
    maps: [],
  };
  input.map((cat, catIdx) => {
    const [key, values] = cat.split(catIdx === 0 ? ": " : ":\n");
    const splitValues = values.split("\n");

    if (catIdx === 0) {
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
          lowest: destStart,
          highest: range + destStart,
        });
      });
      output.maps.push({
        category: key.slice(0, -4),
        ranges: ranges.sort((a, b) => a.lowest - b.lowest),
      });
    }
  });
  return output;
}

function findNearestLoc(seeds, maps) {
  const locations = [];
  seeds.forEach((seed) => {
    let curId = seed;

    maps.forEach((map) => {
      const matchRange = map.ranges.find((range) => {
        const match = curId >= range.start && curId < range.end;
        return match;
      });
      if (matchRange) {
        curId = curId + matchRange.diff;
      }
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

function part1(alm) {
  const { seeds, maps } = alm;

  return findNearestLoc(seeds, maps);
}

function part2(alm) {
  let answer = 0;
  let foundAnswer;

  let go;
  go = true;
  console.group("Checking:");
  while (!foundAnswer && go) {
    if (answer % 5000000 === 0) {
      console.log(answer);
    }
    let curId = answer;
    for (const map of alm.maps.toReversed()) {
      let inRange;
      for (const range of map.ranges) {
        if (curId >= range.lowest && curId < range.highest) {
          curId = curId - range.diff;
          inRange = true;
          break;
        }
      }
      if (inRange) {
        continue;
      }
    }

    for (let i = 0; i < alm.seeds.length; i = i + 2) {
      const startSeed = alm.seeds[i];
      const endSeed = startSeed + alm.seeds[i + 1] - 1;

      if (curId >= startSeed && curId <= endSeed) {
        const test = findNearestLoc([curId], alm.maps);
        if (test === answer) {
          console.groupEnd();
          console.log("\nfound it!\n\n=================\n");
          foundAnswer = true;
          break;
        }
      }
    }
    if (!foundAnswer) {
      answer++;
    }
  }
  return answer;
}

function solve(input) {
  const startTime = Date.now();
  const alm = parseInput(input);
  const answer1 = part1(alm);

  const answer2 = part2(alm);
  const runTime = Date.now() - startTime;

  console.log("answer1", answer1, "answer2:", answer2, "\n");
  console.log("runTime", `${runTime / 1000} seconds`);
}

solve(input);

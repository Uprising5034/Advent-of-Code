// https://www.adventofcode.com/2023/day/3
import { puzzleData } from "./puzzleData.js";
import { exampleDataPart1, exampleDataPart2 } from "./puzzleData.js";

const allData = [puzzleData, exampleDataPart1, exampleDataPart2];

const argInput = process.argv[2];

const input = allData[argInput || 0].split("\n").slice(0, -1);

function textToObj(input) {
  return input.map((line) => {
    return line.split("").map((char) => {
      return { char };
    });
  });
}

function addCellData(arr) {
  let gearIndex = 0;
  arr.forEach((line, yIdx) => {
    let value;
    let digits = 0;
    line.forEach((cell, xIdx) => {
      const isNum = !isNaN(cell.char);

      if (isNum) {
        value = !digits ? cell.char : value + cell.char;
        cell.value = value;

        if (digits) {
          for (let i = digits; i > -1; i--) {
            const prevCell = line[xIdx - i];
            prevCell.value = value;
          }
        }

        digits++;
      } else {
        digits = 0;

        if (cell.char !== ".") {
          cell.symbol = true;
        }

        if (cell.char === "*") {
          cell.gearIndex = gearIndex++;
        }
      }
      cell.x = xIdx;
      cell.y = yIdx;
    });
  });
}

function findAdjacencies(arr) {
  arr.forEach((line, yIdx) => {
    line.forEach((cell, xIdx) => {
      if (cell.value) {
        const adjIdx = [-1, 0, 1];
        adjIdx.forEach((numY) => {
          adjIdx.forEach((numX) => {
            const adjX = xIdx + numX;
            const adjY = yIdx + numY;

            if (
              adjX > -1 &&
              adjX < line.length &&
              adjY > -1 &&
              adjY < arr.length
            ) {
              const adjCell = arr[adjY][adjX];
              if (adjCell.symbol) {
                cell.adj = true;
              }

              if (adjCell.gearIndex > -1) {
                cell.pair = adjCell.gearIndex;
              }
            }
          });
        });
      }
    });
  });
}

function filterAdjCells(arr) {
  let prevY = 0;
  let prevX = 0;
  const prevValues = [];
  const filterAdjCells = arr
    .flat()
    .filter((cell) => cell.adj)
    .filter((cell) => {
      const dupe =
        prevY === cell.y &&
        prevValues[prevValues.length - 1] === cell.value &&
        cell.x - prevX === 1;

      prevY = cell.y;
      prevX = cell.x;
      prevValues.push(cell.value);

      if (dupe) {
        return false;
      }

      return true;
    });
  return filterAdjCells;
}

function start(input) {
  const arr = textToObj(input);
  addCellData(arr);

  findAdjacencies(arr);

  const deDupeCells = filterAdjCells(arr);

  const part1Answer = deDupeCells.reduce((a, b) => a + Number(b.value), 0);

  const gearFilter = arr.flat().filter((cell) => cell.pair > -1);

  const deDupeGearCells = filterAdjCells(gearFilter).sort(
    (a, b) => a.pair - b.pair
  );

  const deOrphanGearCells = deDupeGearCells.filter((cell) => {
    return deDupeGearCells.find((dell) => {
      return (
        cell.pair === dell.pair && (cell.x !== dell.x || cell.y !== dell.y)
      );
    });
  });

  const gearRatios = []
  for (let i = 0; i < deOrphanGearCells.length; i = i + 2) {
    const val1 = Number(deOrphanGearCells[i].value);
    const val2 = Number(deOrphanGearCells[i + 1].value);
    
    gearRatios.push(val1 * val2)
  }

  const part2Answer = gearRatios.reduce((a, b) => a + b, 0)

  console.log("part1", part1Answer)
  console.log("part2", part2Answer)
}

start(input);

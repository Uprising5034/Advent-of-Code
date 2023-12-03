// https://www.adventofcode.com/2023/day/3
import { puzzleData } from "./puzzleData.js";
import { exampleDataPart1, exampleDataPart2 } from "./puzzleData.js";

const allData = [puzzleData, exampleDataPart1, exampleDataPart2];

const argInput = process.argv[2];

const input = allData[argInput || 0].split("\n").slice(0, -1);

function textToArr(input) {
  return input.map((line) => {
    return line.split("").map((char) => {
      return { char };
    });
  });
}

function addCellData(arr) {
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
      const dupe = prevY === cell.y &&
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
  const arr = textToArr(input);
  addCellData(arr);

  findAdjacencies(arr);

  const removeDupeCells = filterAdjCells(arr);

  const part1Answer = removeDupeCells.reduce((a, b) => a + Number(b.value), 0);

  console.log(part1Answer)
}

start(input);

// https://www.adventofcode.com/2023/day/2
import { puzzleData } from "./puzzleData.js";
import { exampleDataPart1, exampleDataPart2 } from "./puzzleData.js";

const allData = [puzzleData, exampleDataPart1, exampleDataPart2];

const inputData = allData[0];

const splitData = inputData.split("\n");
const dataArray = splitData.slice(0, splitData.length - 1);

const BAG = {
  red: 12,
  green: 13,
  blue: 14,
};

function parseText(dataArray) {
  return dataArray.map((game) => {
    const gameArr = game.split(": ");
    const gameRounds = gameArr[1].split("; ").map((round) => parseRound(round));

    return {
      game: Number(gameArr[0].substring(5)),
      rounds: gameRounds,
    };
  });
}

function parseRound(round) {
  const roundArr = round.split(", ");

  const roundObj = {};
  roundArr.forEach((cubeSet) => {
    const cubeObj = parseSet(cubeSet);
    Object.assign(roundObj, cubeObj);
  });

  return roundObj;
}

function parseSet(cubeSet) {
  const setArr = cubeSet.split(" ");
  return {
    [setArr[1]]: setArr[0],
  };
}

function filterGameData(gameData) {
  return gameData.filter((game) => {
    return game.rounds.every((round) => {
      let valid = true;
      for (const color in round) {
        const cubeNum = round[color];

        if (BAG[color] < cubeNum) {
          valid = false;
          break;
        }
      }
      return valid;
    });
  });
}

function init() {
  const gameData = parseText(dataArray);

  const filterData = filterGameData(gameData);

  return filterData.reduce((a, b) => a + b.game, 0);
}

console.log("init()", init());

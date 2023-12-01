// https://www.adventofcode.com/2023/day/1
import { exampleData } from "./puzzleData.js";
import { puzzleData } from "./puzzleData.js";

const exampleData2 = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

let useExampleData;
// useExampleData = true;

const inputData = useExampleData && exampleData ? exampleData : puzzleData;
// const inputData = exampleData2;

const inputArray = inputData.split("\n");
// const inputArray = [inputData.split("\n")[20]];

const spelledToNum = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

function checkFullMatch(key, testSlice) {
  console.log("key", key, "testSlice", testSlice);

  for (let i = 0; i < testSlice.length; i++) {
    if (testSlice[i] !== key[i]) {
      return false;
    }
  }
  return true;
}

function makeNumArray(inputArray) {
  const fullArray = inputArray.map((string, strIdx) => {
    let strFirst = string;
    let changedFirstString;
    for (let index = 0; index < strFirst.length; index++) {
      const char = strFirst[index];

      if (!isNaN(Number(char))) {
        break;
      }

      for (const key in spelledToNum) {
        if (key[0] === char) {
          const testSlice = strFirst.slice(index, index + key.length);

          if (checkFullMatch(key, testSlice)) {
            const num = spelledToNum[key];

            const stringArr = strFirst.split("");
            stringArr.splice(index, key.length, num);

            strFirst = stringArr.join("");

            changedFirstString = true;
            break;
          }
        }
      }
      if (changedFirstString) {
        break;
      }
    }

    console.log('string', string)

    let strLast = string;
    let changedLastString;
    console.log("strLast", strLast);
    for (let index = strLast.length - 1; index > -1; index--) {
      const char = strLast[index];
      console.log("char, index", char, index);

      if (!isNaN(Number(char))) {
        break;
      }

      for (const key in spelledToNum) {
        if (key[key.length - 1] === char) {
          const startIndexValid = (index - key.length + 1) > -1

          const testSlice = strLast.slice(index - key.length + 1, index + 1);

          if (checkFullMatch(key, testSlice) && startIndexValid) {
            const num = spelledToNum[key];

            const stringArr = strLast.split("");
            stringArr.splice(index - key.length + 1, key.length, num);

            strLast = stringArr.join("");
            changedLastString = true;
            break;
          }
        }
      }
      if (changedLastString) {
        break;
      }
    }

    const bothStr = strFirst + strLast;

    const strArray = bothStr.split("");
    const numArray = strArray.filter((char) => !isNaN(Number(char)));

    const num1 = numArray[0];
    const num2 = numArray[numArray.length - 1];

    if (changedLastString) {
      // console.log(strIdx, string, num1, num2, `\n`)
    }

    return Number(num1 + num2);
  });

  const filterNaN = fullArray.filter((num) => !isNaN(num));
  return filterNaN;
}

const answer = makeNumArray(inputArray).reduce((a, b) => a + b, 0);

console.log("answer", answer);

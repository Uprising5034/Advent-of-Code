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

// const inputData = useExampleData && exampleData ? exampleData : puzzleData;
const inputData = exampleData2;

const inputArray = inputData.split("\n");
// const inputArray = [inputData.split("\n")[2]];

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

function makeNumArray(inputArray) {
  const fullArray = inputArray.map((string, strIdx) => {
    let stringMut = false;
    while (!stringMut) {
      for (let index = 0; index < string.length; index++) {
        const char = string[index];
        for (const key in spelledToNum) {
          if (key[0] === char) {
            const num = spelledToNum[key];
            string = string.replace(key, num);
            stringMut = true;
            // break;
          }
        }
      }
    }

    stringMut = false;
    while (!stringMut) {
      for (let index = string.length - 1; index > -1; index--) {
        const char = string[index];
        for (const key in spelledToNum) {
          if (key[key.length - 1] === char) {
            console.log('key, char', key, char)
            const num = spelledToNum[key];
            const newString = string.replace(key, num);
            console.log('string, newString', string, newString)
            string = newString
            stringMut = true;
            break;
          }
        }
      }
      stringMut = true
    }

    // if (zeroString) {
    //   for (const key in spelledToNum) {
    //     if (key[0] === string[0]) {
    //       const num = spelledToNum[key];
    //       string = string.replace(key, num);
    //     }
    //   }
    // }

    // if (lastString) {
    //   for (const key in spelledToNum) {
    //     if (key[key.length - 1] === string[string.length - 1]) {
    //       const num = spelledToNum[key];
    //       string = string.replace(key, num);
    //     }
    //   }
    // }

    console.log(' string',  string)

    const strArray = string.split("");
    const numArray = strArray.filter((char) => !isNaN(Number(char)));

    const num1 = numArray[0];
    const num2 = numArray[numArray.length - 1];

    return Number(num1 + num2);
  });

  const filterNaN = fullArray.filter((num) => !isNaN(num));
  return filterNaN;
}

const answer = makeNumArray(inputArray).reduce((a, b) => a + b, 0);

console.log("answer", answer);

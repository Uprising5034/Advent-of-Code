// https://www.adventofcode.com/2023/day/1
import { exampleData } from "./puzzleData.js";
import { puzzleData } from "./puzzleData.js";

let useExampleData;
// useExampleData = true;

const inputData = useExampleData && exampleData ? exampleData : puzzleData;

const inputArray = inputData.split("\n");

function makeNumArray(inputArray) {
  const fullArray = inputArray.map((string) => {
    const strArray = string.split("");
    const numArray = strArray
      .filter((char) => !isNaN(Number(char)))

    const num1 = numArray[0];
    const num2 = numArray[numArray.length - 1];

    return Number(num1 + num2);
  });

  const filterNaN = fullArray.filter((num) => !isNaN(num));
  return filterNaN
}

const answer = makeNumArray(inputArray).reduce((a, b) => a + b, 0);

console.log('answer', answer)
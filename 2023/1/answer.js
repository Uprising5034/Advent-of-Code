// https://www.adventofcode.com/2023/day/1
import { exampleData } from "./puzzleData.js";
import { puzzleData } from "./puzzleData.js";

let useExampleData;
useExampleData = true;

const inputData = useExampleData && exampleData ? exampleData : puzzleData;

console.log(inputData);

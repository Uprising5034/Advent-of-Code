import { exampleData } from "./puzzleData.js";
import { puzzleData } from "./puzzleData.js";

let useExampleData;
useExampleData = true;

const inputData = useExampleData && exampleData ? exampleData : puzzleData;

console.log(inputData);

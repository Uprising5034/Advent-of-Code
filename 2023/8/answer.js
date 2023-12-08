// https://www.adventofcode.com/2023/day/8
import { puzzleData } from "./puzzleData.js";
import { exampleDataPart1, exampleDataPart2 } from "./puzzleData.js";

const dataArg = process.argv[2];

const allData = [puzzleData, exampleDataPart1, exampleDataPart2];
const input = allData[dataArg || 0].split("\n").slice(0, -1);

function parse(input) {
  const steps = input[0];

  const nodesObj = {};
  const nodes = input.slice(2).forEach((node) => {
    const [start, directions] = node.split(" = ");
    const [l, r] = directions
      .split(", ")
      .map((char) => char.replace("(", "").replace(")", ""));
    nodesObj[start] = {
      L: l,
      R: r,
    };
  });

  return {
    steps,
    nodes: nodesObj,
  };
}

function calc1(directions) {
  const { steps, nodes } = directions;
  let stepsTaken = 0;
  let nextStepIdx = 0;

  let curNode = "AAA";

  while (curNode !== "ZZZ") {
    curNode = nodes[curNode][steps[nextStepIdx]];
    stepsTaken++;
    nextStepIdx = (nextStepIdx + 1) % steps.length;
  }

  return stepsTaken;
}

function calc2(directions) {
  const { steps, nodes } = directions;

  const initialNodes = Object.keys(nodes).filter((node) => node[2] === "A");

  const loops = [];
  initialNodes.forEach((iNode) => {
    let nextStepIdx = 0;
    let stepsTaken = 0;

    let curNode = iNode;
    let endIdx;

    while (true) {
      if (curNode[2] === "Z") {
        endIdx = stepsTaken;
        break
      }

      curNode = nodes[curNode][steps[nextStepIdx]];
      nextStepIdx = (nextStepIdx + 1) % steps.length;
      stepsTaken++;
    }

    const primeFactor = endIdx / steps.length;

    loops.push({
      endIdx,
      primeFactor,
    });
  });
  return loops.reduce((a, b) => a * b.primeFactor, 1) * steps.length;
}

function solve(input) {
  const directions = parse(input);

  const answer1 = calc1(directions);
  const answer2 = calc2(directions);

  console.log("answer1", answer1);
  console.log("answer2", answer2);
}

solve(input);

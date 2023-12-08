// https://www.adventofcode.com/2023/day/7
import { puzzleData } from "./puzzleData.js";
import { exampleDataPart1, exampleDataPart2 } from "./puzzleData.js";

const dataArg = process.argv[2];

const allData = [puzzleData, exampleDataPart1, exampleDataPart2];
const input = allData[dataArg || 0].split("\n").slice(0, -1);

const cardValuesPart1 = {
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

function parse(input) {
  return input.map((line) => {
    const [hand, bid] = line.split(" ");

    const count = {};
    for (let i = 0; i < hand.length; i++) {
      const char = hand[i];
      if (count[char]) {
        count[char]++;
      } else {
        count[char] = 1;
      }
    }

    const strength = handStrength(count);

    return {
      hand: hand,
      bid: Number(bid),
      count: count,
      strength: strength,
    };
  });
}

function handStrength(count) {
  const cards = Object.keys(count).sort((a, b) => {
    return count[b] - count[a];
  });

  const set1 = count[cards[0]];
  const set2 = count[cards[1]];

  if (set1 === 5) return 6; // 5 of a kind
  if (set1 === 4) return 5; // 4 of a kind
  if (set1 === 3) {
    if (set2 === 2) return 4; // full house
    return 3; // 3 of a kind
  }
  if (set1 === 2) {
    if (set2 === 2) return 2; // 2 pair
    return 1; // 1 pair
  }
  return 0; // high card
}

function part1(hands) {
  const sorted = hands.sort((a, b) => {
    if (a.strength === b.strength) {
      for (let i = 0; i < a.hand.length; i++) {
        const cardA = cardValuesPart1[a.hand[i]] || Number(a.hand[i]);
        const cardB = cardValuesPart1[b.hand[i]] || Number(b.hand[i]);

        if (cardA === cardB) {
          continue;
        }

        return cardA - cardB;
      }
    }

    return a.strength - b.strength;
  });

  sorted.forEach((hand, idx) => {
    hand.rank = idx + 1;
    hand.winnings = hand.rank * hand.bid
  });

  return sorted.reduce((a, b) => a + b.winnings, 0)
}

function solve(input) {
  const hands = parse(input);

  const answer1 = part1(hands);

  console.log("answer1", answer1);
}

solve(input);

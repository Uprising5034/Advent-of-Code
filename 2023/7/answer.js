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

const cardValuesPart2 = {
  T: 10,
  J: 1,
  Q: 12,
  K: 13,
  A: 14,
};

function parse(input, part2) {
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

    const strength = handStrength(count, part2);

    return {
      hand: hand,
      bid: Number(bid),
      count: count,
      strength: strength,
    };
  });
}

function handStrength(count, part2) {
  const cards = Object.keys(count)
    .sort((a, b) => {
      return count[b] - count[a];
    })
    .filter((card) => {
      if (part2) {
        return card !== "J";
      }
      return true;
    });

  let jokerCount = 0;
  if (part2) {
    jokerCount = count.J || 0;
  }

  const set1 = count[cards[0]];
  const set2 = count[cards[1]];

  if (set1 + jokerCount === 5 || jokerCount === 5) return 6; // 5 of a kind
  if (set1 + jokerCount === 4) return 5; // 4 of a kind
  if (set1 + jokerCount === 3) {
    if (set2 === 2) return 4; // full house
    return 3; // 3 of a kind
  }
  if (set1 + jokerCount === 2) {
    if (set2 === 2) return 2; // 2 pair
    return 1; // 1 pair
  }
  return 0; // high card
}

function calc(hands, cardValues) {
  const sorted = hands.sort((a, b) => {
    if (a.strength === b.strength) {
      for (let i = 0; i < a.hand.length; i++) {
        const cardA = cardValues[a.hand[i]] || Number(a.hand[i]);
        const cardB = cardValues[b.hand[i]] || Number(b.hand[i]);

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
    hand.winnings = hand.rank * hand.bid;
  });

  return sorted.reduce((a, b) => a + b.winnings, 0);
}

function solve(input) {
  const handsPart1 = parse(input);

  const answer1 = calc(handsPart1, cardValuesPart1);

  const handsPart2 = parse(input, true);

  const answer2 = calc(handsPart2, cardValuesPart2);

  console.log('answer1', answer1)
  console.log("answer2", answer2);
}

solve(input);

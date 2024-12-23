/**
 * https://adventofcode.com/2024/day/22
 *
 * General solution:
 * For each monkey, as we're looping through and generating its secrets,
 * at the same time, calculcate the price and look backwards at the last 4 price changes.
 * If this is the first time that specific sequence has happened, track how much we'd earn
 * if we sold at that point.
 * Also keep track of the cumulative earnings from all monkeys. Top value wins.
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `1
2
3
2024`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input.split('\n').map(Number);
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const secrets = this.parseInput(input);
    
    let best = 0;
    const sequences = new Map<string, number>();
    for (const secret of secrets) {
      best = getPrices(secret, 2000, sequences, best);
    }

    return {
      performance: performance.now() - performanceStart, 
      result: best
    }
  }
}

function getPrices(secret: number, numIterations: number, sequences: Map<string, number>, best: number) {
  const prices = [getOnesDigit(secret)];
  const changes = [0];
  const thisSequence = new Map<string, number>();

  let current = secret;
  for (let i=0; i < numIterations; i++) {
    const nextSecret = getNextSecret(current);
    const price = getOnesDigit(nextSecret);
    const change = price - prices[prices.length-1];
    prices.push(price);
    changes.push(change);
    current = nextSecret;

    if (i >= 3) {
      const sequence = `${changes[changes.length-4]},${changes[changes.length-3]},${changes[changes.length-2]},${changes[changes.length-1]}`;
      if (!thisSequence.has(sequence)) {
        const value = (sequences.get(sequence) ?? 0) + price;
        sequences.set(sequence, value);
        thisSequence.set(sequence, value);
        best = Math.max(best, value);
      }
    }
  }

  return best;
}

function getOnesDigit(num: number) {
  return num % 10;
}

function getNextSecret(secret: number) {
  let current = secret;
  const prune = 16777216;

  current = Number(BigInt(current * 64) ^ BigInt(current));
  current %= prune;
  current = Number(BigInt(Math.floor(current / 32)) ^ BigInt(current));
  current %= prune;
  current = Number(BigInt(current * 2048) ^ BigInt(current));
  current %= prune;

  return current;
}

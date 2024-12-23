/**
 * https://adventofcode.com/2024/day/22
 *
 * General solution:
 * Nothing special. Follow instructions.
 * The only gotcha is needing to convert nums to BigInt when working with XOR
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `1
10
100
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
    
    let result = 0;
    for (const secret of secrets) {
      const nextSecret = getNextSecrets(secret, 2000);
      result += nextSecret[nextSecret.length-1];
    }

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

function getNextSecrets(secret: number, numIterations: number) {
  const nextSecrets = [];

  let current = secret;
  for (let i=0; i < numIterations; i++) {
    const nextSecret = getNextSecret(current);
    nextSecrets.push(nextSecret);
    current = nextSecret;
  }

  return nextSecrets;
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

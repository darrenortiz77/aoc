/**
 * https://adventofcode.com/2024/day/19
 *
 * General solution:
 * Basic DFS + memoiziation (i.e.: DP)
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    
    const inputParts = input.split('\n\n');
    const towels = inputParts[0].split(', ');
    const designs = inputParts[1].split('\n');

    return {towels, designs};
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const {towels, designs} = this.parseInput(input);

    const memo = new Map<string, number>();
    
    const numDesignsPossible = designs.reduce((sum, design) => sum + getNumPossibleDesigns(design, towels, memo), 0);

    return {
      performance: performance.now() - performanceStart, 
      result: numDesignsPossible
    }
  }
}

function getNumPossibleDesigns(design: string, towels: string[], memo: Map<string, number>) {
  if (memo.has(design)) {
    return memo.get(design)!;
  }

  let numPossible = 0;

  const dfs = (str: string) => {
    const remainder = design.slice(str.length);
    
    if (str === design) {
      numPossible++;
      return;
    }

    for (const towel of towels) {
      if (remainder.slice(0, towel.length) === towel) {
        numPossible += getNumPossibleDesigns(remainder.slice(towel.length), towels, memo);
      }
    }
  };

  dfs('');

  memo.set(design, numPossible);

  return numPossible;
}

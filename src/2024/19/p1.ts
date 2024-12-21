/**
 * https://adventofcode.com/2024/day/19
 *
 * General solution:
 * Basic DFS
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
    
    const numDesignsPossible = designs.reduce((sum, design) => isDesignPossible(design, towels) ? sum + 1 : sum, 0);

    return {
      performance: performance.now() - performanceStart, 
      result: numDesignsPossible
    }
  }
}

function isDesignPossible(design: string, towels: string[]) {
  let possible = false;

  const dfs = (str: string) => {
    if (str === design || possible) {
      possible = true;
      return;
    }

    const remaining = design.slice(str.length);

    for (const towel of towels) {
      if (remaining.slice(0, towel.length) === towel) {
        dfs(`${str}${towel}`);
      }
    }
  };

  dfs('');

  return possible;
}

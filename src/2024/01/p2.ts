/**
 * https://adventofcode.com/2024/day/1
 *
 * General solution:
 * 1. Split input into individual lines
 * 2. Loop over lines and extract first and second nums via regex.
 * 3. Push left nums into a simple array. Push right nums into a map where we keep track of the frequency of each num.
 * 4. Loop over left nums and sum the frequency of that number times itself.
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `3   4
4   3
2   5
1   3
3   9
3   3`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input.split('\n');
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const lines = this.parseInput(input);

    const leftList: number[] = [];
    const frequencyMap = new Map<number, number>();

    lines.forEach((line) => {
      const nums = line.match(/\b\d+?\b/g);
      leftList.push(+nums![0]);
      frequencyMap.set(+nums![1], frequencyMap.has(+nums![1]) ? frequencyMap.get(+nums![1])! + 1 : 1);
    });

    const score = leftList.reduce((accumulator, currentVal) => {
      const freq = frequencyMap.get(currentVal) ?? 0;
      return accumulator + currentVal * freq;
    }, 0);

    return {
      performance: performance.now() - performanceStart, 
      result: score
    }
  }
}

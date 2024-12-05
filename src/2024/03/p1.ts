/**
 * https://adventofcode.com/2024/day/3
 *
 * General solution: RegEx baby!
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input;
  }

  public solve(input?: string) {
    const performanceStart = performance.now();

    input = this.parseInput(input);
    
    const matches = input.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g);
    let sum = 0;
    for (const match of matches) {
      sum += +match[1]! * +match[2]!;
    }

    return {
      performance: performance.now() - performanceStart, 
      result: sum
    }
  }
}

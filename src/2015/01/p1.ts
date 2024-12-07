/**
 * https://adventofcode.com/2015/day/1
 *
 * General solution:
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `)())())`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input.split('').map(p => p === '(' ? 1 : -1);
  }

  public solve(input?: string) {
    const performanceStart = performance.now();

    const parsed = this.parseInput(input);
    let result = parsed.reduce((sum, current) => (sum += current), 0);

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

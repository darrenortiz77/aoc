/**
 * https://adventofcode.com/2015/day/12
 *
 * General solution:
 * Regex
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `{"a":23,"b":-4}`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input;
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const json = this.parseInput(input);
    const result = json.match(/-?\d+/g)!.map(Number).reduce((sum, val) => sum += val, 0);

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

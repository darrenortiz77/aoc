/**
 * https://adventofcode.com/2015/day/5
 *
 * General solution:
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `jchzalrnumimnmhp`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input.split('\n');
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const strings = this.parseInput(input);
    let result = 0;

    const twoPairsSame = /(.{2}).*?\1/;
    const pairSplit = /(.).\1/;

    for (const string of strings) {
      if (string.match(twoPairsSame) && string.match(pairSplit)) {
        result++;
      }
    }

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

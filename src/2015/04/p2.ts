/**
 * https://adventofcode.com/2015/day/04
 *
 * General solution:
 * - Brute force
 */

import AOCBase from "../../AOCBase";
import md5 from "md5";

export default class Solution implements AOCBase {
  readonly sampleInput = `iwrupvqb`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input;
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();
    
    // logic here
    let result = 0;
    let hashed = '';

    while (hashed.substring(0, 6) !== '000000') {
      result++;
      hashed = md5(`${input}${result}`);
    }

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

/**
 * https://adventofcode.com/2015/day/8
 *
 * General solution:
 * Regex
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `""
"abc"
"aaa\"aaa"
"\x27"`;

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
    for (const str of strings) {
      let escaped = str.replaceAll("\\\\", "1").replaceAll('\\"', "2").replaceAll(/\\x\w{2}/ig, "3");
      result += str.length - escaped.length + 2;
    }

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

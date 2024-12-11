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
      const escaped = str.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
      result += (escaped.length + 2)  - str.length;
    }

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

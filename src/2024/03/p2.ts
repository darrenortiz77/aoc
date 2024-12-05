/**
 * https://adventofcode.com/2024/day/3
 *
 * General solution: RegEx baby!
 * 1. There's newlines in the full output that aren't there in the sample output. Strip those newlines, and concat it all back into one string.
 * 2. Do an outer regex for: (beginning of string OR "do()"), any character, (end of string or "don't()")
 * 3. Loop over those matches and do the same regex as we did in part one. i.e.: Look for `mul(<nnn>,<nnn>)` and capture the numbers for easy retrieval.
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input.split('\n').join('');
  }

  public solve(input?: string) {
    const performanceStart = performance.now();
    
    input = this.parseInput(input);
    
    const reOuter = /(?:^|(?:do\(\))).*?(?:(?:don't\(\))|$)/g;
    const reInner = /mul\((\d{1,3}),(\d{1,3})\)/g;
    const outerMatches = input.matchAll(reOuter);
    let sum = 0;
    for (const outerMatch of outerMatches) {
      const innerMatches = outerMatch[0].matchAll(reInner);
      for (const innerMatch of innerMatches) {
        sum += +innerMatch[1]! * +innerMatch[2]!;
      }
    }

    return {
      performance: performance.now() - performanceStart, 
      result: sum
    }
  }
}

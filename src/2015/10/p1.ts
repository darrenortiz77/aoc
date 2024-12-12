/**
 * https://adventofcode.com/2015/day/10
 *
 * General solution:
 * Basic loop. Create new array based off result of previous loop.
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `1`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input.split('').map(Number);
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    let digits = this.parseInput(input);

    const lookAndSay = (digits: number[]) => {
      const newDigits = [];
      let prevDigit = digits[0];
      let count = 1;

      for (let i=1; i < digits.length; i++) {
        if (digits[i] === prevDigit) {
          count++;
        } else {
          newDigits.push(count);
          newDigits.push(prevDigit);
          prevDigit = digits[i];
          count = 1;
        }
      }
      newDigits.push(count);
      newDigits.push(prevDigit);

      return newDigits;
    };

    for (let i=0; i < 40; i++) {
      digits = lookAndSay(digits);
    }

    return {
      performance: performance.now() - performanceStart, 
      result: digits.length
    }
  }
}

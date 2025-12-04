/**
 * https://adventofcode.com/2025/day/03
 *
 * General solution:
 * - loop through each battery in each bank from left to right
 * - keep track of the current largest tens digit
 * - only bother looping over the following batteries if the current battery is >= the current largest tens digit
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `987654321111111
811111111111119
234234234234278
818181911112111`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input.split('\n');
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const parsed = this.parseInput(input);
    let result = 0;

    // logic here
    parsed.forEach(bank => {
      let largestTens = 0;
      let largestValue = 0;

      for (let i=0; i < bank.length-1; i++) {
        let battery = +bank.charAt(i);

        if (battery >= largestTens) {
          largestTens = battery;

          for (let n=i+1; n < bank.length; n++) {
            battery = +bank.charAt(n);
            
            largestValue = Math.max(largestValue, +`${largestTens}${battery}`);
          }
        }
      }

      result += largestValue;
    });

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

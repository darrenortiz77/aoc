/**
 * https://adventofcode.com/2025/day/06
 *
 * General solution:
 * - read the grid of data from top-right to bottom-left
 * - build the digits by appending strings from top-down
 * - if the last row's value contains either a * or + we know we've built up the list of digits
 * - do the math, and decrement the column counter so we skip the empty column between problems
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   + `;

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
    let digits: string[] = [];

    for (let col = parsed[0].length-1; col >= 0; col--) {
      let thisDigit = '';
      for (let row = 0; row < parsed.length-1; row++) {
        let char = parsed[row].charAt(col);
        if (char === ' ') char = '';
        thisDigit = `${thisDigit}${char}`;
      }
      digits.push(thisDigit);

      const operator = parsed[parsed.length-1].charAt(col);
      if (operator === '*' || operator === '+') {
        let subtotal = operator === '*' ? 1 : 0;
        subtotal = digits.reduce((prev, current) => {
          if (operator === '*') {
            return prev * +current;
          } else {
            return prev + +current;
          }
        }, subtotal);

        result += subtotal;
        digits = [];
        col--;
      }
    }

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

/**
 * https://adventofcode.com/2025/day/06
 *
 * General solution:
 * - use regex to parse data into following structure:
 * digits = [
 *   [123, 328, 51, 64],
 *   [45, 64, 387, 23],
 *   [6, 98, 215, 314]
 * ];
 * operators = [*, +, *, +];
 * - just basic looping
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
    const digits: string[][] = [];
    let operators: string[] = [];

    parsed.forEach((line, i)  => {
      const values: string[] = line.match(/\S+/g)!;

      if (i < parsed.length -1) {
        digits.push(values);
      } else {
        operators = values;
      }
    });

    operators.forEach((operator, i) => {
      let subtotal = operator === '*' ? 1 : 0;

      digits.forEach(digitList => {
        const digit = +digitList[i];

        if (operator === '*') {
          subtotal *= digit;
        } else {
          subtotal += digit;
        }
      });

      result += subtotal;
    });

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

/**
 * https://adventofcode.com/2025/day/02
 *
 * General solution:
 * - for each range of numbers, start at min and count up to max
 * - start creating substrings of the current number incrementing in length from 1 to half the length of the number
 * - create a repeating pattern of that substring that's the same length as the number we're testing against
 * - see if the test pattern matches the number we're looking at
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,
1698522-1698528,446443-446449,38593856-38593862,565653-565659,
824824821-824824827,2121212118-2121212124`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input.split(',').map(range => {
      return range.split('-').map(num => +num);
    });
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const parsed = this.parseInput(input);
    
    // logic here
    let result = 0;
    parsed.forEach(([min, max]) => {
      for (let curr=min; curr <= max; curr++) {
        const currStr = `${curr}`;
        const halfLength = currStr.length/2;
        const found = new Set<number>(); // only save unique ids. It's possible to test duplicate scenarios.

        for (let i=1; i <= halfLength; i++) {
          // only bother testing if our substring can be repeated perfectly
          if (currStr.length % i === 0) {
            const subPattern = currStr.substring(0, i);
            const numRepeats = currStr.length / i;
            const pattern = new Array(numRepeats).fill(subPattern).join('');

            if (+pattern === curr) {
              found.add(+pattern);
            }
          }
        }

        result = [...found].reduce((prev, curr) => prev + curr, result);
      }
    });

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

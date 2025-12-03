/**
 * https://adventofcode.com/2025/day/02
 *
 * General solution:
 * - for each range of numbers, start at min and count up to max
 * - for each number tested, split in half and see if front half is equal to back half
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

        if (currStr.substring(0, halfLength) === currStr.substring(halfLength)) {
          result += curr;
        }
      }
    });

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

/**
 * https://adventofcode.com/2025/day/05
 *
 * General solution:
 * - flatten the ranges so there's no overlaps
 * - loop over the ranges and count the diff btwn min, max (+1 since max is inclusive)
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input.split('\n\n').map(section => section.split('\n'));
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const [rangesStr] = this.parseInput(input);
    let result = 0;

    // flatten the ranges to remove overlaps
    const ranges = rangesStr.map(s => s.split('-').map(s => +s)).sort((a, b) => Number(a[0]) - Number(b[0])); // converts '10-16' into [10, 16] and sorts the array in order of min number
    const combinedRanges = new Map<number, number>(); // min: max

    ranges.forEach(([min, max]) => {
      const combinedEntries = [...combinedRanges.entries()];

      let overlapFound = false;
      for (let i=0; i < combinedEntries.length; i++) {
        const [compareMin, compareMax] = combinedEntries[i];

        if (min <= compareMax) {
          combinedRanges.set(compareMin, Math.max(max, compareMax));
          overlapFound = true;
          break;
        }
      }

      if (!overlapFound) {
        combinedRanges.set(min, max);
      }
    });

    // loop over ranges
    combinedRanges.forEach((max, min) => {
      result += (max - min + 1);
    });

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

/**
 * https://adventofcode.com/2025/day/09
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input.split('\n').map(line => line.split(',').map(d => +d));
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const parsed = this.parseInput(input);
    let result = 0;

    // logic here
    for (let i=0; i < parsed.length-1; i++) {
      const corner0 = parsed[i];

      for (let n=i+1; n < parsed.length; n++) {
        const corner1 = parsed[n];
        const area = (Math.abs(corner0[0] - corner1[0]) + 1) * (Math.abs(corner0[1] - corner1[1]) + 1);

        if (area > result) {
          result = area;
        }
      }
    }

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

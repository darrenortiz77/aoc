/**
 * https://adventofcode.com/2015/day/2
 *
 * General solution:
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `2x3x4`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input.split('\n').map(line => line.split('x').map(n => +n));
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const presents = this.parseInput(input) as [number, number, number][];
    let result = 0;

    presents.forEach(present => {
      const perimeters = new Array(3);
      perimeters[0] = present[0] + present[1];
      perimeters[1] = present[0] + present[2];
      perimeters[2] = present[1] + present[2];

      const smallestPerimeter = Math.min(...perimeters) * 2;
      result += smallestPerimeter + present.reduce((sum, val) => sum *= val, 1);
    });

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

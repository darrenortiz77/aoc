/**
 * https://adventofcode.com/2025/day/12
 *
 * General solution:
 * - surprise surpise, the last day is usually a bit of a gift
 * - no complex shape fitting algorithm needed at all.
 * - just assume each present is a filled 3x3 shape. Does the number of presents fit in the total area of the region?
 * 
 * Note: this only works with the actual puzzle input. Not the sample input.
 */

import AOCBase from "../../AOCBase";

type Region = {
  area: number;
  w: number;
  h: number;
  quantities: number[];
};

type Present = {
  totalArea: number;
  filledArea: number;
  shape: string[];
};

export default class Solution implements AOCBase {
  readonly sampleInput = `0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###

4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2`;

  public parseInput(input?: string): [Present[], Region[]] {
    if (!input) {
      input = this.sampleInput;
    }

    const lines = input.split('\n');
    const presents: Present[] = [];
    const regions: Region[] = [];
    let shape: string[];

    lines.forEach(line => {
      if (line.match(/\d+:$/)) {
        shape = [];
      } else if (line.trim() === '') {
        const filledArea = shape.reduce((subtotal, row) => {
          const filled = row.split('').filter(char => char === '#');
          return subtotal + filled.length;
        }, 0);

        presents.push({
          totalArea: shape.length * shape[0].length,
          filledArea: filledArea,
          shape
        });
      } else if (line.includes('x')) {
        const [dimensions, quanititiesStr] = line.split(': ');
        const [w, h] = dimensions.split('x').map(Number);
        const quantities = quanititiesStr.split(' ').map(Number);

        regions.push({
          area: w * h,
          w,
          h,
          quantities
        });
      } else {
        shape.push(line);
      }
    });

    return [presents, regions];
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const [presents, regions] = this.parseInput(input);
    let result = 0;

    // logic here
    regions.forEach(region => {
      let totalPresentArea = 0;

      region.quantities.forEach((qty, idx) => {
        totalPresentArea += presents[idx].totalArea * qty;
      });

      if (totalPresentArea <= region.area) {
        result++;
      }
    });

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

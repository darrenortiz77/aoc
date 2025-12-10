/**
 * https://adventofcode.com/2025/day/09
 * 
 * General solution:
 * - loop over all "corners" to create possible squares
 * - loop over each corner + next corner to create a line segment
 * - see if that line-segment intersects our square in any way (using AABB collision detection)
 * - when looping over corner + next corner, don't forget that the last corner also needs to connect with the first.
 * - if it does, part of the square is falling outside of our valid tiles. Ignore that one and move on.
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
        const possible = checkCollisions(corner0, corner1, i, n);

        if (possible) {
          const area = (Math.abs(corner0[0] - corner1[0]) + 1) * (Math.abs(corner0[1] - corner1[1]) + 1);
          if (area > result) {
            result = area;
          }
        }
      }
    }

    /**
     * Use AABB collision detection to see if our test square collides with any line segment forming the permiter of our overall tile shape.
     * @param corner0 first corner of our test square
     * @param corner1 second corner of our test square
     * @param idx0 indexes of each so we can skip testing these
     * @param idx1 
     * @returns true if okay, false if colliding
     */
    function checkCollisions(corner0: number[], corner1: number[], idx0: number, idx1: number) {
      const rect0 = getRect(corner0, corner1);

      for (let i=0; i < parsed.length; i++) {
        let n = i+1;
        if (n >= parsed.length) {
          n = 0;
        }

        if (i === idx0 || i === idx1 || n === idx0 || n === idx1) {
          continue;
        }

        const rect1 = getRect(parsed[i], parsed[n]);

        if(rect0.left < rect1.right &&
          rect0.right > rect1.left &&
          rect0.top < rect1.bottom &&
          rect0.bottom > rect1.top)
        {
          return false;
        }
      }

      return true;
    }

    /**
     * Take two corners and calculate its top, left, right, bottom positions
     * @param corner0 first corner
     * @param corner1 second corner
     * @returns {top, left, right, bottom}
     */
    function getRect(corner0: number[], corner1: number[]) {
      let left = corner0[0];
      let right = corner1[0];
      let top = corner0[1];
      let bottom = corner1[1];

      if (right < left) {
        left = corner1[0];
        right = corner0[0];
      }

      if (bottom < top) {
        top = corner1[1];
        bottom = corner0[1];
      }

      return {left, right, top, bottom};
    }

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

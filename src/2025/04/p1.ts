/**
 * https://adventofcode.com/2025/day/04
 *
 * General solution:
 * - basic look around
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;

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
    const numCols = parsed[0].length;
    const numRows = parsed.length;

    parsed.forEach((rowStr, row) => {
      for (let col = 0; col < numCols; col++) {
        const cellVal = rowStr.charAt(col);
        
        if (cellVal !== '@') {
          continue;
        }

        let numRolls = 0;
        const coords = [[row-1, col], [row-1, col+1], [row, col+1], [row+1, col+1], [row+1, col], [row+1, col-1], [row, col-1], [row-1, col-1]];

        for (let i=0; i < coords.length; i++) {
          if (numRolls >= 4) {
            break;
          }

          const [r, c] = coords[i];

          if (r < 0 || r >= numRows || c < 0 || c >= numCols) {
            continue;
          } else if (parsed[r].charAt(c) === '@') {
            numRolls++;
          }
        }

        if (numRolls < 4) {
          result++;
        }
      }
    });

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

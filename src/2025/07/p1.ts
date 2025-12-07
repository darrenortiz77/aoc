/**
 * https://adventofcode.com/2025/day/07
 *
 * General solution:
 * - BFS (but I hate the wording of the puzzle. Doesn't make sense as written)
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`;

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
    const beams = new Set<number>();
    const start = parsed[0].indexOf('S');
    beams.add(start);

    let row = 1;
    while (row < parsed.length) {
      beams.forEach(col => {
        const cell = parsed[row].charAt(col);
        if (cell === '^') {
          beams.delete(col);
          let splitLeft = false;
          let splitRight = false;
          
          if (col > 0) {
            splitLeft = true;
            beams.add(col-1);
          }

          if (col < parsed.length-1) {
            splitRight = true;
            beams.add(col+1);
          }

          if (splitLeft || splitRight) {
            result++;
          }
        }
      });
      row++;
    }

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

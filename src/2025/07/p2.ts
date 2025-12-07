/**
 * https://adventofcode.com/2025/day/07
 *
 * General solution:
 * - DFS + memoization
 * - keep track of which branches you've already evaluated and just return its subtotal instead
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
    const start = parsed[0].indexOf('S');
    const branches = new Map<string, number>();

    result = fire(1, start);

    function fire(row: number, col: number): number {
      while (row < parsed.length) {
        const cell = parsed[row].charAt(col);
        
        if (cell === '^') {
          let left = 0;
          let right = 0;

          if (branches.has(`${row}_${col}_l`)) {
            left = branches.get(`${row}_${col}_l`)!;
          } else {
            left = fire(row, col-1);
            branches.set(`${row}_${col}_l`, left);
          }

          if (branches.has(`${row}_${col}_r`)) {
            right = branches.get(`${row}_${col}_r`)!;
          } else {
            right = fire(row, col+1);
            branches.set(`${row}_${col}_r`, right);
          }

          return left + right;
        }

        row++;
      }

      return 1;
    }

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

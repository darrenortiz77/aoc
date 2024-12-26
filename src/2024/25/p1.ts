/**
 * https://adventofcode.com/2024/day/25
 *
 * General solution:
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    const locks: number[][] = [];
    const keys: number[][] = [];

    input.split('\n\n').forEach(lockKeyInput => {
      const heights = new Array(5).fill(0);
      const lines = lockKeyInput.split('\n');
      let type = lines[0] === '#####' ? 'lock' : 'key';
      
      for (let i=1; i < lines.length-1; i++) {
        for (let col = 0; col < lines[i].length; col++) {
          if (lines[i].charAt(col) === '#') {
            heights[col]++;
          }
        }
      }

      if (type === 'lock') {
        locks.push(heights);
      } else {
        keys.push(heights);
      }
    });

    return {locks, keys};
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const {locks, keys} = this.parseInput(input);
    
    let result = 0;

    for (const lock of locks) {
      for (const key of keys) {
        let isMatch = true;
        for (let i=0; i < 5; i++) {
          if (lock[i] + key[i] > 5) {
            isMatch = false;
            break;
          }
        }
        if (isMatch) {
          result++;
        }
      }
    }

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

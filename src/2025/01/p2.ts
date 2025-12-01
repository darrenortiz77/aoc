/**
 * https://adventofcode.com/2025/day/01
 *
 * General solution:
 * - Increment result by number of full rotations
 * - Calculate end position. If end === 0, result++. If moving left and end > prev, result++. If moving right and end < prev, result++.
 */

import AOCBase from "../../AOCBase";

enum Dir {
  left = 'L',
  right = 'R',
}

export default class Solution implements AOCBase {
  readonly sampleInput = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;

  private position = 50;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    const output = input.split('\n').map(line => {
      const dir = line.substring(0, 1) as Dir;
      const dist = +line.substring(1);
      return {
        dir, dist
      };
    });

    return output;
  }

  public solve(input?: string) {
    const performanceStart = performance.now();

    const parsed = this.parseInput(input);
    let result = 0;

    parsed.forEach(instruction => {
      const numFullRotations = Math.floor(instruction.dist / 100);
      let dist = instruction.dist % 100;
      const dir = instruction.dir;

      result += numFullRotations;

      if (dist > 0) {
        if (dir === Dir.left) {
          dist *= -1;
        }
        
        const prevPos = this.position;
        let destPos = this.position + dist;

        if (destPos < 0) {
          destPos = 100 + destPos;
        } else if (destPos > 99) {
          destPos %= 100;
        }

        if (destPos === 0 ||
          (dir === Dir.left && destPos > prevPos && prevPos !== 0) ||
          (dir === Dir.right && destPos < prevPos)
        ) {
          result++;
        }

        this.position = destPos;
      }
    });

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

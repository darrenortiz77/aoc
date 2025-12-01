/**
 * https://adventofcode.com/2025/day/01
 *
 * General solution:
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
      let dist = instruction.dist % 100;
      if (instruction.dir === Dir.left) {
        dist *= -1;
      }
      this.position += dist;

      // normalize the result between 0 and 99
      if (this.position < 0) {
        this.position = 100 + this.position;
      } else if (this.position > 0) {
        this.position %= 100;
      }

      if (this.position === 0) {
        result++;
      }
    });

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

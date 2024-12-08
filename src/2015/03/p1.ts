/**
 * https://adventofcode.com/2015/day/3
 *
 * General solution:
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `^>v<`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input.split('');
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const directions = this.parseInput(input);
    const pos = [0, 0];
    const visited = new Set<string>([`${pos.join('_')}`]);

    for (const direction of directions) {
      switch (direction) {
        case '^':
          pos[1]--;
          break;
        case 'v':
          pos[1]++;
          break;
        case '<':
          pos[0]--;
          break;
        case '>':
          pos[0]++;
          break;
      }
      visited.add(`${pos.join('_')}`);
    }

    return {
      performance: performance.now() - performanceStart, 
      result: visited.size
    }
  }
}

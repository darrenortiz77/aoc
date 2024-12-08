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
    const santa = [0, 0];
    const roboSanta = [0, 0];
    const visited = new Set<string>([`${santa.join('_')}`]);

    for (let i=0; i < directions.length; i++) {
      const direction = directions[i];
      const giftGiver = i % 2 === 0 ? santa : roboSanta;

      switch (direction) {
        case '^':
          giftGiver[1]--;
          break;
        case 'v':
          giftGiver[1]++;
          break;
        case '<':
          giftGiver[0]--;
          break;
        case '>':
          giftGiver[0]++;
          break;
      }
      visited.add(`${giftGiver.join('_')}`);
    }

    return {
      performance: performance.now() - performanceStart, 
      result: visited.size
    }
  }
}

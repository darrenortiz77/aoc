/**
 * https://adventofcode.com/2015/day/6
 *
 * General solution:
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `toggle 461,550 through 564,900
turn off 370,39 through 425,839
turn off 464,858 through 833,915
turn off 812,389 through 865,874
turn on 599,989 through 806,993`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input.split('\n').map(line => {
      const matches = line.match(/((?:turn off)|(?:turn on)|(?:toggle)) (\d+,\d+) through (\d+,\d+)/)!;
      return {instruction: matches[1], coords1: matches[2].split(',').map(n => +n), coords2: matches[3].split(',').map(n => +n)};
    });
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const instructions = this.parseInput(input);
    const grid = new Array(1000);
    for (let i = 0; i < grid.length; i++) {
      grid[i] = new Array(1000).fill(0);
    }

    for (const {instruction, coords1, coords2} of instructions) {
      for (let x = coords1[0]; x <= coords2[0]; x++) {
        for (let y = coords1[1]; y <= coords2[1]; y++) {
          switch (instruction) {
            case 'turn on':
              grid[x][y] += 1;
              break;
            case 'turn off':
              grid[x][y] = grid[x][y] > 0 ? grid[x][y] - 1 : 0;
              break;
            case 'toggle':
              grid[x][y] += 2;
              break;
          }
        }
      }
    }

    let brightness = 0;
    for (let x = 0; x < grid.length; x++) {
      for (let y = 0; y < grid[0].length; y++) {
        brightness += grid[x][y];
      }
    }

    return {
      performance: performance.now() - performanceStart, 
      result: brightness
    }
  }
}

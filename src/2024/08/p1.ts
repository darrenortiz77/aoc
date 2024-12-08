/**
 * https://adventofcode.com/2024/day/8
 *
 * General solution:
 * 1. Find all antennae locations
 * 2. For each antennae of the same type, loop over all siblings
 * 3. Calculate delta cols and rows between each other.
 * 4. Possible antinodes are +- that delta from one antenna or another.
 */

import AOCBase from "../../AOCBase";

type Pos = [number, number];

export default class Solution implements AOCBase {
  readonly sampleInput = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input.split('\n').map(line => line.split(''));
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const grid = this.parseInput(input);
    const antennae = this.findAntennae(grid);
    const antinodes = new Set<string>();

    for (const [, antennaePos] of antennae) {
      for (let a=0; a < antennaePos.length-1; a++) {
        for (let b=a+1; b < antennaePos.length; b++) {
          const deltaRow = antennaePos[b][0] - antennaePos[a][0];
          const deltaCol = antennaePos[b][1] - antennaePos[a][1];

          const antinode1: Pos = [antennaePos[a][0] - deltaRow, antennaePos[a][1] - deltaCol];
          const antinode2: Pos = [antennaePos[b][0] + deltaRow, antennaePos[b][1] + deltaCol];

          if (this.isValidPos(antinode1, grid)) {
            antinodes.add(`${antinode1.join('_')}`);
          }
          if (this.isValidPos(antinode2, grid)) {
            antinodes.add(`${antinode2.join('_')}`);
          }
        }
      }
    }
    
    return {
      performance: performance.now() - performanceStart, 
      result: antinodes.size
    }
  }

  private findAntennae(grid: string[][]) {
    const antennae = new Map<string, Pos[]>();

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        const cell = grid[row][col];
        if (cell !== '.') {
          let positions = antennae.get(cell);
          if (!positions) {
            positions = [];
            antennae.set(cell, positions);
          }
          positions.push([row, col]);
        }
      }
    }

    return antennae;
  }

  private isValidPos(pos: Pos, grid: string[][]) {
    const [row, col] = pos;
    return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
  }
}

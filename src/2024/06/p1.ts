/**
 * https://adventofcode.com/2024/day/6
 *
 * General solution:
 */

import AOCBase from "../../AOCBase";

enum Dir {
  Up,
  Down,
  Left,
  Right
}

type Pos = [number, number];

export default class Solution implements AOCBase {
  readonly sampleInput = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    const guard: Pos = [0,0];
    let guardFound = false;

    const grid = input.split('\n').map((line, row) => {
      if (!guardFound) {
        const col = line.indexOf('^');
        if (col !== -1) {
          guardFound = true;
          guard[0] = row;
          guard[1] = col;
        }
      }
      return line.split('');
    });

    return {grid, guard};
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const {grid, guard} = this.parseInput(input);
    
    let dir = Dir.Up as Dir;
    const visited = new Set<string>([guard.join('_')]);

    while (true) {
      let [nextRow, nextCol] = guard;

      switch (dir) {
        case Dir.Up:
          nextRow--;
          break;
        case Dir.Down:
          nextRow++;
          break;
        case Dir.Left:
          nextCol--;
          break;
        case Dir.Right:
          nextCol++;
          break;
      }

      // gone off grid
      if (nextRow < 0 || nextRow >= grid.length || nextCol < 0 || nextCol >= grid[0].length) {
        break;

      // hit an obstacle, rotate 90 deg
      } else if (grid[nextRow][nextCol] === '#') {
        switch (dir) {
          case Dir.Up:
            dir = Dir.Right;
            break;
          case Dir.Down:
            dir = Dir.Left;
            break;
          case Dir.Left:
            dir = Dir.Up;
            break;
          case Dir.Right:
            dir = Dir.Down;
            break;
        }

      // nothing there. Keep going.
      } else {
        guard[0] = nextRow;
        guard[1] = nextCol;
        visited.add(guard.join('_'));
      }
    }

    return {
      performance: performance.now() - performanceStart, 
      result: visited.size
    }
  }
}

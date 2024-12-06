/**
 * https://adventofcode.com/2024/day/6
 *
 * General solution:
 * 1. Walk the path normally and keep track of all visited tiles, including the direction we were headed
 * 2. Go backwards through the visited tiles and replace that visited spot with a new obstacle.
 * 3. Bring the guard to be one spot behind the obstacle and continue walking.
 * 4. If the guard ever encounters a tile he's previously stepped on and in the same direction he was previously headed, we've found a loop.
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
    const candidates = new Set<string>();
    const visited = new Set<string>([`${guard.join('_')}_${dir}`]);

    // walk it once and keep track of the tiles visited and what obstructions exist
    this.walkPath([...guard], dir, grid, visited);

    // go backwards down the visited path and test to see what happens if we add a new obstruction
    const visitedTiles = [...visited.values()];
    for (let i=visitedTiles.length-1; i > 0; i--) {
      const [row, col] = visitedTiles[i].split('_').map(n => +n);
      
      // turn that tile into an obstruction
      const prevTileVal = grid[row][col];
      if (prevTileVal === '^') {
        continue;
      }
      grid[row][col] = '#';

      // put the guard to be one step behind the new obstruction. No need to walk the whole path again.
      const [guardRow, guardCol, dir] = visitedTiles[i-1].split('_').map(n => +n);

      // clone the visited tiles and pull out anything after the new obstacle
      const newVisited = new Set(visitedTiles.slice(0, i));

      // if this new obstacle is in a spot that we would already have walked by earlier, it's not valid
      if (newVisited.has(`${row}_${col}_${Dir.Up}`) || newVisited.has(`${row}_${col}_${Dir.Down}`) || newVisited.has(`${row}_${col}_${Dir.Left}`) || newVisited.has(`${row}_${col}_${Dir.Right}`)) {
        // put it back how it was
        grid[row][col] = prevTileVal;
        continue;
      }

      // walk this new path and see if a cycle emerges
      const cycle = this.walkPath([guardRow, guardCol], dir, grid, newVisited);

      // put it back how it was
      grid[row][col] = prevTileVal;

      if (cycle) {
        candidates.add(`${row}_${col}`);
      }
    }

    return {
      performance: performance.now() - performanceStart, 
      result: candidates.size
    }
  }

  private walkPath(guard: Pos, initDir: Dir, grid: string[][], visited: Set<string>) {
    let dir = initDir;

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

      // we've found a cycle
      } else if (visited.has(`${nextRow}_${nextCol}_${dir}`)) {
        return true;

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
        visited.add(`${guard.join('_')}_${dir}`);
      }
    }

    return false;
  }
}

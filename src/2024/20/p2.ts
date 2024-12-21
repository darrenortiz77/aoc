/**
 * https://adventofcode.com/2024/day/20
 *
 * General solution:
 */

import AOCBase from "../../AOCBase";

type Point = [number, number];

export default class Solution implements AOCBase {
  readonly sampleInput = `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input.split('\n').map(line => line.split(''));
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const grid = this.parseInput(input);
    const {start, end} = getEndpoints(grid);

    const {path, positions} = getRacetrack(grid, start, end);

    const minCheatAmount = 100;
    let validCheats = new Set<string>();

    // go through the racetrack
    for (let i=0; i < path.length - minCheatAmount; i++) {
      const current = path[i];

      // get a list of all possible cheatpoints from here
      const cheatpoints = getCheatpoints(current, grid, 20);

      // loop over cheats to see if any save us time
      for (const cheat of cheatpoints) {
        const cheatPosition = positions.get(JSON.stringify(cheat))!;
        const savings = path.length - (path.length - cheatPosition + i + manhattanDistance(current, cheat));
        if (savings >= minCheatAmount) {
          validCheats.add(JSON.stringify([current, cheat]));
        }
      }
    }

    return {
      performance: performance.now() - performanceStart, 
      result: validCheats.size
    }
  }
}

function getEndpoints(grid: string[][]) {
  let start: Point|null = null;
  let end: Point|null = null;

  for (let row=0; row < grid.length; row++) {
    for (let col=0; col < grid[0].length; col++) {
      if (grid[row][col] === 'S') {
        start = [col, row];
        grid[row][col] = '.'
      } else if (grid[row][col] === 'E') {
        end = [col, row];
        grid[row][col] = '.'
      }
    }

    if (start && end) {
      break;
    }
  }

  return {start: start!, end: end!};
}

function getRacetrack(grid: string[][], start: Point, end: Point) {
  const path: Point[] = [start];
  const positions = new Map<string, number>();
  positions.set(JSON.stringify(start), 0);

  let i=1;
  let current = start;
  const directions = [[-1,0], [1,0], [0,-1], [0,1]];

  while (current[0] !== end[0] || current[1] !== end[1]) {
    for (const dir of directions) {
      const neighbor: Point = [current[0] + dir[0], current[1] + dir[1]];
      const neighborVal = grid[neighbor[1]][neighbor[0]];
      const neighbourValStr = JSON.stringify(neighbor);
      if (!positions.has(neighbourValStr) && neighborVal === '.') {
        path.push(neighbor);
        positions.set(neighbourValStr, i);
        current = neighbor;
        i++
        break;
      }
    }
  }

  return {path, positions};
}

function getCheatpoints(current: Point, grid: string[][], cheatDistance: number) {
  const cheatpoints: Point[] = [];

  for (let x = cheatDistance; x > 0; x--) {
    const candidates: Point[] = [];

    for (let y = cheatDistance - x; y >= 0; y--) {
      candidates.push([current[0] + x, current[1] + y]);
      candidates.push([current[0] - x, current[1] + y]);
      candidates.push([current[0] + x, current[1] - y]);
      candidates.push([current[0] - x, current[1] - y]);

      for (const [x,y] of candidates) {
        if (
          x >= 0 && x < grid[0].length &&
          y >= 0 && y < grid.length &&
          grid[y][x] === '.'
        ) {
          cheatpoints.push([x, y]);
        }
      }
    }
  }

  for (let y = current[1] - cheatDistance; y <= current[1] + cheatDistance; y++) {
    if (
      y !== current[1] &&
      y >= 0 && y < grid.length &&
      grid[y][current[0]] === '.'
    ) {
      cheatpoints.push([current[0], y]);
    }
  }

  return cheatpoints;
}

function manhattanDistance(ptA: Point, ptB: Point) {
  return Math.abs(ptA[0] - ptB[0]) + Math.abs(ptA[1] - ptB[1]);
}

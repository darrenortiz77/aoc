/**
 * https://adventofcode.com/2024/day/20
 *
 * General solution:
 * Ugly. Better solutions exist.
 * Run A* to get normal path. (Totally unnceccessary. The grid isn't a maze. It's a race-track. No algorithm needed, just walk the track).
 * Loop over path given by A* and find all neighbours that are walls that have track on the other side of it.
 * One by one remove that portion of the wall, run A* again, calculate the difference, then put the wall back.
 * All in all, a dumb, slow "solution".
 */

import AOCBase from "../../AOCBase";
import AStar, {Point} from "../../utils/Astar";

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

    const aStar = new AStar<string>(grid, '.');
    const path = aStar.findPath(start, end);
    const total = path!.length;
    const cheatCandidates = getCheatCandidates(path, grid);
    let numValidCheats = 0;

    for (const candidate of cheatCandidates) {
      const {x, y} = JSON.parse(candidate) as Point;
      grid[y][x] = '.';
      const cheatTotal = aStar.findPath(start, end);
      if (cheatTotal && total - cheatTotal.length >= 100) {
        numValidCheats++;
      }
      grid[y][x] = '#';
    }

    return {
      performance: performance.now() - performanceStart, 
      result: numValidCheats
    }
  }
}

function getEndpoints(grid: string[][]) {
  let start: Point|null = null;
  let end: Point|null = null;

  for (let row=0; row < grid.length; row++) {
    for (let col=0; col < grid[0].length; col++) {
      if (grid[row][col] === 'S') {
        start = {x: col, y: row};
        grid[row][col] = '.'
      } else if (grid[row][col] === 'E') {
        end = {x: col, y: row};
        grid[row][col] = '.'
      }
    }

    if (start && end) {
      break;
    }
  }

  return {start: start!, end: end!};
}

function getCheatCandidates(path: Point[]|null, grid: string[][]) {
  const candidates = new Set<string>();

  if (!path) {
    return candidates;
  }

  const directions = [
    {x: 1, y: 0},
    {x: -1, y: 0},
    {x: 0, y: 1},
    {x: 0, y: -1}
  ];

  for (const {x, y} of path) {
    if (x > 0 && x < grid[0].length && y > 0 && y < grid.length) {
      for (const dir of directions) {
        const neighbor = {x: x + dir.x, y: y + dir.y};
        const nextNeighbor = {x: neighbor.x + dir.x, y: neighbor.y + dir.y};
        if (
          nextNeighbor.x > 0 && nextNeighbor.x < grid[0].length && nextNeighbor.y > 0 && nextNeighbor.y < grid.length && 
          grid[neighbor.y][neighbor.x] === '#' && 
          grid[nextNeighbor.y][nextNeighbor.x] === '.'
        ) {
          candidates.add(JSON.stringify(neighbor));
        }
      }
    }
  }

  return candidates;
}

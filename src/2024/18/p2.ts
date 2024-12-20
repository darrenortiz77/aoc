/**
 * https://adventofcode.com/2024/day/18
 *
 * General solution:
 * A*, and then just keep adding more obstacles until A* fails.
 */

import AOCBase from "../../AOCBase";
import AStar from "../../utils/Astar";

export default class Solution implements AOCBase {
  readonly sampleInput = `5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`;

  public parseInput(input?: string) {
    let gridSize = 70;
    let walkAfter = 1024;
    if (!input) {
      input = this.sampleInput;
      gridSize = 6;
      walkAfter = 12;
    }

    const grid: string[][] = [];
    for (let i=0; i <= gridSize; i++) {
      const row = new Array(gridSize+1).fill('.');
      grid.push(row);
    }

    const bytes = input.split('\n').map(line => line.split(',').map(Number));

    return {grid, walkAfter, bytes};
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const {grid, walkAfter, bytes} = this.parseInput(input);

    let i: number;
    for (i=0; i < walkAfter; i++) {
      const [x, y] = bytes[i];
      grid[y][x] = '#';
    }

    const aStar = new AStar<string>(grid, '.');
    let path = aStar.findPath({x: 0, y: 0}, {x: grid[0].length-1, y: grid.length-1});

    while (path !== null && i < bytes.length) {
      const [x, y] = bytes[i];
      grid[y][x] = '#';
      i++;
      path = aStar.findPath({x: 0, y: 0}, {x: grid[0].length-1, y: grid.length-1});
    }

    return {
      performance: performance.now() - performanceStart, 
      result: bytes[i-1].join(',')
    }
  }
}

/**
 * https://adventofcode.com/2024/day/10
 *
 * General solution:
 * BFS
 * Same as part one, but instead of sharing the `visited` Set between each `walkTrail` call, I create a fresh one each time.
 * So now it's only keeping track if one particular walking path hasn't gone back over the same tile.
 */

import AOCBase from "../../AOCBase";

type Cell = [number, number];
type Grid = number[][];

export default class Solution implements AOCBase {
  readonly sampleInput = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;

  private trailheadRatings = new Map<string, number>();

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    const trailheads: Cell[] = [];
    const grid: Grid = input.split('\n').map((line, row) => {
      return line.split('').map((n, col) => {
        const num = +n
        if (num === 0) {
          trailheads.push([row, col]);
        }
        return num;
      })
    });

    return {grid, trailheads};
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const {grid, trailheads} = this.parseInput(input);

    trailheads.forEach(trailhead => this.walkTrail(trailhead, JSON.stringify(trailhead), grid, new Set()));

    let result = 0;
    for (const [,rating] of this.trailheadRatings) {
      result += rating;
    }
 
    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }

  private walkTrail(cell: Cell, trailhead: string, grid: Grid, visited: Set<string>) {
    const [row, col] = cell;
    const cellString = JSON.stringify(cell);
    const value = grid[row][col];

    if (visited.has(cellString)) {
      return;
    }

    const newVisited = new Set(visited);
    newVisited.add(cellString);

    if (value === 9) {
      this.trailheadRatings.set(trailhead, (this.trailheadRatings.get(trailhead) ?? 0) + 1);
      return;
    }

    if (row > 0) {
      const up = grid[row-1][col];
      if (up - value === 1) {
        this.walkTrail([row-1,col], trailhead, grid, newVisited);
      }
    }
    if (row < grid.length-1) {
      const down = grid[row+1][col];
      if (down - value === 1) {
        this.walkTrail([row+1,col], trailhead, grid, newVisited);
      }
    }
    if (col > 0) {
      const left = grid[row][col-1];
      if (left - value === 1) {
        this.walkTrail([row,col-1], trailhead, grid, newVisited);
      }
    }
    if (col < grid[0].length-1) {
      const right = grid[row][col+1];
      if (right - value === 1) {
        this.walkTrail([row,col+1], trailhead, grid, newVisited);
      }
    }
  }
}

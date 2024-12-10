/**
 * https://adventofcode.com/2024/day/10
 *
 * General solution:
 * BFS
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

  private numTrails = 0;

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

    trailheads.forEach(trailhead => this.walkTrail(trailhead, grid, new Set()));

    return {
      performance: performance.now() - performanceStart, 
      result: this.numTrails
    }
  }

  private walkTrail(cell: Cell, grid: Grid, visited: Set<string>) {
    const [row, col] = cell;
    const cellString = JSON.stringify(cell);
    const value = grid[row][col];

    if (visited.has(cellString)) {
      return;
    }

    visited.add(cellString);

    if (value === 9) {
      this.numTrails++;
      return;
    }

    if (row > 0) {
      const up = grid[row-1][col];
      if (up - value === 1) {
        this.walkTrail([row-1,col], grid, visited);
      }
    }
    if (row < grid.length-1) {
      const down = grid[row+1][col];
      if (down - value === 1) {
        this.walkTrail([row+1,col], grid, visited);
      }
    }
    if (col > 0) {
      const left = grid[row][col-1];
      if (left - value === 1) {
        this.walkTrail([row,col-1], grid, visited);
      }
    }
    if (col < grid[0].length-1) {
      const right = grid[row][col+1];
      if (right - value === 1) {
        this.walkTrail([row,col+1], grid, visited);
      }
    }
  }
}

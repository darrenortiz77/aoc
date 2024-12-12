/**
 * https://adventofcode.com/2024/day/12
 *
 * General solution:
 * Flood-fill to get distinct regions.
 * Then check each cell of each region and see if its neighbours are the same plant. If not, put fence.
 * Record position of fence and its directionality. Loop over all fence positions and look for neighbouring ones. Remove them as possibilities as you go.
 * Each contiguous line of fence represents a side.
 */

import AOCBase from "../../AOCBase";

type Pos = [number, number];

type Region = {
  plant: string;
  positions: Pos[];
};

export default class Solution implements AOCBase {
  readonly sampleInput = `AAAA
BBCD
BBCC
EEEC`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input.split('\n').map(line => line.split(''));
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const garden = this.parseInput(input);
    const regions: Region[] = [];
    
    // flood fill to see what the distinct regions are
    // =========
    const cellsToCheck = new Set<string>();
    for (let row = 0; row < garden.length; row++) {
      for (let col = 0; col < garden[0].length; col++) {
        cellsToCheck.add(`${row}_${col}`);
      }
    }

    const checkNeighbor = (row: number, col: number, plant: string, positions: Pos[]) => {
      if (row > 0 && garden[row-1][col] === plant && cellsToCheck.has(`${row-1}_${col}`)) {
        positions.push([row-1, col]);
        cellsToCheck.delete(`${row-1}_${col}`);
        checkNeighbor(row-1, col, plant, positions);
      }
      if (row < garden.length-1 && garden[row+1][col] === plant && cellsToCheck.has(`${row+1}_${col}`)) {
        positions.push([row+1, col]);
        cellsToCheck.delete(`${row+1}_${col}`);
        checkNeighbor(row+1, col, plant, positions);
      }
      if (col > 0 && garden[row][col-1] === plant && cellsToCheck.has(`${row}_${col-1}`)) {
        positions.push([row, col-1]);
        cellsToCheck.delete(`${row}_${col-1}`);
        checkNeighbor(row, col-1, plant, positions);
      }
      if (col < garden[0].length-1 && garden[row][col+1] === plant && cellsToCheck.has(`${row}_${col+1}`)) {
        positions.push([row, col+1]);
        cellsToCheck.delete(`${row}_${col+1}`);
        checkNeighbor(row, col+1, plant, positions);
      }
    };

    while (cellsToCheck.size) {
      const cell = cellsToCheck.values().next().value!;
      cellsToCheck.delete(cell);
      const [row, col] = cell.split('_').map(Number);
      const plant = garden[row][col];
      const positions: Pos[] = [[row, col]];
      checkNeighbor(row, col, plant, positions);
      regions.push({plant, positions});
    }
    // =========

    let price = 0;
    for (const {plant, positions} of regions) {
      // figure out unique positions of each fence
      const fencePositions = new Set<string>();
      for (const [row, col] of positions) {
        if (row === 0 || garden[row-1][col] !== plant) {
          fencePositions.add(`${row}:${row-1}_${col}_h`);
        }
        if (row === garden.length-1 || garden[row+1][col] !== plant) {
          fencePositions.add(`${row}:${row+1}_${col}_h`);
        }
        if (col === 0 || garden[row][col-1] !== plant) {
          fencePositions.add(`${row}_${col}:${col-1}_v`);
        }
        if (col === garden[0].length-1 || garden[row][col+1] !== plant) {
          fencePositions.add(`${row}_${col}:${col+1}_v`);
        }
      }


      let numSides = 0;
      while (fencePositions.size) {
        const fence = fencePositions.values().next().value!;
        fencePositions.delete(fence);
        const fenceParts = fence.split('_');
        const row = fenceParts[0];
        const col = fenceParts[1];

        if (fenceParts[2] === 'h') {
          let colCheck = +col;
          // look right
          while (fencePositions.has(`${row}_${colCheck+1}_h`)) {
            fencePositions.delete(`${row}_${colCheck+1}_h`);
            colCheck = colCheck+1;
          }
          // look left
          colCheck = +col;
          while (fencePositions.has(`${row}_${colCheck-1}_h`)) {
            fencePositions.delete(`${row}_${colCheck-1}_h`);
            colCheck = colCheck-1;
          }
        
        } else if (fenceParts[2] === 'v') {
          let rowCheck = +row;
          // look up
          while (fencePositions.has(`${rowCheck-1}_${col}_v`)) {
            fencePositions.delete(`${rowCheck-1}_${col}_v`);
            rowCheck = rowCheck-1;
          }
          // look down
          rowCheck = +row;
          while (fencePositions.has(`${rowCheck+1}_${col}_v`)) {
            fencePositions.delete(`${rowCheck+1}_${col}_v`);
            rowCheck = rowCheck+1;
          }
        }

        numSides++;
      }

      price += (numSides * positions.length);
    }

    return {
      performance: performance.now() - performanceStart, 
      result: price
    }
  }
}

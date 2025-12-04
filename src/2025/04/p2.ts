/**
 * https://adventofcode.com/2025/day/04
 *
 * General solution:
 * - loop over all cells and create map of cell: neighbors
 * - as you create the map, start a stack with a list of cells that can be removed
 * - while the stack isn't empty, remove rolls, but as you do, check its neighbours to see if this roll was a neighbour
 * - if the neighbour's list of neighbour's drops below 4, add it to the stack
 * - keep going until stack is empty
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input.split('\n');
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const parsed = this.parseInput(input);
    let result = 0;

    // logic here
    const numCols = parsed[0].length;
    const numRows = parsed.length;

    const rolls = new Map<string, Set<string>>();
    const stack: string[] = [];

    parsed.forEach((rowStr, row) => {
      for (let col = 0; col < numCols; col++) {
        const cellVal = rowStr.charAt(col);
        
        if (cellVal !== '@') {
          continue;
        }

        const coords = [[row-1, col], [row-1, col+1], [row, col+1], [row+1, col+1], [row+1, col], [row+1, col-1], [row, col-1], [row-1, col-1]];
        const neighbors = new Set<string>();

        for (let i=0; i < coords.length; i++) {
          const [r, c] = coords[i];

          if (r < 0 || r >= numRows || c < 0 || c >= numCols) {
            continue;
          } else if (parsed[r].charAt(c) === '@') {
            neighbors.add(`${r}_${c}`);
          }
        }

        rolls.set(`${row}_${col}`, neighbors);

        if (neighbors.size < 4) {
          stack.push(`${row}_${col}`);
        }
      }
    });

    while (stack.length > 0) {
      const roll = stack.pop()!;
      removeRoll(roll);
    }

    function removeRoll(roll: string) {
      const [row, col] = roll.split('_').map(s => +s);

      if (parsed[row].charAt(col) === '@') {
        parsed[row] = `${parsed[row].substring(0, col)}.${parsed[row].substring(col+1)}`;
        result++;

        const neighbors = rolls.get(roll);

        neighbors?.forEach(neighbor => {
          const neighborsNeighbors = rolls.get(neighbor);

          if (neighborsNeighbors?.has(roll)) {
            neighborsNeighbors.delete(roll);

            if (neighborsNeighbors.size < 4) {
              stack.push(neighbor);
            }
          }
        });
      }
    }

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

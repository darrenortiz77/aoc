/**
 * https://adventofcode.com/2015/day/18
 *
 * General solution:
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `##.#.#
...##.
#....#
..#...
#.#..#
####.#`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input.split('\n').map(line => line.split('').map(c => c === '#'));
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    let state = this.parseInput(input);
    let result = 0;
    const steps = !input ? 5 : 100;

    // logic here
    for (let i=0; i < steps; i++) {
      const newState: boolean[][] = [];

      state.forEach((row, r) => {
        const newRow: boolean[] = [];
        row.forEach((col, c) => {
          const lightIsOn = col;
          let numNeighborsOn = 0;
          const neighbors = [[r-1, c-1], [r-1, c], [r-1, c+1], [r, c+1], [r+1, c+1], [r+1, c], [r+1, c-1], [r, c-1]];
          
          for (let n=0; n < neighbors.length; n++) {
            const [neighborRow, neighborCol] = neighbors[n];

            if (neighborRow < 0 || neighborCol < 0 || neighborRow >= state.length || neighborCol >= row.length) {
              continue;
            }

            if (state[neighborRow][neighborCol]) {
              numNeighborsOn++;
            }

            if (numNeighborsOn > 3) {
              break;
            }
          }

          if (lightIsOn) {
            newRow.push(numNeighborsOn === 2 || numNeighborsOn === 3);
          } else {
            newRow.push(numNeighborsOn === 3);
          }
        });
        newState.push(newRow);
      });

      state = newState;
      state[0][0] = true;
      state[0][state[0].length-1] = true;
      state[state.length-1][0] = true;
      state[state.length-1][state[0].length-1] = true;
    }

    state.forEach(row => {
      result += row.reduce((subtotal, col) => subtotal + (col ? 1 : 0), 0);
    }, 0);

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

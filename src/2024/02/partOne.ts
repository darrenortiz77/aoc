/**
 * https://adventofcode.com/2024/day/2
 *
 * General solution:
 * 1. Split input into number[][]
 * 2. Loop over each "level" and make sure each number in the level is only ever increasing or decreasing by between 1-3. 
 * And that it's consistent in terms of ascending/descending.
 */

import CodeRunner from "../../CodeRunner";

export default class DayTwoPartOne extends CodeRunner {
  public run(input?: string) {
    if (!input) {
      input = `7 6 4 2 1
        1 2 7 8 9
        9 7 6 2 1
        1 3 2 4 5
        8 6 4 4 1
        1 3 6 7 9`;
    }
    
    const performanceStart = performance.now();
    const levels = input.split('\n').map(line => line.trim().split(' ').map(n => +n));

    let numSafe = 0;

    levels.forEach(level => {
      let isSafe = true;
      let ascending = level[1] > level[0];

      for (let i=1; i < level.length; i++) {
        const delta = level[i] - level[i-1];
        if (
          delta === 0 ||
          (ascending && (delta < 1 || delta > 3)) ||
          (!ascending && (delta > -1 || delta < -3))
        ) {
          isSafe = false;
          break;
        }
      }

      if (isSafe) {
        numSafe++;
      }
    });


    return {
      performance: performance.now() - performanceStart, 
      result: numSafe
    }
  }
}

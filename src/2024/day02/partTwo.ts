/**
 * https://adventofcode.com/2024/day/2
 *
 * General solution:
 * 1. Split input into number[][]
 * 2. Loop over each "level" and make sure each number in the level is only ever increasing or decreasing by between 1-3. 
 * And that it's consistent in terms of ascending/descending.
 * 3. If there's a failure point anywhere, work your way backward from that point and test the same level but with one index removed.
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
      const safetyCheck = this.testSubset(level, level[1] > level[0]);
      
      if (safetyCheck.isSafe || level.length <= 2) {
        numSafe++;
      // if we failed on the last one, we don't need to recheck. We know we can just remove that one value
      } else if (safetyCheck.failIndex === level.length-1) {
        numSafe++;
      } else {
        // check if removing a value from the fail-point backwards will make it safe
        for (let n=safetyCheck.failIndex; n>=0; n--) {
          const subset =  n > 0 ? [...level.slice(0, n), ...level.slice(n+1)] : [...level.slice(n+1)];
          if (this.testSubset(subset, subset[1] > subset[0]).isSafe) {
            numSafe++;
            break;
          }
        }
      }
    });

    return {
      performance: performance.now() - performanceStart, 
      result: numSafe
    }
  }

  private testSubset(level: number[], ascending: boolean) {
    let isSafe = true;
    let i: number;

    for (i=1; i < level.length; i++) {
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

    return {
      isSafe,
      failIndex: i
    };
  }
}

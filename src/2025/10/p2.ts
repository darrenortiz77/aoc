/**
 * https://adventofcode.com/2025/day/10
 *
 * General solution:
 * - BFS
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`;

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
    parsed.forEach(line => {
      const goalString = line.match(/\{(.+)\}/)![1];
      const goal = goalString.split(',').map(s => +s);
      const beginState: number[] = new Array(goal.length).fill(0);
      const buttons = [...line.matchAll(/\((.+?)\)/g)].map(result => result[1].split(','));

      let numPresses = 0;
      let endStateFound = false;
      let states = [beginState];

      while (!endStateFound && numPresses < 10000) {
        numPresses++;

        const newStates: number[][] = [];

        for (let i = 0; i < states.length; i++) {
          for (let b = 0; b < buttons.length; b++) {
            const thisState = pushButton([...states[i]], buttons[b]);

            // check for overage
            let valid = true;
            for (let n=0; n < thisState.length; n++) {
              if (thisState[n] > goal[n]) {
                valid = false;
                break;
              }
            }
            
            if (i % 100000 === 0) wait();

            if (!valid) {
              continue;
            }

            newStates.push(thisState);

            if (thisState.join(',') === goalString) {
              console.log(goalString, '==', numPresses, 'presses');
              endStateFound = true;
              result += numPresses;
              break;
            }
          }

          if (endStateFound) {
            break;
          }
        }

        const uniq = new Set(newStates.map(a => a.join(',')));
        const uniq2 = [...uniq].map(a => a.split(',').map(s => +s));

        states = uniq2;
      }
    });

    function pushButton(thisState: number[], button: string[]) {
      button.forEach(lightIdx => {
        thisState[+lightIdx] = thisState[+lightIdx] + 1;
      });

      return thisState;
    }

    function wait(ms: number = 0) {
      setTimeout(() => {}, ms);
    }

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

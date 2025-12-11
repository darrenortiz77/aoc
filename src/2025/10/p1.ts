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
      const goal = line.match(/\[(.+)\]/)![1];
      const beginState = new Array(goal.length).fill('.').join('');
      const buttons = [...line.matchAll(/\((.+?)\)/g)].map(result => result[1].split(','));
      
      let numPresses = 0;
      let endStateFound = false;
      let states: [string, number][] = [[beginState, -1]];

      while (!endStateFound) {
        numPresses++;

        const newStates: [string, number][] = [];

        for (let i = 0; i < states.length; i++) {
          for (let b = 0; b < buttons.length; b++) {
            if (b === states[i][1]) {
              continue;
            }

            const thisState = pushButton(states[i][0], buttons[b]);
            newStates.push([thisState, b]);

            if (thisState === goal) {
              endStateFound = true;
              result += numPresses;
              break;
            }
          }

          if (endStateFound) {
            break;
          }
        }

        states = newStates;
      }
    });

    function pushButton(thisState: string, button: string[]) {
      button.forEach(lightIdx => {
        const light = thisState.charAt(+lightIdx);
        const newLight = light === '#' ? '.' : '#';
        thisState = `${thisState.substring(0, +lightIdx)}${newLight}${thisState.substring(+lightIdx + 1)}`;
      });

      return thisState;
    }

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

/**
 * https://adventofcode.com/2015/day/16
 *
 * General solution:
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `Sue 1: children: 1, cars: 8, vizslas: 7
Sue 2: akitas: 10, perfumes: 10, children: 5
Sue 3: cars: 5, pomeranians: 4, vizslas: 1
Sue 4: goldfish: 5, children: 8, perfumes: 3`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input.split('\n').map(line => {
      const splitPoint = line.indexOf(':');
      const values = line.slice(splitPoint+2).split(', ');
      const sueData: Record<string, number> = {};
      values.forEach(value => {
        const [key, num] = value.split(': ');
        sueData[key] = +num;
      });
      return sueData;
    });
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const sues = this.parseInput(input);

    const truths = {
      children: 3,
      cats: 7,
      samoyeds: 2,
      pomeranians: 3,
      akitas: 0,
      vizslas: 0,
      goldfish: 5,
      trees: 3,
      cars: 2,
      perfumes: 1,
    };

    let result = 0;
    for (let i=0; i < sues.length; i++) {
      const sue = sues[i];
      let isValid = true;
      for (const [key, value] of Object.entries(sue)) {
        if (truths[key] !== value) {
          isValid = false;
          break;
        }
      }
      if (isValid) {
        result = i+1;
      }
    }

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

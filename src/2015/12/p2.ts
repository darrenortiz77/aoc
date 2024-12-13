/**
 * https://adventofcode.com/2015/day/12
 *
 * General solution:
 * Parse JSON.
 * Recursively walk through JSON and sum numbers
 * Early exit out of any object that contains "red" as a value.
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `[1,{"c":"red","b":2},{"c":[1,1,1,"red"],"b":2},3]`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return JSON.parse(input);
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const json = this.parseInput(input);

    const walkArray = (arr: Array<unknown>, sum: number) => {
      for (const val of arr) {
        sum = walk(val, sum);
      }

      return sum;
    }

    const walkObject = (obj: Object, sum: number) => {
      for (const [, val] of Object.entries(obj)) {
        if (val === 'red') {
          return sum;
        }
      }

      for (const [, val] of Object.entries(obj)) {
        sum = walk(val, sum);
      }

      return sum;
    }

    const walk = (json: unknown, sum: number) => {
      if (typeof json === 'number') {
        return sum + json;
      } else if (Array.isArray(json)) {
        return walkArray(json, sum);
      } else if (typeof json === 'string') {
        return sum;
      } else {
        return walkObject(json as Object, sum);
      }
    };
    
    const result = walk(json, 0);

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

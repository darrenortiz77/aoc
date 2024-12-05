/**
 * https://adventofcode.com/2024/day/3
 *
 * General solution: RegEx baby!
 */

import CodeRunner from "../../CodeRunner";

export default class DayThreePartOne extends CodeRunner {
  public run(input?: string) {
    if (!input) {
      input = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`;
    }
    
    const performanceStart = performance.now();
    
    const matches = input.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g);
    let sum = 0;
    for (const match of matches) {
      sum += +match[1]! * +match[2]!;
    }

    return {
      performance: performance.now() - performanceStart, 
      result: sum
    }
  }
}

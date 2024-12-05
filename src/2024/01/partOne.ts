/**
 * https://adventofcode.com/2024/day/1
 *
 * General solution:
 * 1. Split input into individual lines
 * 2. Loop over lines and extract first and second nums via regex. Push those into separate arrays.
 * 3. Sort each array.
 * 4. Run a reduce on either of the arrays and sum the delta between left num and right num.
 *
 * Note: I tried a min-heap initially since I thought that would be faster than sorting, but I was wrong. It was about 2ms slower.
 */

import CodeRunner from "../../CodeRunner";

export default class DayOnePartOne extends CodeRunner {
  public run(input?: string) {
    if (!input) {
      input = `3   4
        4   3
        2   5
        1   3
        3   9
        3   3`;
    }
    
    const performanceStart = performance.now();
    const lines = input.split('\n');

    const leftHeap: number[] = [];
    const rightHeap: number[] = [];

    lines.forEach((line) => {
      const nums = line.match(/\b\d+?\b/g);
      leftHeap.push(+nums![0]);
      rightHeap.push(+nums![1]);
    });

    leftHeap.sort((a, b) => a - b);
    rightHeap.sort((a, b) => a - b);

    let sum = leftHeap.reduce((accumulator, currentValue, idx) => {
      return accumulator + Math.abs(currentValue - rightHeap[idx]);
    }, 0);

    return {
      performance: performance.now() - performanceStart, 
      result: sum
    }
  }
}

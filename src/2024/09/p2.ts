/**
 * https://adventofcode.com/2024/day/9
 *
 * General solution:
 */

import AOCBase from "../../AOCBase";

type Segment = {
  value: number|null;
  index: number;
  size: number;
};

export default class Solution implements AOCBase {
  readonly sampleInput = `2333133121414131402`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input.split('').map(n => +n);
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const diskMap = this.parseInput(input);
    const segments: Segment[] = [];

    // write to disk
    let index = 0;
    let fileId = 0;
    for (let i=0; i < diskMap.length; i++) {
      const value = (i % 2 === 0) ? fileId : null;
      segments.push({value, index, size: diskMap[i]});
      index += diskMap[i];

      if (i % 2 === 0) {
        fileId++;
      }
    }

    for (let i=segments.length-1; i > 0; i--) {
      const segmentToMove = segments[i];
      
      if (segmentToMove.value !== null) {

        // look for an empty spot that will fit
        for (let n=0; n < i; n++) {
          if (segments[n].value === null && segments[n].size >= segmentToMove.size) {
            const emptySpot = segments[n];

            // found one, move it
            segments.splice(i, 1);
            segmentToMove.index = emptySpot.index;
            segments.splice(n, 0, segmentToMove);

            // reduce the size of the current empty spot
            emptySpot.size -= segmentToMove.size;
            emptySpot.index += segmentToMove.size;
            break;
          }
        }
      }
    }

    let result = 0;
    for (let i=0; i < segments.length; i++) {
      if (segments[i].value !== null) {
        for (let n=0; n < segments[i].size; n++) {
          result += (segments[i].index + n) * segments[i].value!;
        }
      }
    }

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

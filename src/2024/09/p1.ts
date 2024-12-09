/**
 * https://adventofcode.com/2024/day/9
 *
 * General solution:
 */

import AOCBase from "../../AOCBase";

type Block = {
  id: number;
  index: number;
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
    const diskSpace = diskMap.reduce((sum, val) => sum += val, 0);
    const disk = new Array(diskSpace).fill(null);
    const emptySpots: number[] = []; // indexes of empty spots
    const blocks: Block[] = []; // ids and positions of each block

    // write to disk
    let writeIndex = 0;
    let fileId = 0;
    for (let i=0; i < diskMap.length; i++) {
      for (let n = writeIndex; n < writeIndex + diskMap[i]; n++) {
        if (i % 2 === 0) {
          disk[n] = fileId;
          blocks.push({id: fileId, index: n});
        } else {
          emptySpots.push(n);
        }
      }

      writeIndex += diskMap[i];

      if (i % 2 === 0) {
        fileId++;
      }
    }

    // early optimization? Reverse emptySpots array once as opposed to repeatedly shifting. No idea if this makes a difference.
    emptySpots.reverse();

    // while there's empty spots, fill it with a file block from the end
    while (emptySpots.length > 0) {
      const firstNull = disk.indexOf(null);
      const indexToFill = emptySpots.pop()!;
      const blockToMove = blocks.pop()!;
      
      // early exit if we're already fully compacted
      if (firstNull > blockToMove.index) {
        break;
      }

      disk[indexToFill] = blockToMove.id;
      disk[blockToMove.index] = null;
    }

    let result = 0;
    for (let i=0; i < disk.length; i++) {
      if (disk[i] === null) {
        break;
      }
      result += i * disk[i];
    }

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

/**
 * https://adventofcode.com/2024/day/11
 *
 * General solution:
 * Dynamic programming
 * Do a depth first search of how many stones will be generated for each stone x levels deep.
 * For each stone calculated, remember how many we found for each level of depth.
 * If we're asked to calculcate the same stone value, the same number of levels deep, just return that cached value.
 */

import AOCBase from "../../AOCBase";


export default class Solution implements AOCBase {
  readonly sampleInput = `125 17`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input.split(' ').map(Number);
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const stones = this.parseInput(input);

    const dp = new Map<number, Map<number, number>>(); // <stone value, num stones at each depth>

    const blink = (stone: number) => {
      const stones = [stone];
      const valueAsString = `${stone}`;
      
      if (stone === 0) {
        stones[0] = 1;
      } else if (valueAsString.length % 2 === 0) {
        stones[0] = +valueAsString.slice(0, valueAsString.length/2);
        stones.push(+valueAsString.slice(valueAsString.length/2));
      } else {
        stones[0] *= 2024;
      }

      return stones;
    };

    const processStone = (stone: number, absoluteDepth: number, relativeDepth: number, targetDepth: number) => {
      const dpMap = dp.get(stone) ?? new Map<number, number>();

      // if we've already calculated this stone, for this many levels deep, just return that calculation
      if (dpMap.has(targetDepth)) {
        return dpMap.get(targetDepth)!;
      }

      let numNewStones = 0;

      const newStones = blink(stone);
      // blinking generated a new stone
      if (newStones.length > 1) {
        numNewStones++;
      }

      if (relativeDepth < targetDepth-1) {
        numNewStones += processStone(newStones[0], absoluteDepth + 1, relativeDepth, targetDepth-1);
        if (newStones.length > 1) {
          numNewStones += processStone(newStones[1], absoluteDepth + 1, relativeDepth, targetDepth-1);
        }
      }

      // remember how many new stones we found for this stone at this many levels deep
      dpMap.set(targetDepth, numNewStones);
      dp.set(stone, dpMap);
      // console.log('stone', stone, 'at depth', absoluteDepth, 'has', numNewStones, 'new stones beneath it');

      return numNewStones;
    }

    const targetDepth = 75;
    let numStones = stones.length;
    for (const stone of stones) {
      numStones += processStone(stone, 0, 0, targetDepth);
    }
    
    return {
      performance: performance.now() - performanceStart, 
      result: numStones
    }
  }
}

// 1                               0
// 1                               1
// 1                              2024
// 2                 20                          24
// 4          2             0           2                 4
// 4         4048           1          4048              8096
// 7      40     48        2024     40     48         80      96 
// 14   4   0  4    8     20  24  4   0  4    8     8    0  9     6
// 16  8096 1 8096 16192 2 0 2 4 8096 1 8096 16192 16192 1 18216 12144

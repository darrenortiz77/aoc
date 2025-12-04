/**
 * https://adventofcode.com/2025/day/03
 *
 * General solution:
 * - start at the left and look at the next few digits.
 * - "Next few" is determined by how far ahead could we look before our choice wouldn't make sense anymore because there wouldn't be enough numbers left in the sequence to fill the battery
 * - evaluate what's the highest value out of all those choices (could be several instances)
 * - record the index of all those highest values
 * - recursively evaluate each possibility
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `987654321111111
811111111111119
234234234234278
818181911112111`;

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
    const initValues = new Array(12).fill(0);

    parsed.forEach(bank => {
      result += recursive([...initValues], 0, 0, 0, bank);
    });

    /**
     * @param values - a fixed-length array representing the 12 batteries we're testing
     * @param place - what slot in the array of batteries we're looking to fill
     * @param idx - what index in the entire bank of available batteries should we start looping from
     * @param highestTotal - the highest possible joltage so far
     * @param bank - the entire bank of batteries
     * @returns highest possible joltage out of all batteries
     */
    function recursive(values: number[], place: number, idx: number, highestTotal: number, bank: string) {
      const highestValues = new Map<number, number[]>();
      let highestValue = -1;

      for (let i=idx; i < bank.length - (11 - place); i++) {
        const battery = +bank.charAt(i);
        
        if (battery >= highestValue) {
          highestValue = battery;
          const indexes = highestValues.get(highestValue) || [];
          highestValues.set(highestValue, [...indexes, i]);
        }
      }

      const indexes = highestValues.get(highestValue)!;

      for (let i=0; i < indexes.length; i++) {
        const n = indexes[i];
        const valuesCopy = [...values];
        valuesCopy[place] = highestValue;
        if (place < 11 && n < bank.length-1) {
          highestTotal = recursive(valuesCopy, place+1, n+1, Math.max(highestTotal, +valuesCopy.join('')), bank);
        } else {
          highestTotal = Math.max(highestTotal, +valuesCopy.join(''));
        }
      }

      return highestTotal;
    }

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

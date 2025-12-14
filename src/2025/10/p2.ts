/**
 * https://adventofcode.com/2025/day/10
 *
 * General solution:
 * - most people use linear algebra...which I don't know
 * - but I found the following solution that is more just "logic" based
 * - https://www.reddit.com/r/adventofcode/comments/1pk87hl/2025_day_10_part_2_bifurcate_your_way_to_victory/?share_id=TwheJWBTKk7Scx3dO--dx&utm_content=2&utm_medium=android_app&utm_name=androidcss&utm_source=share&utm_term=1
 * - however, even after trying to integrate the logic I still couldn't get the memoization to work as expected,
 * - so although I think it's generating the right answer, I'll never truly know since I'm not entering it in AOC to find out.
 * - I don't deserve the star for this one because I barely understand the solution and needed AI to help get it working.
 * - :(
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

    const memo = new Map<string, number>();

    // Find all button combos that achieve target parity (Part 1 logic)
    function findParityCombos(buttons: number[][], targetParity: boolean[]): number[][][] {
      const n = buttons.length;
      const m = targetParity.length;
      const results: number[][][] = [];

      // Try all 2^n subsets of buttons
      for (let mask = 0; mask < (1 << n); mask++) {
        const parity = new Array(m).fill(false);
        const combo: number[][] = [];

        for (let i = 0; i < n; i++) {
          if (mask & (1 << i)) {
            combo.push(buttons[i]);
            buttons[i].forEach(idx => parity[idx] = !parity[idx]);
          }
        }

        // Check if this combo achieves target parity
        if (parity.every((p, i) => p === targetParity[i])) {
          results.push(combo);
        }
      }

      return results;
    }

    function solveBifurcate(buttons: number[][], goal: number[]): number {
      const key = goal.join(',');

      // Base case: all zeros
      if (goal.every(n => n === 0)) {
        return 0;
      }

      // Check memo
      if (memo.has(key)) {
        return memo.get(key)!;
      }

      // Get target parity - we need to toggle positions where goal is ODD
      const targetParity = goal.map(n => n % 2 === 1);

      // Find all button combos that achieve this parity
      const validCombos = findParityCombos(buttons, targetParity);

      let minPresses = Number.POSITIVE_INFINITY;

      for (const combo of validCombos) {
        // Apply this combo: press each button in combo once
        const newGoal = [...goal];
        for (const btn of combo) {
          btn.forEach(idx => newGoal[idx] -= 1);
        }

        // Check for negative values (invalid path)
        if (newGoal.some(n => n < 0)) continue;

        // Now all values should be even - divide by 2
        const halved = newGoal.map(n => n / 2);

        // Recurse!
        const subResult = solveBifurcate(buttons, halved);
        if (subResult < Number.POSITIVE_INFINITY) {
          // Cost = 2 * subResult + combo.length
          minPresses = Math.min(minPresses, 2 * subResult + combo.length);
        }
      }

      memo.set(key, minPresses);
      return minPresses;
    }

    // Process each line
    parsed.forEach(line => {
      const goal = line.match(/\{(.+)\}/)![1].split(',').map(Number);
      const buttons = [...line.matchAll(/\((.+?)\)/g)].map(r => r[1].split(',').map(Number));

      memo.clear(); // Clear memo for each machine (different buttons)
      result += solveBifurcate(buttons, goal);
    });

    return {
      performance: performance.now() - performanceStart,
      result
    }
  }
}

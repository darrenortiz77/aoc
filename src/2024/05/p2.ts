/**
 * https://adventofcode.com/2024/day/5
 *
 * General solution:
 * 1. For each row of updates, loop over all before/after rules.
 * 2. See if before item and after item exists in the update array.
 * 3. If so, check to make sure they're in the correct order. If not, swap them.
 * 4. If swapped, reset for-loop index back to zero to make sure things are still in order.
 * 
 * tldr: brute-force. I hate it. I originally had an elegant directed graph solution that worked with the sample data, but didn't with the full dataset. Oh well.
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    const sections = input.split('\n\n');
    const orderingRules = sections[0].split('\n').map(line => line.split('|').map(n => +n));
    const updates = sections[1].split('\n').map(line => line.split(',').map(n => +n));

    return {orderingRules, updates};
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const {orderingRules, updates} = this.parseInput(input);
    let result = 0;

    updates.forEach(update => {
      const isInOrder = this.sortUpdates(update, orderingRules);

      if (!isInOrder) {
        result += update[Math.floor(update.length/2)];
      }
    });

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }

  private sortUpdates(update: number[], orderingRules: number[][]) {
    let isInOrder = true;

    // loop over each rule and determine if elements within update array are in right order
    for (let i=0; i < orderingRules.length; i++) {
      const [a, b] = orderingRules[i];
      const aIndex = update.indexOf(a);
      const bIndex = update.indexOf(b);

      if (aIndex !== -1 && bIndex !== -1 && bIndex < aIndex) {
        update[bIndex] = a;
        update[aIndex] = b;
        isInOrder = false;
        i = 0;
      }
    }

    return isInOrder;
  }
}

/**
 * https://adventofcode.com/2024/day/5
 *
 * General solution:
 * 1. To make ordering lookups faster, parse the ordering logic into: Map<number, Set<number>>.
 * For example (in pseudcode):
 * {
 *  97: Set(13, 61, 47, 29, 53)
 *  75: Set(29, 53, 47)
 *  ...
 * }
 * 2. Loop over each page in the update list and check each following page to make sure it doesn't have the previous page in its list.
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

    // orderingRules is just a simple array of [number, number][]. Let's organize that better to make queries later on faster.
    const orderingLogic = new Map<number, Set<number>>();
    orderingRules.forEach(([p0,p1]) => {
      const p0Set = orderingLogic.get(p0);
      if (!p0Set) {
        orderingLogic.set(p0, new Set([p1]));
      } else {
        p0Set.add(p1);
      }
    });

    return {orderingLogic, updates};
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const {orderingLogic, updates} = this.parseInput(input);
    let result = 0;

    updates.forEach(update => {
      let inOrder = true;

      for (let i=0; i < update.length-1; i++) {
        const currentPage = update[i];
        const followingPages = update.slice(i+1);
        for (let n=0; n < followingPages.length; n++) {
          const orderSet = orderingLogic.get(followingPages[n]);
          if (orderSet && orderSet.has(currentPage)) {
            inOrder = false;
            break;
          }
        }

        if (!inOrder) {
          break;
        }
      }

      if (inOrder) {
        result += update[Math.floor(update.length/2)];
      }
    });

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

/**
 * https://adventofcode.com/2015/day/17
 *
 * General solution:
 */

import AOCBase from "../../AOCBase";
import { backtracker } from "../../utils/backtrack";

type Bucket = {
  value: number;
}

export default class Solution implements AOCBase {
  readonly sampleInput = `20
15
10
5
5`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }
    
    const buckets = new Set<Bucket>();
    input.split('\n').forEach(n => {
      buckets.add({value: +n});
    });
    return buckets;
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const buckets = this.parseInput(input);
    const valids = new Set<Set<Bucket>>();
    const target = 150;

    const dfs = (temp: Set<Bucket>, remaining: Set<Bucket>) => {
      const total = [...temp].reduce((sum, bucket) => sum + bucket.value, 0);

      if (total > target) {
        return;
      } else if (total === target) {
        valids.add(temp);
        return;
      }

      for (const bucket of remaining) {
        const remainingClone = new Set(remaining);
        remainingClone.delete(bucket);
        const tempClone = new Set(temp);
        tempClone.add(bucket);
        dfs(tempClone, remainingClone);
      }
    }
    
    dfs(new Set(), buckets);

    return {
      performance: performance.now() - performanceStart, 
      result: valids.size
    }
  }
}

function isNotDupe(buckets: Set<Bucket>, valids: Set<Set<Bucket>>) {
  for (const validSet of valids) {
    const validClone = new Set(validSet);

    for (const bucket of buckets) {
      validClone.delete(bucket);
    }

    if (validClone.size === 0) {
      return false;
    }
  }

  return true;
}

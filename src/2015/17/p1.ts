/**
 * https://adventofcode.com/2015/day/17
 *
 * General solution:
 */

import AOCBase from "../../AOCBase";

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
    
    return input.split('\n').map((bucket, i) => `${i}_${bucket}`);
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const buckets = this.parseInput(input);
    const valids = new Set<string>();
    const target = !input ? 25 : 150;

    const dfs = (temp: string[], idx: number) => {
      const total = [...temp].reduce((sum, bucket) => sum + Number(bucket.split('_')[1]), 0);

      if (total > target) {
        return;
      } else if (total === target) {
        temp.sort((a, b) => Number(a.split('_')[0]) - Number(b.split('_')[0]));
        valids.add(temp.join(','));
        return;
      }

      for (let i=idx+1; i < buckets.length; i++) {
        const bucket = buckets[i];
        dfs([...temp, bucket], i);
      }
    }
    
    dfs([], -1);

    return {
      performance: performance.now() - performanceStart, 
      result: valids.size
    }
  }
}

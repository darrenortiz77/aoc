/**
 * https://adventofcode.com/2025/day/11
 *
 * General solution:
 * - DFS + memoization, but...
 * - needed to break-up the path into various chunks
 * - so instead of doing `svr` to `out` we need to do svr -> fft, fft -> dac, dac -> out.
 * - and since we don't know the order of fft vs dac, need to also do svr -> dac, dac -> fft -> fft -> out
 * - then multiply the number of paths found per segment together
 */

import AOCBase from "../../AOCBase";
import { memoize } from "../../utils/memoize";

export default class Solution implements AOCBase {
  readonly sampleInput = `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    const graph = new Map<string, string[]>();
    input.split('\n').forEach(line => {
      const parts = line.split(': ');
      graph.set(parts[0], parts[1].split(' '));
    });

    return graph;
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const graph = this.parseInput(input);
    let result = 0;

    // logic here
    const dfs = memoize((node: string, target: string) => {
      if (node === 'out' && target !== 'out') {
        return 0;
      }

      if (node === target) {
        return 1;
      }

      let total = 0;
      const edges = graph.get(node);
      edges?.forEach(edge => {
        total += dfs(edge, target);
      });

      return total;
    });

    const totalSvrToFft = dfs('svr', 'fft');
    const totalSvrToDac = dfs('svr', 'dac');
    const totalFftToDac = dfs('fft', 'dac');
    const totalDacToFft = dfs('dac', 'fft');
    const totalFftToOut = dfs('fft', 'out');
    const totalDacToOut = dfs('dac', 'out');

    result = Math.max(totalSvrToFft * totalFftToDac * totalDacToOut, totalSvrToDac * totalDacToFft * totalFftToOut);

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

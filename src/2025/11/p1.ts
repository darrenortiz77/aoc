/**
 * https://adventofcode.com/2025/day/11
 *
 * General solution:
 * - basic DFS
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`;

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
    dfs('you');

    function dfs(node: string) {
      if (node === 'out') {
        result++;
        return;
      }

      const edges = graph.get(node);
      edges?.forEach(edge => dfs(edge));
    }

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

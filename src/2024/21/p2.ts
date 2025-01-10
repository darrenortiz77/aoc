/**
 * https://adventofcode.com/2024/day/21
 *
 * General solution:
 * Recursion recursion recursion. And memoization.
 * After countless hours I basically had to resort to cheating and leverage the pseudocode posted here:
 * https://old.reddit.com/r/adventofcode/comments/1hjx0x4/2024_day_21_quick_tutorial_to_solve_part_2_in/
 */

/*
Calculate cost of A->0, A->1, A->2, A->3, ....
Calculate cost of 1->0, 1->2, 1->3, 1->A, ....
Calculate cost of 2->0, 2->1, 2->3, 2->A, ....
...
*/
import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `029A
980A
179A
456A
379A`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input.split('\n');
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const doorcodes: string[] = this.parseInput(input);

    const doorcodeMap: Record<string, string[]> = {
      'A:A': [''],
      'A:0': ['<'],
      'A:1': ['^<<'],
      'A:2': ['<^', '^<'],
      'A:3': ['^'],
      'A:4': ['^^<<'],
      'A:5': ['<^^', '^^<'],
      'A:6': ['^^'],
      'A:7': ['^^^<<'],
      'A:8': ['<^^^', '^^^<'],
      'A:9': ['^^^'],
      '0:A': ['>'],
      '0:0': [''],
      '0:1': ['^<<'],
      '0:2': ['^'],
      '0:3': ['>^', '^>'],
      '0:4': ['^^<'],
      '0:5': ['^^'],
      '0:6': ['>^^', '^^>'],
      '0:7': ['^^^<'],
      '0:8': ['^^^'],
      '0:9': ['>^^^', '^^^>'],
      '1:A': ['>>v'],
      '1:0': ['>v'],
      '1:1': [''],
      '1:2': ['>'],
      '1:3': ['>>'],
      '1:4': ['^'],
      '1:5': ['>^', '^>'],
      '1:6': ['>>^', '^>>'],
      '1:7': ['^^'],
      '1:8': ['^^>', '>^^'],
      '1:9': ['>>^^', '^^>>'],
      '2:A': ['>v', 'v>'],
      '2:0': ['v'],
      '2:1': ['<'],
      '2:2': [''],
      '2:3': ['>'],
      '2:4': ['<^', '^<'],
      '2:5': ['^'],
      '2:6': ['>^', '^>'],
      '2:7': ['<^^', '^^<'],
      '2:8': ['^^'],
      '2:9': ['^^>', '>^^'],
      '3:A': ['v'],
      '3:0': ['v<', '<v'],
      '3:1': ['<<'],
      '3:2': ['<'],
      '3:3': [''],
      '3:4': ['<<^', '^<<'],
      '3:5': ['<^', '^<'],
      '3:6': ['^'],
      '3:7': ['<<^^', '^^<<'],
      '3:8': ['<^^', '^^<'],
      '3:9': ['^^'],
      '4:A': ['>>vv'],
      '4:0': ['>vv'],
      '4:1': ['v'],
      '4:2': ['>v', 'v>'],
      '4:3': ['>>v', 'v>>'],
      '4:4': [''],
      '4:5': ['>'],
      '4:6': ['>>'],
      '4:7': ['^'],
      '4:8': ['>^', '^>'],
      '4:9': ['>>^', '^>>'],
      '5:A': ['>vv', 'vv>'],
      '5:0': ['vv'],
      '5:1': ['v<', '<v'],
      '5:2': ['v'],
      '5:3': ['>v', 'v>'],
      '5:4': ['<'],
      '5:5': [''],
      '5:6': ['>'],
      '5:7': ['<^', '^<'],
      '5:8': ['^'],
      '5:9': ['>^', '^>'],
      '6:A': ['vv'],
      '6:0': ['<vv', 'vv<'],
      '6:1': ['v<<', '<<v'],
      '6:2': ['<v', 'v<'],
      '6:3': ['v'],
      '6:4': ['<<'],
      '6:5': ['<'],
      '6:6': [''],
      '6:7': ['^<<', '<<^'],
      '6:8': ['^<', '<^'],
      '6:9': ['^'],
      '7:A': ['>>vvv'],
      '7:0': ['>vvv'],
      '7:1': ['vv'],
      '7:2': ['>vv', 'vv>'],
      '7:3': ['>>vv', 'vv>>'],
      '7:4': ['v'],
      '7:5': ['>v', 'v>'],
      '7:6': ['>>v', 'v>>'],
      '7:7': [''],
      '7:8': ['>'],
      '7:9': ['>>'],
      '8:A': ['vv>', '>vv'],
      '8:0': ['vvv'],
      '8:1': ['<vv', 'vv<'],
      '8:2': ['vv'],
      '8:3': ['vv>', '>vv'],
      '8:4': ['<v', 'v<'],
      '8:5': ['v'],
      '8:6': ['>v', 'v>'],
      '8:7': ['<'],
      '8:8': [''],
      '8:9': ['>'],
      '9:A': ['vvv'],
      '9:0': ['vvv<', '<vvv'],
      '9:1': ['vv<<', '<<vv'],
      '9:2': ['vv<', '<vv'],
      '9:3': ['vv'],
      '9:4': ['v<<', '<<v'],
      '9:5': ['v<', '<v'],
      '9:6': ['v'],
      '9:7': ['<<'],
      '9:8': ['<'],
      '9:9': [''],
    };

    const directionMap: Record<string, string[]> = {
      'A:A': [''],
      'A:^': ['<'],
      'A:<': ['v<<'],
      'A:v': ['<v', 'v<'],
      'A:>': ['v'],
      '^:A': ['>'],
      '^:^': [''],
      '^:<': ['v<'],
      '^:v': ['v'],
      '^:>': ['v>', '>v'],
      '<:A': ['>>^'],
      '<:^': ['>^'],
      '<:<': [''],
      '<:v': ['>'],
      '<:>': ['>>'],
      'v:A': ['>^', '^>'],
      'v:^': ['^'],
      'v:<': ['<'],
      'v:v': [''],
      'v:>': ['>'],
      '>:A': ['^'],
      '>:^': ['^<', '<^'],
      '>:<': ['<<'],
      '>:v': ['<'],
      '>:>': [''],
    }
    
    let result = 0;

    const cache = new Map<string, number>();
    
    doorcodes.forEach(code => {
      function buildSeq(keys: string, index: number, prevKey: string, currPath: string, results: Set<string>, map: Record<string, string[]>) {
        if (index === keys.length) {
          results.add(currPath);
          return;
        }

        const prevToNextPaths: string[] = map[`${prevKey}:${keys.charAt(index)}`]!;

        prevToNextPaths.forEach(p => {
          buildSeq(keys, index+1, keys[index], currPath + p + 'A', results, map);
        });
      }

      function shortestSeq(keys: string, depth: number, total: number) {
        if (depth === 0) {
          return keys.length;
        }

        const cacheKey = `${depth}_${keys}`;
        if (cache.has(cacheKey)) {
          return cache.get(cacheKey)!;
        }

        // split the keys into subKeys at 'A'
        const subkeys = keys.slice(0, keys.length-1).split('A').map(sub => `${sub}A`);
        
        // foreach subKey in the subKeys list
        subkeys.forEach(subkey => {
          // build the sequence list for the subKey (buildSeq)
          const subkeyResults = new Set<string>();
          buildSeq(subkey, 0, 'A', '', subkeyResults, directionMap);
          
          let minimum = Infinity;

          // for each sequence in the list
          subkeyResults.forEach(subkeyResult => {
            // find the minimum of shortestSeq(sequence, depth-1, cache)
            const nextLevelResults = shortestSeq(subkeyResult, depth-1, 0);
            if (nextLevelResults < minimum) {
              minimum = nextLevelResults;
            }
          });

          total += minimum;
        });

        cache.set(cacheKey, total);

        return total;
      }

      const initialSeqs = new Set<string>();
      buildSeq(code, 0, 'A', '', initialSeqs, doorcodeMap);

      let shortest = Infinity;
      initialSeqs.forEach(seq => {
        const total = shortestSeq(seq, 25, 0);
        if (total < shortest) {
          shortest = total;
        }
      });

      const doorcodeNum = parseInt(code.replace('A', ''));
      result += shortest * doorcodeNum;
    });

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

/**
 * https://adventofcode.com/2024/day/21
 *
 * General solution:
 * Ugly DFS to get all possible ways you can enter the code.
 * Pass those possible paths down the chain...which grow exponentially!
 * This will not work for part 2. :(
 */

import AOCBase from "../../AOCBase";

type Directive = '^'|'v'|'<'|'>'|'A';
type Code = string[];
type Keypad = (string|null)[][];
type KeypadMap = Map<string|null, Point>;
type Point = [number, number];

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

    return input.split('\n').map(line => line.split(''));
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const doorcodes: Code[] = this.parseInput(input);

    const doorKeypad: Keypad = [
      ['7', '8', '9'],
      ['4', '5', '6'],
      ['1', '2', '3'],
      [null, '0', 'A'],
    ];
    const doorKeypadMap: KeypadMap = new Map();
    for (let y=0; y < doorKeypad.length; y++) {
      for (let x=0; x < doorKeypad[0].length; x++) {
        doorKeypadMap.set(doorKeypad[y][x], [x, y]);
      }
    }

    const robotKeypad: Keypad = [
      [null, '^', 'A'],
      ['<', 'v', '>'],
    ];
    const robotKeypadMap: KeypadMap = new Map();
    for (let y=0; y < robotKeypad.length; y++) {
      for (let x=0; x < robotKeypad[0].length; x++) {
        robotKeypadMap.set(robotKeypad[y][x], [x, y]);
      }
    }

    const pointers: Point[] = [[2, 3], [2,0], [2,0]];
    
    let result = 0;
    
    for (const code of doorcodes) {
      const doorcode = new Set<string>();
      doorcode.add(code.join(''));
      const directions1 = getPossiblePaths(doorcode, doorKeypad, doorKeypadMap, pointers[0]);
      const directions2 = getPossiblePaths(directions1, robotKeypad, robotKeypadMap, pointers[1]);
      const directions3 = getPossiblePaths(directions2, robotKeypad, robotKeypadMap, pointers[2]);
      const codeAsDigit = parseInt(code.join(''), 10);
      let shortest = Infinity;
      for (const path of directions3) {
        shortest = Math.min(shortest, path.length);
      }
      result += shortest * codeAsDigit;
    }
    
    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

function getPossiblePaths(destinations: Set<string>, keypad: Keypad, keypadMap: KeypadMap, pointer: Point) {
  let paths = new Set<string>();

  const dfs = (current: Point, code: string[], index: number, path: Directive[]) => {
    if (index === code.length) {
      paths.add(path.join(''));
      return;
    }

    const dest = keypadMap.get(code[index])!;
    const [x, y] = current;
    const dx = dest[0] - x;
    const dy = dest[1] - y;

    if (dx === 0 && dy === 0) {
      dfs(current, code, index + 1, [...path, 'A']);
      return;
    }

    if (dx < 0 && keypad[y][x-1] !== null) {
      dfs([x-1, y], code, index, [...path, '<']);
    }
    if (dx > 0 && keypad[y][x+1] !== null) {
      dfs([x+1, y], code, index, [...path, '>']);
    }
    if (dy < 0 && keypad[y-1][x] !== null) {
      dfs([x, y-1], code, index, [...path, '^']);
    }
    if (dy > 0 && keypad[y+1][x] !== null) {
      dfs([x, y+1], code, index, [...path, 'v']);
    }
  };

  for (const destPath of destinations) {
    dfs([...pointer], destPath.split(''), 0, []);
  }

  return paths;
}

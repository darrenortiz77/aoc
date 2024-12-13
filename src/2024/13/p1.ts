/**
 * https://adventofcode.com/2024/day/13
 *
 * General solution:
 * Backtracking
 */

import AOCBase from "../../AOCBase";

type XY = {x:number; y:number};

class ClawMachine {
  static readonly COST_A = 3;
  static readonly COST_B = 1;
  static readonly MAX_BTN_PRESSES = 100;

  public a: XY = {x: 0, y: 0};
  public b: XY = {x: 0, y: 0};
  public prize: XY = {x: 0, y: 0};
  
  constructor() {

  }

  public findCheapest() {
    const validCombinations = this.findValidBtnCombinations();
    const costs: number[] = [];

    for (const btnPresses of validCombinations) {
      const cost = btnPresses.reduce((sum, val) => sum += val === 'a' ? ClawMachine.COST_A : ClawMachine.COST_B, 0);
      costs.push(cost);
    }

    return costs.length > 0 ? Math.min(...costs) : 0;
  }

  private findValidBtnCombinations() {
    const candidates = ['a', 'b'];
    const temp: string[] = [];
    const validCombinations: string[][] = [];

    const backtrack = (idx: number, targetX: number, targetY: number, aPresses: number, bPresses: number) => {
      // perfect combination. Add it.
      if (targetX === 0 && targetY === 0) {
        return validCombinations.push([...temp]);
      }

      // we overshot. Invalid.
      if (targetX < 0 || targetY < 0) {
        return;
      }

      // too many button presses
      if (aPresses > ClawMachine.MAX_BTN_PRESSES || bPresses > ClawMachine.MAX_BTN_PRESSES) {
        return;
      }

      // ran out of possibilities, move on
      if (idx === candidates.length) {
        return;
      }

      const {x, y} = candidates[idx] === 'a' ? this.a : this.b;
      aPresses = candidates[idx] === 'a' ? aPresses++ : aPresses;
      bPresses = candidates[idx] === 'b' ? bPresses++ : bPresses;

      temp.push(candidates[idx]);
      backtrack(idx, targetX - x, targetY - y, aPresses, bPresses);
      temp.pop();
      backtrack(idx+1, targetX, targetY, 0, 0);
    };

    backtrack(0, this.prize.x, this.prize.y, 0, 0);
    
    return validCombinations;
  }
}

export default class Solution implements AOCBase {
  readonly sampleInput = `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    const clawMachines: ClawMachine[] = [];
    let clawMachine = new ClawMachine();
    clawMachines.push(clawMachine);

    input.split('\n').forEach(line => {
      if (line === '') {
        clawMachine = new ClawMachine();
        clawMachines.push(clawMachine);
      } else {
        const matches = line.match(/(.+): X.(\d+), Y.(\d+)/)!;
        const xy = {x: +matches[2], y: +matches[3]};
        
        switch (matches[1]) {
          case 'Button A':
            clawMachine.a = xy;
            break;
          case 'Button B':
            clawMachine.b = xy;
            break;
          case 'Prize':
            clawMachine.prize = xy;
            break;
        }
      }
    });

    return clawMachines;
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const clawMachines = this.parseInput(input);
    let result = 0;

    for (const clawMachine of clawMachines) {
      result += clawMachine.findCheapest();
    }

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

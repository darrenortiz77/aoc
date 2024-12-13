/**
 * https://adventofcode.com/2024/day/13
 *
 * General solution:
 * Some linear algebra math I don't even slightly understand.
 * Essentially fully cheated by reviewing the following post about Cramer's Law:
 * https://old.reddit.com/r/adventofcode/comments/1hd7irq/2024_day_13_an_explanation_of_the_mathematics/
 */

import AOCBase from "../../AOCBase";

type XY = {x:number; y:number};

class ClawMachine {
  static readonly COST_A = 3;
  static readonly COST_B = 1;

  public a: XY = {x: 0, y: 0};
  public b: XY = {x: 0, y: 0};
  public prize: XY = {x: 0, y: 0};
  
  constructor() {

  }

  public findCheapest() {
    const offset = 10000000000000;
    const prize = [this.prize.x + offset, this.prize.y + offset];
    const det = this.a.x * this.b.y - this.a.y * this.b.x;
    const A = (prize[0] * this.b.y - prize[1] * this.b.x) / det;
    const B = (this.a.x * prize[1] - this.a.y * prize[0]) / det;
    if (A === Math.round(A) && B === Math.round(B) && this.a.x * A + this.b.x * B === prize[0] && this.a.y * A + this.b.y * B === prize[1]) {
      return A * ClawMachine.COST_A + B * ClawMachine.COST_B;
    } else {
      return 0;
    }
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
            clawMachine.prize = {x: xy.x, y: xy.y};
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

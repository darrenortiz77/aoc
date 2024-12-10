/**
 * https://adventofcode.com/2015/day/7
 *
 * General solution:
 * Recursion
 */

import AOCBase from "../../AOCBase";

class Wire {
  private value: number | null = null;

  constructor(private operator: string | null, private inputs: string[], private wires: Map<string, Wire>) {

  }

  public getValue() {
    if (this.value === null) {
      this.value = this.calculate();
    }

    return this.value;
  }

  private calculate() {
    let value = 0;
  
    switch (this.operator) {
      case 'AND':
        value = this.parseInput(this.inputs[0]) & this.parseInput(this.inputs[1]);
        break;
      
      case 'OR':
        value = this.parseInput(this.inputs[0]) | this.parseInput(this.inputs[1]);
        break;
      
      case 'LSHIFT':
        value = this.parseInput(this.inputs[0]) << this.parseInput(this.inputs[1]);
        break;

      case 'RSHIFT':
        value = this.parseInput(this.inputs[0]) >> this.parseInput(this.inputs[1]);
        break;
      
      case 'NOT':
        value = ~this.parseInput(this.inputs[0]);
        break;
      
      default:
        value = this.parseInput(this.inputs[0]);
    }

    return this.uint16(value);
  }

  private parseInput(input: string) {
    return !isNaN(parseInt(input)) ? +input : this.wires.get(input)!.getValue();
  }

  private uint16 (n: number) {
    return n & 0xFFFF;
  }
}

export default class Solution implements AOCBase {
  readonly sampleInput = `123 -> x
456 -> y
x AND y -> d
x OR y -> e
x LSHIFT 2 -> f
y RSHIFT 2 -> g
NOT x -> h
NOT y -> a`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input.split('\n').map(line => {
      const [instructions, dest] = line.split(' -> ');
      const inputs: string[] = [];
      let operator: string | null = null;
      const matches1 = instructions.match(/(.+) (AND|OR|LSHIFT|RSHIFT) (.+)/);
      const matches2 = instructions.match(/NOT (.+)/);

      if (matches1) {
        inputs.push(matches1[1]);
        inputs.push(matches1[3]);
        operator = matches1[2];
      } else if (matches2) {
        inputs.push(matches2[1]);
        operator = 'NOT';
      } else {
        inputs.push(instructions);
      }

      return {dest, operator, inputs};
    });
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const instructions = this.parseInput(input);
    const wires = new Map<string, Wire>();

    for (let i=0; i < instructions.length; i++) {
      const {dest, operator, inputs} = instructions[i];
      wires.set(dest, new Wire(operator, inputs, wires));
    }

    let result = wires.get('a')?.getValue()!;

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

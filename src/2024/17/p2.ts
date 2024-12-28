/**
 * https://adventofcode.com/2024/day/17
 *
 * General solution:
 * Black magic. Needed a TON of help from Reddit.
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    const registers: number[] = new Array(3);
    let program: number[] = [];

    input.split('\n').forEach((line, i) => {
      if (i <= 2) {
        registers[i] = +line.match(/\d+/)![0];
      } else if (i === 4) {
        program = line.split(': ')[1].split(',').map(Number);
      }
    });

    return {registers, program};
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const {registers, program} = this.parseInput(input);

    let a = 0;
    let result: number[] = [];

    for (let i=program.length-1; i >= 0; i--) {
      a *= 8;

      const programToMatch = program.slice(i).join(',');
      let shortCircuit = 0;
      
      do {
        result = runProgram([a, 0, 0], program);
        a++;
        shortCircuit++;
      } while (result.join(',') !== programToMatch)
      a--;
    }

    return {
      performance: performance.now() - performanceStart, 
      result: `${a} = ${result}`
    }
  }
}

function runProgram(registers: number[], program: number[]) {
  const outputs: number[] = [];

  for (let i=0; i < program.length; i += 2) {
    const opCode = program[i];
    const operand = program[i+1];

    switch (opCode) {
      case 0: {
        adv(operand, registers);
        break;
      }
      case 1: {
        bxl(operand, registers);
        break;
      }
      case 2: {
        bst(operand, registers);
        break;
      }
      case 3: {
        if (registers[0] !== 0) {
          i = operand - 2;
        }
        break;
      }
      case 4: {
        bxc(registers);
        break;
      }
      case 5: {
        out(operand, registers, outputs);
        break;
      }
      case 6: {
        bdv(operand, registers);
        break;
      }
      case 7: {
        cdv(operand, registers);
        break;
      }
    }
  }

  return outputs;
}

function adv(operand: number, registers: number[]) {
  registers[0] = Math.floor(registers[0] / Math.pow(2, getComboOperandValue(operand, registers)));
}

function bxl(operand: number, registers: number[]) {
  registers[1] = Number(BigInt(registers[1]) ^ BigInt(operand));
}

function bst(operand: number, registers: number[]) {
  registers[1] = getComboOperandValue(operand, registers) % 8;
}

function bxc(registers: number[]) {
  registers[1] = Number(BigInt(registers[1]) ^ BigInt(registers[2]));
}

function out(operand: number, registers: number[], outputs: number[]) {
  const opValue = getComboOperandValue(operand, registers);
  const modulo = opValue % 8;
  // console.group();
  // console.log('operand', operand);
  // console.log('opValue', opValue);
  // console.log('modulo', modulo);
  // console.groupEnd();
  outputs.push(modulo);
}

function bdv(operand: number, registers: number[]) {
  registers[1] = Math.floor(registers[0] / Math.pow(2, getComboOperandValue(operand, registers)));
}

function cdv(operand: number, registers: number[]) {
  registers[2] = Math.floor(registers[0] / Math.pow(2, getComboOperandValue(operand, registers)));
}

function getComboOperandValue(operand: number, registers: number[]) {
  switch (operand) {
    case 0:
    case 1:
    case 2:
    case 3: {
      return operand;
    }
    case 4: {
      return registers[0];
    }
    case 5: {
      return registers[1];
    }
    case 6: {
      return registers[2];
    }
    case 7: {
      throw new Error('7 is not a valid combo operand');
    }
  }

  return operand;
}
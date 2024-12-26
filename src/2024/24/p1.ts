/**
 * https://adventofcode.com/2024/day/24
 *
 * General solution:
 * Basic recursion to get the value of all Z wires.
 * Add values of z wires to an array, reverse the arrary and convert to string.
 * Parse int with radix of 2.
 */

import AOCBase from "../../AOCBase";

type Wire = {
  name: string;
  value: number|null;
  input0?: Wire;
  input1?: Wire;
  operator?: 'XOR'|'OR'|'AND';
};

export default class Solution implements AOCBase {
  readonly sampleInput = `x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    const parts = input.split('\n\n');

    const wires = new Map<string, Wire>();
    parts[0].split('\n').forEach(line => {
      const [wire, value] = line.split(': ');
      wires.set(wire, {name: wire, value: +value});
    });

    parts[1].split('\n').forEach(line => {
      const [input0, operator, input1, ,output] = line.split(' ');
      const input0Wire: Wire = wires.get(input0) ?? {name: input0, value: null};
      const input1Wire: Wire = wires.get(input1) ?? {name: input1, value: null};
      const outputWire: Wire = wires.get(output) ?? {name: output, value: null};
      outputWire.operator = operator as Wire['operator'];
      outputWire.input0 = input0Wire;
      outputWire.input1 = input1Wire;

      if (!wires.has(input0)) {
        wires.set(input0, input0Wire);
      }
      if (!wires.has(input1)) {
        wires.set(input1, input1Wire);
      }
      if (!wires.has(output)) {
        wires.set(output, outputWire);
      }
    });

    return wires;
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const wires = this.parseInput(input);
    
    // solve all "z" wires
    let zIndex = 0;
    let zWire = wires.get('z00');
    let zResults: number[] = [];
    while (zWire) {
      zResults.push(getWireValue(zWire, wires));
      zIndex++;
      const indexStr = `${zIndex}`.padStart(2, '0');
      zWire = wires.get(`z${indexStr}`);
    }

    let result = parseInt(zResults.reverse().join(''), 2);

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

function getWireValue(wire: Wire, wires: Map<string, Wire>) {
  if (wire.value !== null) {
    return wire.value;
  }

  const input0Value = getWireValue(wire.input0!, wires)!;
  const input1Value = getWireValue(wire.input1!, wires)!;

  let value: number;

  switch (wire.operator) {
    case 'AND': {
      value = input0Value & input1Value;
      break;
    }
    case 'OR': {
      value = input0Value | input1Value;
      break;
    }
    case 'XOR': {
      value = input0Value ^ input1Value;
      break;
    }
  }

  wire.value = value!;

  return wire.value;
}

/**
 * https://adventofcode.com/2024/day/24
 *
 * General solution:
 * Been at this so long I could barely explain.
 * The solution should end up being a Ripple Carry Adder which has a very specific structure.
 * Walk through the nodes and gates making assumptions along the way regarding what the next node/gate/wire should be.
 * If it's wrong, log out the error.
 * Take a look at a GraphViz'ed visualiation of the circuitry.
 * Find the error and swap the wrong wires in the input. (Make note of which needed to be swapped).
 * Run it again and repeat until there's no more errors.
 */

import AOCBase from "../../AOCBase";

type Node = {
  name: string;
  type: 'input'|'output'|'wire'|'gate'|'sum'|'carry';
  outputs: Node[];
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
    
    let highestInput = 0;

    const nodes = new Map<string, Node>();
    parts[0].split('\n').forEach(line => {
      const [wire] = line.split(': ');
      nodes.set(wire, {name: wire, type: 'input', outputs: []});
      highestInput = Math.max(highestInput, parseInt(wire.slice(1)));
    });

    parts[1].split('\n').forEach(line => {
      const [input0, operator, input1, ,output] = line.split(' ');
      const gate: Node = {name: `${operator}_${input0}_${input1}`, type: 'gate', outputs: []};
      const outputNode = nodes.get(output) ?? {name: output, type: 'input', outputs: []};
      const input0Node = nodes.get(input0) ?? {name: input0, type: 'wire', outputs: []};
      const input1Node = nodes.get(input1) ?? {name: input1, type: 'wire', outputs: []};
      if (output.indexOf('z') === 0) {
        outputNode.type = 'output';
      }
      gate.outputs.push(outputNode);
      input0Node.outputs.push(gate);
      input1Node.outputs.push(gate);
      nodes.set(output, outputNode);
      nodes.set(input0, input0Node);
      nodes.set(input1, input1Node);
      nodes.set(`${operator}_${input0}_${input1}`, gate);
    });

    return {nodes, highestInput};
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const {nodes, highestInput} = this.parseInput(input);

    // build ripple carry adder
    let a = nodes.get('x00');
    let b = nodes.get('y00');
    let abAndGate = nodes.get(`AND_x00_y00`) ?? nodes.get(`AND_y00_x00`);
    let abXorGate = nodes.get(`XOR_x00_y00`) ?? nodes.get(`XOR_y00_x00`);
    let sum = abXorGate?.outputs[0];
    let carry = abAndGate?.outputs[0];
    sum!.type = 'sum';
    carry!.type = 'carry';

    for (let i=1; i <= highestInput; i++) {
      try {
        const digit = `${i}`.padStart(2, '0');
        a = nodes.get(`x${digit}`);
        b = nodes.get(`y${digit}`);
        
        const abXorGate = nodes.get(`XOR_${a?.name}_${b?.name}`) ?? nodes.get(`XOR_${b?.name}_${a?.name}`);
        if (!abXorGate) {
          throw new Error(`Couldn't find abXorGate for ${a!.name} and ${b!.name}`);
        }

        const abcXorGate = nodes.get(`XOR_${abXorGate?.outputs[0].name}_${carry?.name}`) ?? nodes.get(`XOR_${carry?.name}_${abXorGate?.outputs[0].name}`);
        if (!abcXorGate) {
          throw new Error(`Couldn't find abcXorGate for ${abXorGate!.outputs[0].name} and ${carry!.name}`);
        }

        sum = abcXorGate?.outputs[0];
        abcXorGate!.outputs[0].type = 'sum';

        const abAndGate = nodes.get(`AND_${a?.name}_${b?.name}`) ?? nodes.get(`AND_${b?.name}_${a?.name}`);
        if (!abAndGate) {
          throw new Error(`Couldn't find abAndGate for ${a!.name} and ${b!.name}`);
        }

        const abcAndGate = nodes.get(`AND_${abXorGate?.outputs[0].name}_${carry?.name}`) ?? nodes.get(`AND_${carry?.name}_${abXorGate?.outputs[0].name}`);
        if (!abcAndGate) {
          throw new Error(`Couldn't find abcAndGate for ${abXorGate!.outputs[0].name} and ${carry!.name}`);
        }

        const abcOrGate = nodes.get(`OR_${abcAndGate?.outputs[0].name}_${abAndGate?.outputs[0].name}`) ?? nodes.get(`OR_${abAndGate?.outputs[0].name}_${abcAndGate?.outputs[0].name}`);
        if (!abcOrGate) {
          throw new Error(`Couldn't find abcOrGate for ${abcAndGate!.outputs[0].name} and ${abAndGate?.outputs[0].name}`);
        }

        carry = abcOrGate?.outputs[0];
        abcOrGate!.outputs[0].type = 'carry';

      } catch (err) {
        console.log('a', a);
        console.log('b', b);
        console.log('carry', carry);
        console.error(err);
      }
    }

    return {
      performance: performance.now() - performanceStart, 
      result: 0
    }
  }
}

/**
 * https://adventofcode.com/2024/day/7
 *
 * General solution:
 * 1. Create a graph of all possible combination of operators.
 * 2. DFS through the graph and test each combination until we get the sum.
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;

  static readonly OPERATORS = ['+', '*'];

  private operatorGraphs = new Map<number, Node>();

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input.split('\n').map(line => {
      const parts = line.split(': ');
      const total = +parts[0];
      const operands = parts[1].split(' ').map(n => +n);
      return {total, operands};
    });
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const equations = this.parseInput(input);
    let result = 0;

    equations.forEach(equation => {
      result += this.checkEquation(equation) ? equation.total : 0;
    });

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }

  private checkEquation({total, operands}: {total: number, operands: number[]}) {
    // create a graph for this number of operands if it doesn't exist already
    // we're memoizing the graphs here because it'll be the same graph each time the number of operands is the same
    // no need to keep re-creating them
    let graph = this.operatorGraphs.get(operands.length-1);
    if (!graph) {
      graph = this.createOperatorGraph(operands.length-1);
      this.operatorGraphs.set(operands.length-1, graph);
    }

    let isValid = false;

    const dfs = (node: Node, operators: string[]) => {
      // early escape if we already found the answer
      if (isValid) {
        return;
      }

      // keep digging down through the graph until we have enough operations to work with
      if (node.neighbors.length) {
        for (const neighbor of node.neighbors) {
          dfs(neighbor, [...operators, neighbor.value!]);
        }
      // we have enough operations. Test it.
      } else {
        const valid = this.isValid(total, operators, operands);
        if (valid) {
          isValid = true;
          return;
        }
      }
    };

    dfs(graph!, []);

    return isValid;
  }

  private createOperatorGraph(depth: number) {
    const root = new Node(null);
    const stack = [{node: root, level: 1}];

    while (stack.length) {
      const {node: current, level} = stack.shift()!;

      for (const operator of Solution.OPERATORS) {
        const node = new Node(operator);
        current?.neighbors.push(node);

        if (level < depth) {
          stack.push({node, level: level + 1});
        }
      }
    }

    return root;
  }

  private isValid(target: number, operations: string[], operands: number[]) {
    let sum = operands[0];

    for (let i=0; i < operations.length; i++) {
      switch (operations[i]) {
        case '+':
          sum += operands[i+1];
        break;
        case '*':
          sum *= operands[i+1];
        break;
      }

      if (sum > target) {
        return false;
      }
    }

    return sum === target;
  }
}

class Node {
  public neighbors: Node[] = [];

  constructor (public value: string | null) {

  }
}
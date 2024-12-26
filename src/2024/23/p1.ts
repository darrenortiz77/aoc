/**
 * https://adventofcode.com/2024/day/23
 *
 * General solution:
 * Bron Kerbosch algorithm
 * https://en.wikipedia.org/wiki/Bron%E2%80%93Kerbosch_algorithm
 */

import AOCBase from "../../AOCBase";

type Graph = Map<string, Node>;

type Node = {
  name: string;
  neighbors: Set<Node>;
};

export default class Solution implements AOCBase {
  readonly sampleInput = `kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    const graph: Graph = new Map();

    input.split('\n').map(line => {
      const computers = line.split('-');
      const node0 = graph.get(computers[0]) ?? {name: computers[0], neighbors: new Set<Node>()};
      const node1 = graph.get(computers[1]) ?? {name: computers[1], neighbors: new Set<Node>()};

      node0.neighbors.add(node1);
      node1.neighbors.add(node0);
      graph.set(computers[0], node0);
      graph.set(computers[1], node1);
    });

    return graph;
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const graph = this.parseInput(input);

    let cliques: Set<Node>[] = [];
    bronKerbosch(new Set(), new Set(graph.values()), new Set(), cliques, 3);
    cliques = cliques.filter(clique => {
      if (clique.size !== 3) {
        return false;
      }
      for (const node of clique) {
        if (node.name.charAt(0) === 't') {
          return true;
        }
      }
      return false;
    });

    return {
      performance: performance.now() - performanceStart, 
      result: cliques.length
    }
  }
}

function bronKerbosch(r: Set<Node>, p: Set<Node>, x: Set<Node>, cliques: Set<Node>[], maxCliqueSize: number|null) {
  if (
    (maxCliqueSize !== null && r.size === maxCliqueSize) ||
    (maxCliqueSize === null && p.size === 0 && x.size === 0)
  ) {
    cliques.push(r);
  }

  for (const node of p) {
    const newR = new Set(r);
    newR.add(node);
    
    const newP = new Set(p);
    for (const pNode of newP) {
      if (!node.neighbors.has(pNode)) {
        newP.delete(pNode);
      }
    }

    const newX = new Set(x);
    for (const xNode of newX) {
      if (!node.neighbors.has(xNode)) {
        newX.delete(xNode);
      }
    }

    bronKerbosch(newR, newP, newX, cliques, maxCliqueSize);
    p.delete(node);
    x.add(node);
  }
}

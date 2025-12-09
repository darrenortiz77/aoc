/**
 * https://adventofcode.com/2025/day/08
 */

import AOCBase from "../../AOCBase";

type Junction = {
  x: number;
  y: number;
  z: number;
  circuit: Circuit | null;
};

type Circuit = Set<Junction>;

export default class Solution implements AOCBase {
  readonly sampleInput = `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input.split('\n').map(line => {
      const coords = line.split(',');
      return {
        x: +coords[0],
        y: +coords[1],
        z: +coords[2],
        circuit: null
      } as Junction;
    });
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const parsed = this.parseInput(input);
    let result = 0;

    // logic here
    const distances = new Map<number, Set<Junction>>();

    // get the distances between each junction box
    for (let i=0; i < parsed.length-1; i++) {
      const j0 = parsed[i];

      for (let n=i+1; n < parsed.length; n++) {
        const j1 = parsed[n];

        const dist = Math.sqrt(Math.pow(j0.x - j1.x, 2) + Math.pow(j0.y - j1.y, 2) + Math.pow(j0.z - j1.z, 2));

        distances.set(dist, new Set([j0, j1]));
      }
    }

    // get an array of all distances (which is also the key for `distances`) sorted from shortest to longest
    const distancesSorted = [...distances.keys()].sort((a, b) => a - b);

    // create the appropriate number of connections
    let i = 0;
    while (true) {
      if (i >= distancesSorted.length) {
        break;
      }

      const [j0, j1] =[...distances.get(distancesSorted[i])!];

      const circuit0: Circuit = j0.circuit ?? new Set<Junction>();
      const circuit1: Circuit = j1.circuit ?? new Set<Junction>();
      
      // if neither circuit contains the other's junction
      if (!circuit0.has(j1) || !circuit1.has(j0)) {

        // create a new combined circuit
        const newCircuit = new Set([...circuit0, ...circuit1]);
        newCircuit.add(j0);
        newCircuit.add(j1);
        newCircuit.forEach(junction => junction.circuit = newCircuit);

        if (newCircuit.size === parsed.length) {
          result = j0.x * j1.x;
          break;
        }
      }

      i++;
    }
    
    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

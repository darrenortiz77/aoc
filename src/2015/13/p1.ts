/**
 * https://adventofcode.com/2015/day/13
 *
 * General solution:
 * DFS to find all possible seating orders.
 * Calculate happiness of every possible seating order.
 * Find max.
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `Alice would gain 54 happiness units by sitting next to Bob.
Alice would lose 79 happiness units by sitting next to Carol.
Alice would lose 2 happiness units by sitting next to David.
Bob would gain 83 happiness units by sitting next to Alice.
Bob would lose 7 happiness units by sitting next to Carol.
Bob would lose 63 happiness units by sitting next to David.
Carol would lose 62 happiness units by sitting next to Alice.
Carol would gain 60 happiness units by sitting next to Bob.
Carol would gain 55 happiness units by sitting next to David.
David would gain 46 happiness units by sitting next to Alice.
David would lose 7 happiness units by sitting next to Bob.
David would gain 41 happiness units by sitting next to Carol.`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    const happinessMap = new Map<string, Map<string, number>>();

    input.split('\n').map(line => {
      const matches = line.match(/^(\w+).+(gain|lose) (\d+).+ (\w+)\.$/)!;
      const person0 = matches[1];
      const amount = +matches[3] * (matches[2] === 'gain' ? 1 : -1);
      const person1 = matches[4];
      const happiness = happinessMap.get(person0) ?? new Map();
      happiness.set(person1, amount);
      happinessMap.set(person0, happiness);
    });

    return happinessMap;
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const happinessMap = this.parseInput(input);
    
    // Get all the possible combinations of seating order
    // ======
    const dfs = (seatingChart: string[], remainingPeople: Set<string>, validSeatings: string[][]) => {
      if (remainingPeople.size === 0) {
        validSeatings.push(seatingChart);
        return;
      }

      for (const person of remainingPeople) {
        const remainingClone = new Set(remainingPeople);
        remainingClone.delete(person);
        dfs([...seatingChart, person], remainingClone, validSeatings);
      }
    };

    const people = new Set(happinessMap.keys());
    const validSeatings: string[][] = [];
    const firstPerson = people.values().next().value!;
    people.delete(firstPerson);
    dfs([firstPerson], people, validSeatings);
    // ======

    // calculate total happiness for each seating chart
    const happiness = validSeatings.map(seating => {
      let sum = 0;
      for (let i=0; i < seating.length; i++) {
        const thisPerson = seating[i];
        const nextPerson = i < seating.length-1 ? seating[i+1] : seating[0];
        sum += happinessMap.get(thisPerson)!.get(nextPerson)!;
        sum += happinessMap.get(nextPerson)!.get(thisPerson)!;
      }
      return sum;
    });

    const result = Math.max(...happiness);

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

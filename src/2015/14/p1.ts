/**
 * https://adventofcode.com/2015/day/14
 *
 * General solution:
 * Math
 */

import AOCBase from "../../AOCBase";

type Deer = {
  name: string;
  speed: number;
  flyTime: number;
  restTime: number;
}

export default class Solution implements AOCBase {
  readonly sampleInput = `Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.
Dancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    const deer: Deer[] = []
    input.split('\n').map(line => {
      const matches = line.match(/^(\w+) \D+(\d+)\D+(\d+)\D+(\d+)/)!;
      deer.push({
        name: matches[1],
        speed: +matches[2],
        flyTime: +matches[3],
        restTime: +matches[4],
      });
    });

    return deer;
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const deer = this.parseInput(input);
    const distances: number[] = [];
    const time = 2503;

    for (const thisDeer of deer) {
      const fullRounds = Math.floor(time / (thisDeer.flyTime + thisDeer.restTime));
      const remainder = time % (fullRounds * (thisDeer.flyTime + thisDeer.restTime));
      let distance = Math.min(thisDeer.speed * remainder, thisDeer.speed * thisDeer.flyTime);
      distance += thisDeer.speed * thisDeer.flyTime * fullRounds;
      distances.push(distance);
    }
    
    const result = Math.max(...distances);

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}


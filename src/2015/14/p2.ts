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
  distance: number;
  score: number;
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
        distance: 0,
        score: 0
      });
    });

    return deer;
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const deer = this.parseInput(input);

    for (let i=1; i <= 2503; i++) {
      let maxDistance = 0;
      for (const thisDeer of deer) {
        let distance = 0;
        if (i < thisDeer.flyTime + thisDeer.restTime) {
          distance = Math.min(thisDeer.speed * i, thisDeer.speed * thisDeer.flyTime);
        } else {
          const fullRounds = Math.floor(i / (thisDeer.flyTime + thisDeer.restTime));
          const remainder = i % (fullRounds * (thisDeer.flyTime + thisDeer.restTime));
          distance = Math.min(thisDeer.speed * remainder, thisDeer.speed * thisDeer.flyTime);
          if (fullRounds >= 1) {
            distance += thisDeer.speed * thisDeer.flyTime * fullRounds;
          }
        }
        thisDeer.distance = distance;
        maxDistance = Math.max(maxDistance, distance);
      }

      for (const thisDeer of deer) {
        if (thisDeer.distance === maxDistance) {
          thisDeer.score++;
        }
      }
    }

    let maxScore = 0;
    for (const thisDeer of deer) {
      maxScore = Math.max(maxScore, thisDeer.score);
    }

    return {
      performance: performance.now() - performanceStart, 
      result: maxScore
    }
  }
}

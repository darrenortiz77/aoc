/**
 * https://adventofcode.com/2024/day/14
 *
 * General solution:
 * Basic arithmetic.
 * Calculate where they'll be at at their end point.
 * Calculate how many robots in each quadrant.
 */

import AOCBase from "../../AOCBase";

type Robot = {
  px: number;
  py: number;
  vx: number;
  vy: number;
}

export default class Solution implements AOCBase {
  readonly sampleInput = `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    const robots: Robot[] = [];
    input.split('\n').map(line => {
      const matches = line.match(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/)!;
      robots.push({px: +matches[1], py: +matches[2], vx: +matches[3], vy: +matches[4]});
    });

    return robots;
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const robots = this.parseInput(input);
    const GRID_W = 101;
    const GRID_H = 103;
    const DUR = 100;

    // move the robots
    for (const robot of robots) {
      let px = (robot.px + (robot.vx * DUR)) % GRID_W;
      let py = (robot.py + (robot.vy * DUR)) % GRID_H;
      if (px < 0) {
        px = GRID_W + px;
      }
      if (py < 0) {
        py = GRID_H + py;
      }
      robot.px = px;
      robot.py = py;
    }

    // figure out which ones are in which quadrant
    let q1Count = 0;
    let q2Count = 0;
    let q3Count = 0;
    let q4Count = 0;
    const maxX = Math.floor(GRID_W/2)-1;
    const minX = Math.ceil(GRID_W/2);
    const maxY = Math.floor(GRID_H/2)-1;
    const minY = Math.ceil(GRID_H/2);

    for (const {px, py} of robots) {
      if (px <= maxX && py <= maxY) {
        q1Count++;
      } else if (px >= minX && py <= maxY) {
        q2Count++;
      } else if (px <= maxX && py >= minY) {
        q3Count++;
      } else if (px >= minX && py >= minY) {
        q4Count++;
      }
    }

    const result = q1Count * q2Count * q3Count * q4Count;    

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

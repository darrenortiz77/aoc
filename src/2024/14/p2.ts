/**
 * https://adventofcode.com/2024/day/14
 *
 * General solution:
 * Assumption: that there would be on average 25% of all robots in any particular quadrant on each render.
 * If there's a big enough variance from the average on a particular render, that's likely a bunch of robots forming a picture.
 * Play around with the max_allowable_variance var until you get only one variant.
 */

import AOCBase from "../../AOCBase";

type Robot = {
  initx: number;
  inity: number;
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
      robots.push({initx: +matches[1], inity: +matches[2], px: +matches[1], py: +matches[2], vx: +matches[3], vy: +matches[4]});
    });

    return robots;
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const robots = this.parseInput(input);
    const GRID_W = 101;
    const GRID_H = 103;

    const moveRobots = () => {
      // move the robots
      for (const robot of robots) {
        let px = (robot.initx + (robot.vx * numSeconds)) % GRID_W;
        let py = (robot.inity + (robot.vy * numSeconds)) % GRID_H;
        if (px < 0) {
          px = GRID_W + px;
        }
        if (py < 0) {
          py = GRID_H + py;
        }
        robot.px = px;
        robot.py = py;
      }
    }

    const renderTree = () => {
      console.log(`After ${numSeconds} seconds`);
      for (let row = 0; row < GRID_H; row++) {
        let line = '';
        for (let col = 0; col < GRID_W; col++) {
          let char = '.';
          for (const robot of robots) {
            if (robot.px === col && robot.py === row) {
              char = 'X';
              break;
            }
          }
          line = `${line}${char}`;
        }
        console.log(line);
      }
    };

    const calculateQuadrants = () => {
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

      return [q1Count, q2Count, q3Count, q4Count];
    };

    let numSeconds = 0;
    const AVG_ROBOTS_PER_QUADRANT = 0.25; // on average we should see 25% of all robots in each quadrant
    const MAX_VARIANCE_ALLOWED = 0.2; // an assumption about how much the average could vary by before there's likely an inordinate amount of robots in one quadrant

    let result = '';
    for (let i=1; i <= 10_000; i++) {
      numSeconds = i;
      moveRobots();
      const robotsPerQuadrant = calculateQuadrants();
      
      for (const rpq of robotsPerQuadrant) {
        const variance = rpq / robots.length;
        if (Math.abs(variance - AVG_ROBOTS_PER_QUADRANT) >= MAX_VARIANCE_ALLOWED) {
          console.log('candidate at', numSeconds, variance);
          renderTree();
          result = `${i} - open console to see tree`;
          break;
        }
      }

      if (result !== '') {
        break;
      }
    }

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

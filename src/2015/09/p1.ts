/**
 * https://adventofcode.com/2015/day/9
 *
 * General solution:
 * Convert input into a cyclic graph.
 * DFS over every possible path.
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `London to Dublin = 464
London to Belfast = 518
Dublin to Belfast = 141`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    const cities = new Set<string>();
    const routes = new Map<string, Map<string, number>>();

    input.split('\n').forEach(line => {
      const matches = line.match(/(\w+) to (\w+) = (\d+)/)!;
      const from = matches[1];
      const to = matches[2];
      const dist = +matches[3];
      cities.add(from);
      cities.add(to);
      const cityRoutes1 = routes.get(from) ?? new Map<string, number>();
      cityRoutes1.set(to, dist);
      routes.set(from, cityRoutes1);
      const cityRoutes2 = routes.get(to) ?? new Map<string, number>();
      cityRoutes2.set(from, dist);
      routes.set(to, cityRoutes2);
    });

    return {cities, routes};
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const {cities, routes} = this.parseInput(input);
    let minDist = Infinity;
    // console.log(cities);
    // console.log(routes);

    const travel = (city: string, visited: Set<string>, totalDistance: number) => {
      const destinations = routes.get(city)!;

      if (visited.size === cities.size) {
        minDist = Math.min(minDist, totalDistance);
        return;
      }

      for (const [toCity, distance] of destinations) {
        if (!visited.has(toCity)) {
          travel(toCity, new Set([...visited, toCity]), totalDistance + distance);
        }
      }
    }

    for (const [city] of routes) {
      const visited = new Set<string>();
      visited.add(city);
      travel(city, visited, 0);
    }

    return {
      performance: performance.now() - performanceStart, 
      result: minDist
    }
  }
}

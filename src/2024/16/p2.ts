/**
 * https://adventofcode.com/2024/day/16
 *
 * General solution:
 * A*, but then walk through the path taken and look for any intersections
 * where we could've gone a different way. Block off the path the original
 * A* solution found and see if the alternate route has the same score.
 * If so, add that path to the list of locations.
 */

import AOCBase from "../../AOCBase";
import AStar, { Node } from "../../utils/Astar";

type Point = {x: number, y: number};

type Graph = Map<Point, Set<Point>>;

enum Dir {
  Up,
  Down,
  Left,
  Right,
}

export default class Solution implements AOCBase {
  readonly sampleInput = `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input.split('\n').map(line => line.split(''));
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const grid = this.parseInput(input);
    const {start, goal, graph, nodes} = graphifyGrid(grid);

    // Find the ultimate shortest path
    const astar = new AStarWeighted(grid, '.', false);
    const path = astar.findPath(start!, goal!)!;
    let shortestPathPoints: Point[] = path;
    const shortest = calculateCost(path!);

    // loop over every point in the shortest path
    for (let i=0; i < path.length-1; i++) {
      const pt = nodes.get(stringifyPoint(path[i]))!;
      const neighbors = graph.get(pt)!;

      // If A* had an intersection where it could've chosen a different path,
      // block off the choice it took and see if the alternate way would've lead
      // to the same length path
      if (neighbors.size > 2) {
        const nextNodeTaken = nodes.get(stringifyPoint(path[i+1]))!;
        grid[nextNodeTaken.y][nextNodeTaken.x] = '#';
        const alternatePath = astar.findPath(start!, goal!);
        if (alternatePath) {
          const alternatePathScore = calculateCost(alternatePath);
          if (alternatePathScore === shortest) {
            shortestPathPoints = shortestPathPoints.concat(alternatePath);
          }
        }
        grid[nextNodeTaken.y][nextNodeTaken.x] = '.';
      }
    }
    
    const uniques = new Set<string>();
    for (const pt of shortestPathPoints) {
      uniques.add(stringifyPoint(pt));
    }

    return {
      performance: performance.now() - performanceStart, 
      result: uniques.size
    }
  }
}

function graphifyGrid(grid: string[][]) {
  let start: Point | null = null;
  let goal: Point | null = null;
  const nodes = new Map<string, Point>();
  const graph: Graph = new Map();
  
  for (let row=0; row < grid.length; row++) {
    for (let col=0; col < grid[0].length; col++) {
      if (grid[row][col] !== '#') {
        const pt = {x: col, y: row};
        nodes.set(stringifyPoint({x:col, y:row}), pt);
        if (grid[row][col] === 'S') {
          start = pt;
          grid[row][col] = '.';
        } else if (grid[row][col] === 'E') {
          goal = pt;
          grid[row][col] = '.';
        }
      }
    }
  }

  const directions = [
    {x:0, y:-1},
    {x:0, y:1},
    {x:-1, y:0},
    {x:1, y:0},
  ];

  for (const [, point] of nodes) {
    const vertices = graph.get(point) ?? new Set();
    for (const dir of directions) {
      const neighborPt = {x: point.x + dir.x, y: point.y + dir.y};
      const neighborStr = stringifyPoint(neighborPt);

      if (isValidCell(neighborPt, grid)) {
        vertices.add(nodes.get(neighborStr)!);
      }
    }
    graph.set(point, vertices);
  }

  return {start: start!, goal: goal!, graph, nodes};
}

function stringifyPoint(pt: Point) {
  return `${pt.x},${pt.y}`;
}

function isValidCell({x, y}: Point, grid: string[][]) {
  return (
    x >= 0 && 
    x < grid[0].length && 
    y >= 0 && 
    y < grid.length && 
    grid[y][x] !== '#'
  );
}

function calculateCost(path: Point[]) {
  let cost = path.length-1;
  let dir = Dir.Right;
  let prev = path[0];

  for (let i=1; i < path.length; i++) {
    let newDir: Dir;
    if (path[i].x > prev.x) {
      newDir = Dir.Right;
    } else if (path[i].x < prev.x) {
      newDir = Dir.Left;
    } else if (path[i].y < prev.y) {
      newDir = Dir.Up;
    } else if (path[i].y > prev.y) {
      newDir = Dir.Down;
    }

    if (dir !== newDir!) {
      cost += 1000;
    }

    dir = newDir!;
    prev = path[i];
  }

  return cost;
}

class AStarWeighted extends AStar<string> {
  private dir = Dir.Right;

  protected heuristic(a: Point, b: Point) {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    let h = dx + dy;
    if (dx > 0 && dy > 0) h += 1000;
    return h;
  }

  public findPath(start: Point, goal: Point) {
    const startNode: Node = {
      x: start.x, 
      y: start.y, 
      startToCurrentCost: 0, 
      estCostToGoal: this.heuristic(start, goal),
      totalEstCost: 0,
      parent: null
    };

    const openSet: Node[] = [startNode];
    const closedSet = new Set<string>();

    while (openSet.length > 0) {
      // Find the node with the lowest totalEstCost score
      const currentNode = openSet.reduce((lowest, node) => 
        node.totalEstCost < lowest.totalEstCost ? node : lowest
      );

      if (currentNode.parent) {
        if (currentNode.y < currentNode.parent.y) {
          this.dir = Dir.Up;
        } else if (currentNode.y > currentNode.parent.y) {
          this.dir = Dir.Down;
        } else if (currentNode.x < currentNode.parent.x) {
          this.dir = Dir.Left;
        } else if (currentNode.x > currentNode.parent.x) {
          this.dir = Dir.Right;
        }
      }

      // Check if we've reached the goal
      if (currentNode.x === goal.x && currentNode.y === goal.y) {
        return this.reconstructPath(currentNode);
      }

      // Remove current node from open set and add to closed set
      openSet.splice(openSet.indexOf(currentNode), 1);
      closedSet.add(`${currentNode.x},${currentNode.y}`);

      // Explore neighbors
      const neighbors = this.getNeighbors(currentNode);
      
      for (let neighbor of neighbors) {
        // Skip if already evaluated
        if (closedSet.has(`${neighbor.x},${neighbor.y}`)) continue;

        // Calculate tentative startToCurrentCost score
        let tentativeG = currentNode.startToCurrentCost + 1;

        if (
          neighbor.parent && (
          ((this.dir === Dir.Up || this.dir === Dir.Down) && neighbor.x !== neighbor.parent.x) ||
          ((this.dir === Dir.Left || this.dir === Dir.Right) && neighbor.y !== neighbor.parent.y)
        )) {
          tentativeG += 1000;
        }

        // Check if this is a better path
        const existingNeighborIndex = openSet.findIndex(
          n => n.x === neighbor.x && n.y === neighbor.y
        );

        if (existingNeighborIndex === -1) {
          // New node discovered
          neighbor.startToCurrentCost = tentativeG;
          neighbor.estCostToGoal = this.heuristic(neighbor, goal);
          neighbor.totalEstCost = neighbor.startToCurrentCost + neighbor.estCostToGoal;
          openSet.push(neighbor);
        } else {
          // Existing node - check if this path is better
          const existingNeighbor = openSet[existingNeighborIndex];
          if (tentativeG < existingNeighbor.startToCurrentCost) {
            existingNeighbor.startToCurrentCost = tentativeG;
            existingNeighbor.totalEstCost = existingNeighbor.startToCurrentCost + existingNeighbor.estCostToGoal;
            existingNeighbor.parent = currentNode;
          }
        }
      }
    }

    // No path found
    return null;
  }
}

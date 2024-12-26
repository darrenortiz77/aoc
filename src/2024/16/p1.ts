/**
 * https://adventofcode.com/2024/day/16
 *
 * General solution:
 * Modified A* algorithm
 */

import AOCBase from "../../AOCBase";
import AStar, { Node } from "../../utils/Astar";

type Point = {x: number, y: number};

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

    let start: Point | null = null;
    let goal: Point | null = null;
    
    for (let row=0; row < grid.length; row++) {
      for (let col=0; col < grid[0].length; col++) {
        if (grid[row][col] === 'S') {
          start = {x: col, y: row};
          grid[row][col] = '.';
          break;
        } else if (grid[row][col] === 'E') {
          goal = {x: col, y: row};
          grid[row][col] = '.';
          break;
        }
      }

      if (start && goal) {
        break;
      }
    }
    
    const astar = new AStarWeighted(grid, '.', false);
    const path = astar.findPath(start!, goal!);
    const result = calculateCost(path!);

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
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

enum Dir {
  Up,
  Down,
  Left,
  Right,
};

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
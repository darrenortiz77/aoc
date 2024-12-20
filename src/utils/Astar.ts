export type Point = {x: number, y: number};

export type Node = {
	x: number; 
	y: number;
	startToCurrentCost: number; // cost from start to current node
	estCostToGoal: number; // estimated cost from current node to goal
	totalEstCost: number; // total estimated cost (start to here + here to goal)
	parent: Node | null;
}

export default class AStar<Cell> {
	protected numRows: number;
	protected numCols: number;

	/**
	 * 
	 * @param grid 
	 * @param walkableCell The value in the grid that represents a valid, walkable cell
	 * @param allowDiagonal Whether or not we can move diagonally or are restricted to up, down, left, right
	 */
	constructor(private grid: Cell[][], private walkableCell: Cell, private allowDiagonal = false) {
		this.numRows = grid.length;
		this.numCols = grid[0].length;
	}

	// Calculate Manhattan distance heuristic
	protected heuristic(a: Point, b: Point) {
		return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
	}

	// Check if a node is valid and walkable
	protected isValidNode(x: number, y: number) {
		return (
				x >= 0 && 
				x < this.numRows && 
				y >= 0 && 
				y < this.numCols && 
				this.grid[y][x] === this.walkableCell
		);
	}

	// Get neighboring nodes
	protected getNeighbors(node: Node) {
		const neighbors: Node[] = [];
		const directions: Point[] = this.allowDiagonal ? [
			{x: -1, y: 0}, {x: 1, y: 0},
			{x: 0, y: -1}, {x: 0, y: 1},
			{x: -1, y: -1}, {x: -1, y: 1},
			{x: 1, y: -1}, {x: 1, y: 1}
		] : [
			{x: -1, y: 0}, {x: 1, y: 0},
			{x: 0, y: -1}, {x: 0, y: 1}
		];

		for (let dir of directions) {
			const newX = node.x + dir.x;
			const newY = node.y + dir.y;

			if (this.isValidNode(newX, newY)) {
				neighbors.push({
					x: newX, 
					y: newY, 
					startToCurrentCost: 0,  // will be calculated later
					estCostToGoal: 0,  // will be calculated later
					totalEstCost: 0,  // will be calculated later
					parent: node
				});
			}
		}

		return neighbors;
	}

	// Reconstruct the path from start to goal
	protected reconstructPath(node: Node | null) {
		const path: Point[] = [];
		while (node) {
			path.unshift({x: node.x, y: node.y});
			node = node.parent;
		}
		return path;
	}

	// Main A* algorithm implementation
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
				const tentativeG = currentNode.startToCurrentCost + 1;

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

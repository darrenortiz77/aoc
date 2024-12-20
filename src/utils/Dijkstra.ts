export type Edge = {
	target: string;
	weight: number;
}

export type Graph = {
	[node: string]: Edge[];
}

export type PathResult = {
	distances: { [node: string]: number };
	predecessors: { [node: string]: string | null };
}

export default class Dijkstra {
	constructor(private graph: Graph) {
		
	}

	// Find shortest path from a start node to all other nodes
	findShortestPaths(startNode: string): PathResult {
		// Initialize distances and predecessors
		const distances: { [node: string]: number } = {};
		const predecessors: { [node: string]: string | null } = {};
		const unvisitedNodes = new Set<string>();

		// Set all distances to infinity initially
		for (const node in this.graph) {
			distances[node] = Infinity;
			predecessors[node] = null;
			unvisitedNodes.add(node);
		}

		// Distance to start node is 0
		distances[startNode] = 0;

		while (unvisitedNodes.size > 0) {
			// Find the unvisited node with the smallest distance
			const currentNode = this.findNodeWithMinDistance(distances, unvisitedNodes);
			
			if (currentNode === null) break;

			// Remove current node from unvisited set
			unvisitedNodes.delete(currentNode);

			// Check all neighbors of current node
			for (const edge of this.graph[currentNode]) {
				const neighborNode = edge.target;
				
				// Skip if neighbor has been visited
				if (!unvisitedNodes.has(neighborNode)) continue;

				// Calculate potential new distance
				const tentativeDistance = distances[currentNode] + edge.weight;

				// Update if new path is shorter
				if (tentativeDistance < distances[neighborNode]) {
					distances[neighborNode] = tentativeDistance;
					predecessors[neighborNode] = currentNode;
				}
			}
		}

		return { distances, predecessors };
	}

	// Utility method to reconstruct the path
	reconstructPath(
		predecessors: { [node: string]: string | null }, 
		startNode: string, 
		endNode: string
	): string[] {

		const path: string[] = [];
		let currentNode: string | null = endNode;

		while (currentNode !== null) {
			path.unshift(currentNode);
			currentNode = predecessors[currentNode];

			// Break if we've reached the start or hit a dead end
			if (currentNode === startNode) {
				path.unshift(startNode);
				break;
			}
		}

		return path;
	}

	// Helper method to find the node with minimum distance
	private findNodeWithMinDistance(distances: { [node: string]: number }, unvisitedNodes: Set<string>): string | null {
		return Array.from(unvisitedNodes).reduce((minNode, node) => {
			if (minNode === null) return node;
			return distances[node] < distances[minNode] ? node : minNode;
		}, null as string | null);
	}
}

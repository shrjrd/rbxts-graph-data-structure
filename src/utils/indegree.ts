import { Graph } from '../Graph';
import { NoInfer } from '../types';

/**
 * Computes the indegree for the given node.
 * Not very efficient, costs O(E) where E = number of edges.
 */
export function indegree<Node>(graph: Graph<Node>, node: NoInfer<Node>): number {
	let degree = 0;

	graph.edges.forEach((adjacentNodes, _) => {
		adjacentNodes.forEach((adjacentNode) => {
			if (adjacentNode === node) {
				degree++;
			}
		});
	});

	return degree;
}

import { TraversingTracks } from './types';

/**
 * Remove the node with the minimum weight from the priority queue.
 *
 * Performs linear search.
 */
export function extractMin<Node>(tracks: TraversingTracks<Node>): Node | undefined {
	let min = math.huge;
	let minNode;
	const { d, q } = tracks;

	q.forEach((node) => {
		const nodeWeight = d.get(node) ?? math.huge;

		if (nodeWeight < min) {
			min = nodeWeight;
			minNode = node;
		}
	});

	if (minNode === undefined) {
		// If we reach here, there's a disconnected subgraph, and we're done.
		q.clear();
		return undefined;
	}

	q.delete(minNode);
	return minNode;
}

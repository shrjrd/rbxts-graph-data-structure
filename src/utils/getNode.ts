import { Graph } from '../Graph';
import { NoInfer } from '../types';

/**
 * Return the node matching your function. Throws if none is found or if more than one node if found.
 */
export function getNode<Node extends defined>(graph: Graph<Node, unknown>, fn: (node: NoInfer<Node>) => boolean): Node {
	const foundNodes: Node[] = [];

	graph.nodes.forEach((node) => {
		if (fn(node)) {
			foundNodes.push(node);
		}
	});

	if (foundNodes.size() === 0) {
		throw 'Node not found.';
	}

	if (foundNodes.size() > 1) {
		throw 'More than one node found.';
	}

	return foundNodes[0];
}

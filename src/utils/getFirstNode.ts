import { Graph } from '../Graph';
import { NoInfer } from '../types';

/**
 * Return the first node matching your function and throws if none is found.
 */
export function getFirstNode<Node>(graph: Graph<Node, any>, fn: (node: NoInfer<Node>) => boolean): Node {
	let _node: Node | undefined;
	graph.nodes.forEach((node) => {
		if (!_node && fn(node)) _node = node;
	});
	if (_node) return _node;

	throw 'Node not found.';
}

import { Graph } from '../Graph';

/**
 * Clone the graph data structures.
 * Nodes references are preserves.
 */
export function cloneGraph<Node, LinkProps>(graph: Graph<Node, LinkProps>): Graph<Node, LinkProps> {
	const clone = new Graph<Node, LinkProps>();

	graph.edges.forEach((targets, source) => {
		targets.forEach((target) => {
			(clone.addEdge as unknown as (source: Node, target: Node) => void)(source, target);

			const edgeWeight = graph.edgeWeights.get(source)?.get(target);

			if (edgeWeight) {
				clone.setEdgeWeight(source, target, edgeWeight);
			}

			const edgeProperties = graph.getEdgeProperties(source, target);

			if (edgeProperties) {
				clone.setEdgeProperties(source, target, edgeProperties);
			}
		});
	});

	return clone;
}

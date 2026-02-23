import { Array as JsArray } from '@rbxts/luau-polyfill';

import type { EdgeWeight, NoInfer } from '../../types';
import type { TraversingTracks } from './types';
import type { NextWeightFnParams } from '../../types';

import { Graph } from '../../Graph';
import { invariant } from '../../invariant';

/**
 * Computes edge weight as the sum of all the edges in the path.
 */
export function addWeightFunction(wp: NextWeightFnParams): number {
	if (wp.currentPathWeight === undefined) {
		return wp.edgeWeight;
	}
	return wp.edgeWeight + wp.currentPathWeight;
}

/**
 * Assembles the shortest path by traversing the
 * predecessor subgraph from destination to source.
 */
export function getPath<Node extends defined, LinkProps>(
	graph: Graph<Node, LinkProps>,
	tracks: TraversingTracks<NoInfer<Node>>,
	source: NoInfer<Node>,
	destination: NoInfer<Node>,
	nextWeightFn: (params: NextWeightFnParams<Node, LinkProps>) => number = addWeightFunction,
): {
	nodes: [Node, Node, ...Node[]];
	weight: number | undefined;
} {
	const { p } = tracks;
	const nodeList: Node[] = [];

	let node = destination;

	while (p.has(node)) {
		const currentNode = p.get(node)!;
		nodeList.push(node);
		node = currentNode;
	}

	if (node !== source) {
		throw 'No path found';
	}

	nodeList.push(node);
	JsArray.reverse(nodeList);

	invariant(nodeList.size() >= 2, 'The path should have a least two nodes');

	let totalWeight: EdgeWeight | undefined = undefined;

	// We start as index=1 to work on the first edge between node 0 and 1
	for (let i = 1; i < nodeList.size(); i++) {
		const previousNode = nodeList[i - 1]!;
		const currentNode = nodeList[i]!;

		const edgeWeight = graph.getEdgeWeight(previousNode, currentNode);
		const edgeProps = graph.getEdgeProperties(previousNode, currentNode)!;

		totalWeight = nextWeightFn({
			edgeWeight,
			currentPathWeight: totalWeight,
			hop: i,
			graph,
			path: nodeList as [Node, Node, ...Node[]],
			previousNode,
			currentNode,
			props: edgeProps,
		});
	}

	return {
		nodes: nodeList as [Node, Node, ...Node[]],
		weight: totalWeight,
	};
}

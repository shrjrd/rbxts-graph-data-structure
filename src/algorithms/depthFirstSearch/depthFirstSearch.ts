import { JsSet } from '@rbxts/luau-polyfill';

import { Graph } from '../../Graph';
import type { NoInfer } from '../../types';
import { depthFirstVisit } from './depthFirstVisit';
import type { DepthFirstSearchOptions } from './types';

/**
 * Depth First Search algorithm, inspired by
 * Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 604
 */
export function depthFirstSearch<Node extends defined, LinkProps>(
	graph: Graph<Node, LinkProps>,
	opts: DepthFirstSearchOptions<NoInfer<Node>, NoInfer<LinkProps>> = {},
): Node[] {
	const _sourceNodes: Node[] = [];
	graph.nodes.forEach((node) => _sourceNodes.push(node));
	const { sourceNodes = _sourceNodes, includeSourceNodes = true } = opts;

	const visited: InstanceType<typeof JsSet<Node>> = new JsSet();
	const visiting: InstanceType<typeof JsSet<Node>> = new JsSet();
	const nodeList: Node[] = [];

	if (includeSourceNodes) {
		for (let i = 0; i < sourceNodes.size(); i++) {
			const sourceNode = sourceNodes[i];
			if (!sourceNode) continue;
			depthFirstVisit(graph, nodeList, visited, visiting, sourceNode, opts);
		}
		return nodeList;
	}

	for (let i = 0; i < sourceNodes.size(); i++) {
		const sourceNode = sourceNodes[i];
		if (!sourceNode) continue;
		visited.add(sourceNode);
	}

	for (let i = 0; i < sourceNodes.size(); i++) {
		const sourceNode = sourceNodes[i];
		if (!sourceNode) continue;

		graph.adjacent(sourceNode)?.forEach((n) => depthFirstVisit(graph, nodeList, visited, visiting, n, opts));
	}

	return nodeList;
}

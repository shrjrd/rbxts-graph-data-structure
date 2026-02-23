import { JsSet } from '@rbxts/luau-polyfill';

import { CycleError } from '../../CycleError';
import { Graph } from '../../Graph';
import { NoInfer } from '../../types';
import { DepthFirstSearchOptions } from './types';

export function depthFirstVisit<Node extends defined, LinkProps>(
	graph: Graph<Node, LinkProps>,
	nodeList: NoInfer<Node>[],
	visited: InstanceType<typeof JsSet<NoInfer<Node>>>,
	visiting: InstanceType<typeof JsSet<NoInfer<Node>>>,
	node: NoInfer<Node>,
	opts: Pick<DepthFirstSearchOptions<Node, LinkProps>, 'errorOnCycle' | 'shouldFollow'>,
) {
	const { errorOnCycle = false, shouldFollow } = opts;

	if (visiting.has(node) && errorOnCycle) {
		throw new CycleError('Cycle found');
	}

	if (!visited.has(node)) {
		visited.add(node);
		visiting.add(node);

		graph.adjacent(node)?.forEach((n) => {
			const follow =
				shouldFollow === undefined ||
				shouldFollow({
					source: node,
					target: n,
					graph,
					props: graph.getEdgeProperties(node, n)!,
				});
			if (!follow) return;

			depthFirstVisit(graph, nodeList, visited, visiting, n, opts);
		});

		visiting.delete(node);
		nodeList.push(node);
	}
}

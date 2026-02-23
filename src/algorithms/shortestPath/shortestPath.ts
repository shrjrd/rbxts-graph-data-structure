import { JsSet, JsMap } from '@rbxts/luau-polyfill';

import { Graph } from '../../Graph';
import { NoInfer } from '../../types';
import { dijkstra } from './dijkstra';
import { getPath, addWeightFunction } from './getPath';
import { TraversingTracks } from './types';
import type { NextWeightFnParams } from '../../types';

/**
 * Dijkstra's Shortest Path Algorithm.
 * Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 658
 * Variable and function names correspond to names in the book.
 */
export function shortestPath<Node extends defined, LinkProps>(
	graph: Graph<Node, LinkProps>,
	source: NoInfer<Node>,
	destination: NoInfer<Node>,
	nextWeightFn: (params: NextWeightFnParams) => number = addWeightFunction,
): {
	nodes: [Node, Node, ...Node[]];
	weight: number | undefined;
} {
	const tracks: TraversingTracks<Node> = {
		d: new JsMap(),
		p: new JsMap(),
		q: new JsSet(),
	};

	dijkstra(graph, tracks, source, destination);

	return getPath(graph, tracks, source, destination, nextWeightFn);
}

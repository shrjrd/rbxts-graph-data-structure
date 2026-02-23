import { JsMap, JsSet } from '@rbxts/luau-polyfill';

import { EdgeWeight } from '../../types';

export type TraversingTracks<Node> = {
	/**
	 * Upper bounds for shortest path weights from source.
	 */
	d: InstanceType<typeof JsMap<Node, EdgeWeight>>;

	/**
	 * Predecessors.
	 */
	p: InstanceType<typeof JsMap<Node, Node>>;

	/**
	 * Poor man's priority queue, keyed on d.
	 */
	q: InstanceType<typeof JsSet<Node>>;
};

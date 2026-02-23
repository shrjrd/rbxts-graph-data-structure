import { JsMap } from '@rbxts/luau-polyfill';

import { Graph } from '../Graph';
import { NoInfer, SerializedInput, Edge } from '../types';

export function deserializeGraph<Node extends defined, LinkProps, NodeIdentity>(
	...args: Node extends object
		? [data: SerializedInput<Node, LinkProps>, identityFn: (node: NoInfer<Node>) => NodeIdentity]
		: [data: SerializedInput<Node, LinkProps>]
): Graph<Node, LinkProps> {
	const [data, identityFn] = args;

	const g = new Graph<Node, LinkProps>();

	const nodeIdentityMap = new JsMap<NodeIdentity, Node>();

	(data.nodes as Node[]).forEach((node) => {
		g.addNode(node);

		if (identityFn) {
			nodeIdentityMap.set(identityFn(node), node);
		}
	});

	(data.links as Edge<Node, LinkProps>[]).forEach((link) => {
		if (!identityFn) {
			g.addEdge(link.source, link.target, { weight: link.weight, props: link.props } as never);
			return;
		}

		const source = nodeIdentityMap.get(identityFn(link.source)) ?? link.source;
		const target = nodeIdentityMap.get(identityFn(link.target)) ?? link.target;

		g.addEdge(source, target, { weight: link.weight, props: link.props } as never);
	});

	return g;
}

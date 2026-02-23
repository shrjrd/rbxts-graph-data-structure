import { JsSet } from '@rbxts/luau-polyfill';

import { Graph } from '../../Graph';
import { NoInfer } from '../../types';

/**
 * Return an array containing the lowest common ancestors.
 *
 * Inspired by https://github.com/relaxedws/lca/blob/master/src/LowestCommonAncestor.php code
 * but uses depth search instead of breadth. Also uses some optimizations.
 */
export function lowestCommonAncestors<Node extends defined, LinkProps>(
	graph: Graph<Node, LinkProps>,
	node1: NoInfer<Node>,
	node2: NoInfer<Node>,
): Node[] {
	const node1Ancestors: Node[] = [];
	const lcas: Node[] = [];
	if (CA1Visit(graph, node1Ancestors, lcas, new JsSet<Node>(), node1, node2)) {
		// No shortcut worked
		CA2Visit(graph, node1Ancestors, lcas, new JsSet<Node>(), node2);
	}

	return lcas;
}

function CA1Visit<Node extends defined, LinkProps>(
	graph: Graph<Node, LinkProps>,
	node1Ancestors: Node[],
	lcas: Node[],
	visited: InstanceType<typeof JsSet<Node>>,
	node: Node,
	node2: Node,
): boolean {
	if (!visited.has(node)) {
		visited.add(node);
		node1Ancestors.push(node);
		if (node === node2) {
			lcas.push(node);
			return false; // found - shortcut
		}
		let result = true;
		(graph.adjacent(node) ?? new JsSet<Node>()).forEach((_node) => {
			if (result) {
				result = CA1Visit(graph, node1Ancestors, lcas, visited, _node, node2);
			}
		});
		return result;
	} else {
		return true;
	}
}

function CA2Visit<Node extends defined, LinkProps>(
	graph: Graph<Node, LinkProps>,
	node1Ancestors: Node[],
	lcas: Node[],
	visited: InstanceType<typeof JsSet<Node>>,
	node: Node,
): void {
	if (!visited.has(node)) {
		visited.add(node);
		if (node1Ancestors.indexOf(node) >= 0) {
			lcas.push(node);
		} else if (lcas.size() === 0) {
			graph.adjacent(node)?.forEach((node) => {
				CA2Visit(graph, node1Ancestors, lcas, visited, node);
			});
		}
	}
}

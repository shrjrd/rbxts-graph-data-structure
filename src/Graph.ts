import { JsMap, JsSet } from '@rbxts/luau-polyfill';

import { invariant } from './invariant';
import { EdgeWeight } from './types';

export class Graph<Node = string, LinkProps = never> {
	/**
	 * Contains all the nodes added to the graph.
	 */
	nodes: InstanceType<typeof JsSet<Node>> = new JsSet();

	/**
	 * The adjacency list of the graph.
	 */
	edges: InstanceType<typeof JsMap<Node, InstanceType<typeof JsSet<Node>>>> = new JsMap();

	/**
	 * The weights of edges.
	 *
	 * Map<SourceNode, Map<TargetNode, EdgeWeight>>
	 */
	edgeWeights: InstanceType<typeof JsMap<Node, InstanceType<typeof JsMap<Node, EdgeWeight>>>> = new JsMap();

	/**
	 * Arbitrary properties of edges.
	 * Map<SourceNode, Map<TargetNode, EdgeProperties>>
	 */
	edgeProperties: InstanceType<typeof JsMap<Node, InstanceType<typeof JsMap<Node, LinkProps>>>> = new JsMap();

	/**
	 * Adds a node to the graph.
	 * If node was already added, this function does nothing.
	 * If node was not already added, this function sets up an empty adjacency list.
	 */
	addNode(node: Node): this {
		if (!this.nodes.has(node)) {
			this.nodes.add(node);
		}

		if (!this.edges.has(node)) {
			this.edges.set(node, new JsSet());
		}

		return this;
	}

	/**
	 * Removes a node from the graph.
	 * Also removes incoming and outgoing edges.
	 */
	removeNode(node: Node): this {
		// Remove outgoing edges (and signal that the node no longer exists).
		this.edges.delete(node);
		this.nodes.delete(node);

		// Remove ingoing edges
		this.edges.forEach((adjacentNodes) => {
			adjacentNodes.delete(node);
		});

		return this;
	}

	/**
	 * Gets the adjacent nodes set for the given node.
	 */
	adjacent(node: Node): InstanceType<typeof JsSet<Node>> | undefined {
		return this.edges.get(node);
	}

	/**
	 * Sets the weight of the given edge.
	 */
	setEdgeWeight(source: Node, target: Node, weight: EdgeWeight): this {
		if (!this.edgeWeights.has(source)) {
			this.edgeWeights.set(source, new JsMap());
		}

		const weights = this.edgeWeights.get(source);
		invariant(weights);

		weights.set(target, weight);

		return this;
	}

	/**
	 * Gets the weight of the given edge or `1` if not set.
	 */
	getEdgeWeight(source: Node, target: Node): number {
		return this.edgeWeights.get(source)?.get(target) ?? 1;
	}

	/**
	 * Set the properties of the given edge.
	 */
	setEdgeProperties(source: Node, target: Node, props: LinkProps): this {
		if (!this.edgeProperties.has(source)) {
			this.edgeProperties.set(source, new JsMap());
		}

		const propsHolder = this.edgeProperties.get(source);
		invariant(propsHolder);

		propsHolder.set(target, props);

		return this;
	}

	/**
	 * Get the properties of the given edge or undefined if the edge doesn't exist .
	 */
	getEdgeProperties(source: Node, target: Node): LinkProps | undefined {
		return this.edgeProperties.get(source)?.get(target);
	}

	/**
	 * Adds an edge from the `source` node to `target` node.
	 * This method will create the nodes if they were not already added.
	 */
	addEdge(source: Node, target: Node, ...args: AddEdgeArgs<LinkProps>): this {
		let weight: number | undefined;
		let linkProps: LinkProps | undefined;

		const firstArg = args[0];

		if (typeIs(firstArg, 'number')) {
			weight = firstArg;
		}

		if (typeIs(firstArg, 'table')) {
			weight = firstArg.weight;

			if (firstArg) linkProps = 'props' in firstArg ? firstArg.props : undefined;
		}

		this.addNode(source);
		this.addNode(target);
		const adjacentNodes = this.adjacent(source);

		invariant(adjacentNodes);

		adjacentNodes.add(target);

		if (weight !== undefined) {
			this.setEdgeWeight(source, target, weight);
		}

		if (linkProps !== undefined) {
			this.setEdgeProperties(source, target, linkProps);
		}

		return this;
	}

	/**
	 * Removes the edge from the `source` node to `target` node.
	 * Does not remove the nodes themselves.
	 * Does nothing if the edge does not exist.
	 */
	removeEdge(source: Node, target: Node): this {
		this.edges.get(source)?.delete(target);
		this.edgeProperties.get(source)?.delete(target);

		return this;
	}

	/**
	 * Returns true if there is an edge from the `source` node to `target` node..
	 */
	hasEdge(source: Node, target: Node): boolean {
		return this.edges.get(source)?.has(target) ?? false;
	}
}

type AddEdgeArgs<LinkProps> = [LinkProps] extends [never]
	? [weight?: EdgeWeight] | [opts?: { weight?: EdgeWeight }]
	: [opts: { weight?: EdgeWeight; props: LinkProps }];

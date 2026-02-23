import { describe, expect, it } from '@rbxts/jest-globals';
import { Graph } from '../Graph';
import { checkSerialized } from '../test-utils';
import { Serialized } from '../types';
import { serializeGraph } from './serializeGraph';

describe('serializeGraph', () => {
	let serialized: Serialized<string>;

	it('Should serialize a graph.', () => {
		const graph = new Graph<string>().addEdge('a', 'b').addEdge('b', 'c');
		serialized = serializeGraph(graph);
		checkSerialized(serialized);
	});

	it('should use the node identity for link serialization', () => {
		const nodeA = { id: 1, title: 'a' };
		const nodeB = { id: 2, title: 'b' };

		const graph = new Graph<{ id: number; title: string }, { type: string }>();
		graph.addEdge(nodeA, nodeB, { props: { type: 'foo' } });

		const serialized = serializeGraph(graph, (n) => n.id);

		expect(serialized).toEqual({
			nodes: [nodeA, nodeB],
			links: [{ source: 1, target: 2, props: { type: 'foo' } }],
		});
	});

	it('should reuse the same identity when the node is met multiple times', () => {
		const nodeA = { id: 1, title: 'a' };
		const nodeB = { id: 2, title: 'b' };
		const nodeC = { id: 3, title: 'c' };

		const graph = new Graph<{ id: number; title: string }>();
		graph.addEdge(nodeA, nodeC);
		graph.addEdge(nodeB, nodeC);

		// we use an object as identity
		const serialized = serializeGraph(graph, (n) => ({ id: n.id }));

		const nodeIdentityC1 = serialized.links.find(
			(l) => l.source.id === nodeA.id && l.target.id === nodeC.id,
		)?.target;
		const nodeIdentityC2 = serialized.links.find(
			(l) => l.source.id === nodeB.id && l.target.id === nodeC.id,
		)?.target;

		expect(nodeIdentityC1).toBeDefined();
		expect(nodeIdentityC1).toBe(nodeIdentityC2);
	});

	it.skip('should return a serialized input with type inferred from the graph', () => {
		const nodeA = { title: 'a' };
		const nodeB = { title: 'b' };

		const graph = new Graph<{ title: string }, { type: string }>();
		graph.addEdge(nodeA, nodeB, { props: { type: 'foo' } });

		const serialized = serializeGraph(graph);

		//expectTypeOf(serialized).toEqualTypeOf<Serialized<{ title: string }, { type: string }>>();
	});
});

import { describe, expect, it } from '@rbxts/jest-globals';
import { Graph } from '../Graph';
import { hasCycle } from './hasCycle';

describe('hasCycle', () => {
	it('should detect cycle.', () => {
		const graph = new Graph();
		graph.addEdge('a', 'b');
		graph.addEdge('b', 'a');
		expect(hasCycle(graph)).toBe(true);
	});

	it('should detect cycle (long).', () => {
		const graph = new Graph();
		graph.addEdge('a', 'b');
		graph.addEdge('b', 'c');
		graph.addEdge('c', 'd');
		graph.addEdge('d', 'a');
		expect(hasCycle(graph)).toBe(true);
	});

	it('should detect cycle (loop).', () => {
		const graph = new Graph();
		graph.addEdge('a', 'a');
		expect(hasCycle(graph)).toBe(true);
	});

	it('should not detect cycle.', () => {
		const graph = new Graph();
		graph.addEdge('a', 'b');
		expect(hasCycle(graph)).toBe(false);
	});

	it('should ignore the cycle in another sub-graph.', () => {
		const graph = new Graph();
		graph.addEdge('a', 'b');
		graph.addEdge('b', 'c');
		graph.addEdge('c', 'd');
		graph.addEdge('d', 'a');

		graph.addEdge('m', 'n');

		expect(hasCycle(graph, { sourceNodes: ['m'] })).toBe(false);
	});

	it('should not detect the cycle when the traversing is stopped by the shouldFollow option.', () => {
		const graph = new Graph<string, string>();
		graph.addEdge('a', 'b', { props: 'foo' });
		graph.addEdge('b', 'c', { props: 'foo' });
		graph.addEdge('c', 'd', { props: 'foo' });
		graph.addEdge('d', 'a', { props: 'bar' });

		expect(
			hasCycle(graph, {
				shouldFollow: ({ source, target }) => graph.getEdgeProperties(source, target) === 'foo',
			}),
		).toBe(false);
	});
});

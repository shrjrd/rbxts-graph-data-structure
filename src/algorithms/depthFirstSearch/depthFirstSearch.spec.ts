import { describe, expect, it } from '@rbxts/jest-globals';
import { Graph } from '../../Graph';
import { depthFirstSearch } from '.';

describe('depthFirstSearch', () => {
	it('Should return the nodes connected to the source node with the correct type of edge.', () => {
		const graph = new Graph<string, { type: 'foo' | 'bar' }>();

		graph.addEdge('a', 'b', { props: { type: 'foo' } });
		graph.addEdge('b', 'c', { props: { type: 'bar' } });
		graph.addEdge('b', 'd', { props: { type: 'bar' } });
		graph.addEdge('b', 'e', { props: { type: 'foo' } });

		const nodes = depthFirstSearch(graph, {
			shouldFollow: ({ props }) => props.type === 'foo',
		});

		expect(nodes.includes('a')).toBe(true);
		expect(nodes.includes('b')).toBe(true);
		expect(nodes.includes('e')).toBe(true);
	});

	it('should pass all the expected args to the shouldFollow function', () => {
		expect.hasAssertions();

		const graph = new Graph<string, { type: string }>();

		graph.addEdge('a', 'b', { props: { type: 'foo' } });

		depthFirstSearch(graph, {
			shouldFollow: ({ source, target, props }) => {
				expect(typeOf(source)).toEqual('string');
				expect(typeOf(target)).toEqual('string');
				expect(props).toEqual({ type: 'foo' });
				return true;
			},
		});
	});
});

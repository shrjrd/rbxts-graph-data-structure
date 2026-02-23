import { describe, expect, it } from '@rbxts/jest-globals';

import { Graph } from '.';
import { indegree } from './utils/indegree';
import { outdegree } from './utils/outdegree';

describe('Graph', () => {
	describe('Data structure', () => {
		it('Should add nodes and list them.', () => {
			const graph = new Graph();
			graph.addNode('a');
			graph.addNode('b');

			const nodes = graph.nodes;

			expect(nodes.size).toBe(2);
			expect(nodes.has('a')).toBe(true);
			expect(nodes.has('b')).toBe(true);
		});

		it('Should chain addNode.', () => {
			const graph = new Graph().addNode('a').addNode('b');
			const nodes = graph.nodes;

			expect(nodes.size).toBe(2);
			expect(nodes.has('a')).toBe(true);
			expect(nodes.has('b')).toBe(true);
		});

		it('Should remove nodes.', () => {
			const graph = new Graph();
			graph.addNode('a');
			graph.addNode('b');
			graph.removeNode('a');
			graph.removeNode('b');

			const nodes = graph.nodes;
			expect(nodes.size).toBe(0);
		});

		it('Should chain removeNode.', () => {
			const graph = new Graph().addNode('a').addNode('b').removeNode('a').removeNode('b');

			const nodes = graph.nodes;
			expect(nodes.size).toBe(0);
		});

		it('Should add edges and query for adjacent nodes.', () => {
			const graph = new Graph();
			graph.addNode('a');
			graph.addNode('b');
			graph.addEdge('a', 'b');

			const adjacentNodes = graph.adjacent('a');
			expect(adjacentNodes?.size).toBe(1);
			expect(adjacentNodes?.has('b')).toBe(true);
		});

		it('Should implicitly add nodes when edges are added.', () => {
			const graph = new Graph();
			graph.addEdge('a', 'b');

			const adjacentNodes = graph.adjacent('a');
			expect(adjacentNodes?.size).toBe(1);
			expect(adjacentNodes?.has('b')).toBe(true);

			const nodes = graph.nodes;
			expect(nodes.size).toBe(2);
			expect(nodes.has('a')).toBe(true);
			expect(nodes.has('b')).toBe(true);
		});

		it('Should chain addEdge.', () => {
			const graph = new Graph().addEdge('a', 'b');
			const adjacentNodes = graph.adjacent('a');

			expect(adjacentNodes?.size).toBe(1);
			expect(adjacentNodes?.has('b')).toBe(true);
		});

		it('Should remove edges.', () => {
			const graph = new Graph();
			graph.addEdge('a', 'b');
			graph.removeEdge('a', 'b');

			const adjacentNodes = graph.adjacent('a');
			expect(adjacentNodes?.size).toBe(0);
		});

		it('Should chain removeEdge.', () => {
			const graph = new Graph().addEdge('a', 'b').removeEdge('a', 'b');

			const adjacentNodes = graph.adjacent('a');
			expect(adjacentNodes?.size).toBe(0);
		});

		it('Should not remove nodes when edges are removed.', () => {
			const graph = new Graph();
			graph.addEdge('a', 'b');
			graph.removeEdge('a', 'b');

			const nodes = graph.nodes;
			expect(nodes.size).toBe(2);
			expect(nodes.has('a')).toBe(true);
			expect(nodes.has('b')).toBe(true);
		});
		it('Should remove outgoing edges when a node is removed.', () => {
			const graph = new Graph();
			graph.addEdge('a', 'b');
			graph.removeNode('a');
			expect(graph.adjacent('a')).toEqual(undefined);
		});

		it('Should remove incoming edges when a node is removed.', () => {
			const graph = new Graph();
			graph.addEdge('a', 'b');
			graph.removeNode('b');
			expect(graph.adjacent('a')?.size).toEqual(0);
		});
	});

	describe('Edge cases and error handling', () => {
		it('Should return undefined for unknown nodes.', () => {
			const graph = new Graph();
			expect(graph.adjacent('a')).toEqual(undefined);
			expect(graph.nodes.size).toBe(0);
		});

		it('Should do nothing if removing an edge that does not exist.', () => {
			const graph = new Graph();
			expect(() => graph.removeEdge('a', 'b')).never.toThrowError();
		});

		it('Should return indegree of 0 for unknown nodes.', () => {
			const graph = new Graph();
			expect(indegree(graph, 'z')).toEqual(0);
		});

		it('Should return outdegree of 0 for unknown nodes.', () => {
			const graph = new Graph();
			expect(outdegree(graph, 'z')).toEqual(0);
		});
	});

	describe('Edge Weights', () => {
		it('Should set and get an edge weight.', () => {
			const graph = new Graph().addEdge('a', 'b', 5);
			expect(graph.getEdgeWeight('a', 'b')).toEqual(5);
		});

		it('Should set edge weight via setEdgeWeight.', () => {
			const graph = new Graph().addEdge('a', 'b').setEdgeWeight('a', 'b', 5);
			expect(graph.getEdgeWeight('a', 'b')).toEqual(5);
		});

		it('Should return weight of 1 if no weight set.', () => {
			const graph = new Graph().addEdge('a', 'b');
			expect(graph.getEdgeWeight('a', 'b')).toEqual(1);
		});
	});

	describe('hadEdge', () => {
		it('Should compute hasEdge.', () => {
			const graph = new Graph().addEdge('a', 'b');
			expect(graph.hasEdge('a', 'b')).toEqual(true);
			expect(graph.hasEdge('b', 'a')).toEqual(false);
			expect(graph.hasEdge('c', 'a')).toEqual(false);
		});
	});
});

import { expect } from '@rbxts/jest-globals';
import { Serialized } from './types';

export function checkSerialized(graph: Serialized<string>) {
	expect(graph.nodes.size()).toEqual(3);
	expect(graph.links.size()).toEqual(2);

	expect(graph.nodes[0]).toEqual('a');
	expect(graph.nodes[1]).toEqual('b');
	expect(graph.nodes[2]).toEqual('c');

	expect(graph.links[0]?.source).toEqual('a');
	expect(graph.links[0]?.target).toEqual('b');
	expect(graph.links[1]?.source).toEqual('b');
	expect(graph.links[1]?.target).toEqual('c');
}

export function comesBefore(arr: ReadonlyArray<defined>, a: unknown, b: unknown) {
	let aIndex = 0,
		bIndex = 0;
	arr.forEach((d, i) => {
		if (d === a) {
			aIndex = i;
		}
		if (d === b) {
			bIndex = i;
		}
	});

	return aIndex < bIndex;
}

import { depthFirstSearch } from '../algorithms/depthFirstSearch';
import { DepthFirstSearchOptions } from '../algorithms/depthFirstSearch/types';
import { Graph } from '../Graph';

/**
 * Perform a depth first search to detect an eventual cycle.
 *
 * You can provide a `shouldFollow` function to constrain the traversing and
 * provide `sourceNodes` to explore a particular sub-graphs.
 */
export function hasCycle<Node extends defined, LinkProps>(
	graph: Graph<Node, LinkProps>,
	opts?: Pick<DepthFirstSearchOptions<Node, LinkProps>, 'shouldFollow' | 'sourceNodes'>,
): boolean {
	try {
		depthFirstSearch(graph, {
			...opts,
			includeSourceNodes: true,
			errorOnCycle: true,
		});
		// No error thrown -> no cycles
		return false;
	} catch (error) {
		if ((error as string).find('CycleError')) {
			return true;
		} else {
			throw error;
		}
	}
}

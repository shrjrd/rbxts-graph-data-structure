import { Error } from '@rbxts/luau-polyfill';

export class CycleError extends Error {
	constructor(message: string) {
		super('CycleError ' + message);
	}
}

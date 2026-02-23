export function invariant(value: boolean, message?: string): asserts value;
export function invariant<T>(value: T | undefined, message?: string): asserts value is T;
export function invariant(value: unknown, message?: string) {
	if (value === false || value === undefined) {
		warn('Test invariant failed:', message);
		throw message;
	}
}

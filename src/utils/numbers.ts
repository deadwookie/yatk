
export function random(from: number = 0, upto: number = 1): number {
	return Math.random() * (upto - from) + from
}

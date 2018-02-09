
export function random(from: number = 0, upto: number = 10): number {

	return Math.floor( Math.random() * (upto - from) + from )
}

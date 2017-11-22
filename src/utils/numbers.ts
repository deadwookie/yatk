
export function random(from: number = 0, upto: number = 10): number {
	if (from >= upto) {
		return upto
	}

	return Math.floor( Math.random() * (upto - from) + from )
}

export function generateNaturals(length: number, from: number = 0, upto: number = 10): number[] {
	return Array.from(Array(length)).map(_ => random(from, upto))
}


export function random(from: number = 0, upto: number = 10): number {
	return Math.floor( Math.random() * (upto - from) + from )
}

const alphabet = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
export function hasNumericSolution(target: number, existed: number[]): boolean {
	const existedHash = existed.reduce((acc, v) => {
		acc[v] = true
		return acc
	}, {} as {[key: number]: true})

	const values = alphabet.filter(v => v <= target && !existedHash[v])

	if (values.some(v => v === target)) {
		return true
	}

	return hasSubsetSum(values, target)
}

function hasSubsetSum(numbers: number[], target: number, partial: number[] = []): boolean {
	const s = partial.reduce((a, b) => a + b, 0)
	if (s === target) {
		return true
	} else if (s > target) {
		return false
	}
	let has = false
	for (let i = 0; i < numbers.length; i++) {
		has = hasSubsetSum(numbers.slice(i + 1), target, partial.concat([numbers[i]]))

		if (has) {
			break
		}
	}

	return has
}
import { shuffle } from 'lodash'
import { random } from './numbers'

export function generateDummy(length: number): number[] {
	return Array.from(Array(length)).map((_, ind) => ind % 2 === 0 ? 8 : 2)
}

export function generateRandom(length: number): number[] {
	return Array.from(Array(length)).map(_ => random())
}

export function generateEqualSpread(length: number): number[] {
	const n = 10
	const alphabet = Array.from(Array(n)).map((_, number) => number)

	const eachLength = Math.floor(length / n)
	const leftLength = length % n

	const seq = alphabet.reduce<typeof alphabet>(
		(all, number) => all.concat(Array.from(Array(eachLength)).map(_ => number)),
		leftLength ? shuffle(alphabet).slice(0, leftLength) : [],
	)

	return shuffle(seq)
}

import { types, IType } from 'mobx-state-tree'
import { Cell } from './board'

export function isRow(cells: Cell[], ...chain: Cell[]): boolean {
	if (chain.length < 2) {
		return false
	}
	const sortedChain = chain.sort((a, b) => a.x - b.x)
	const first = sortedChain[0]
	const indexesBetween: number[] = []
	for (let i = 1; i < sortedChain.length; i++) {
		for (let j = sortedChain[i - 1].index; j < sortedChain[i].index; j++) {
			indexesBetween.push(j)
		}
	}
	return chain.every(cell => cell.x === first.x)
		&& indexesBetween.every(ind => cells[ind].isEmpty! || cells[ind].isNullSequence!)
}

export function isColumn(width: number, cells: Cell[], ...chain: Cell[]): boolean {
	if (chain.length < 2) {
		return false
	}
	const sortedChain = chain.sort((a, b) => a.y - b.y)
	const first = sortedChain[0]
	const indexesBetween: number[] = []
	for (let i = 1; i < sortedChain.length; i++) {
		for (let j = sortedChain[i - 1].index; j < sortedChain[i].index; j + width) {
			indexesBetween.push(j)
		}
	}
	return chain.every(cell => cell.y === first.y)
		&& indexesBetween.every(ind => cells[ind].isEmpty! || cells[ind].isNullSequence!)
}

export function isDiagonal(_cells: Cell[], ...chain: Cell[]): boolean {
	if (chain.length < 2) {
		return false
	}
	const sortedChain = chain.sort((a, b) => a.x - b.x)
	const first = sortedChain[0]
	return chain.every(cell => cell.x > first.x && cell.y > first.y)
}

export function isTargetSum(targetSum: number, ...chain: Cell[]): boolean {
	return targetSum === chain.reduce((acc: number, cell: Cell) => {
		return acc + (cell.sequenceValue!.value || 0)
	}, 0)
}

export function isTargetLength(targetLen: number, ...chain: Cell[]): boolean {
	return targetLen === chain.length
}

export function isSameValue(...chain: Cell[]): boolean {
	if (!chain.length) {
		return false
	}
	const firstValue = chain[0].sequenceValue!.value
	return chain.every(cell => cell.sequenceValue!.value === firstValue)
}

export function isUniqueValues(...chain: Cell[]): boolean {
	const valueSet = new Set(chain.map(cell => cell.sequenceValue!.value))
	return valueSet.size === chain.length
}

export interface Rules {
	targetSum: number
	targetLength: number
}

export const Rules: IType<{}, Rules> = types
	.model('Rules', {
		targetSum: types.number,
		targetLength: types.number
	})

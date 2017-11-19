import { types, IType } from 'mobx-state-tree'
import { Cell } from './board'

export function isRow(cells: Cell[], ...chain: Cell[]): boolean {
	const sortedChain = chain.sort((a, b) => a.x - b.x)
	const first = sortedChain[0]

	if (chain.length < 2 || chain.some(cell => cell.y !== first.y)) {
		return false
	}

	const indexesBetween: number[] = []

	for (let i = 1; i < sortedChain.length; i++) {
		for (let j = sortedChain[i - 1].index + 1; j < sortedChain[i].index; j++) {
			indexesBetween.push(j)
		}
	}
	return indexesBetween.every(ind => cells[ind].isEmpty! || cells[ind].isNullSequence!)
}

export function isColumn(cells: Cell[], ...chain: Cell[]): boolean {
	const sortedChain = chain.sort((a, b) => a.y - b.y)
	const first = sortedChain[0]

	if (chain.length < 2 || chain.some(cell => cell.x !== first.x)) {
		return false
	}

	const second = sortedChain[1]
	const indexesBetween: number[] = []
	const width = Math.floor((second.index - first.index) / (second.y - first.y))

	for (let i = 1; i < sortedChain.length; i++) {
		for (let j = sortedChain[i - 1].index + width; j < sortedChain[i].index; j + width) {
			indexesBetween.push(j)
		}
	}
	return indexesBetween.every(ind => cells[ind].isEmpty! || cells[ind].isNullSequence!)
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
	isMatchRules: (...cell: Cell[]) => boolean
	isMatchGeometry: (cells: Cell[], ...chain: Cell[]) => boolean
	isMatchApplyRule: (...cell: Cell[]) => boolean
}

export const Rules: IType<{}, Rules> = types
	.model('Rules', {
		targetSum: types.number,
		targetLength: types.number
	})
	.actions((self) => ({
		isMatchRules(...chain: Cell[]) {
			return isTargetSum(self.targetSum, ...chain) || isSameValue(...chain)
		},

		isMatchGeometry(cells: Cell[], ...chain: Cell[]) {
			return isRow(cells, ...chain) || isColumn(cells, ...chain) || isDiagonal(cells, ...chain)
		},

		isMatchApplyRule(...chain: Cell[]) {
			return isTargetLength(self.targetLength, ...chain)
		}
	}))

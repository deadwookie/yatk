import { types, IType } from 'mobx-state-tree'
import { Cell } from './board'

export enum CollapseDirection {
	ToCenter = 'toCenter',
	ToDeadPoint = 'toDeadPoint'
}

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

export function isEmptyRow(cells: Cell[], width: number, y: number) {
	let isEmpty: boolean = true
	for (let i = cells[y * width].index; i < ((y + 1) * width - 1); i++) {
		if (cells[i].isValueSequence) {
			isEmpty = false
			break
		}
	}
	return isEmpty
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
		for (let j = sortedChain[i - 1].index + width; j < sortedChain[i].index; j += width) {
			indexesBetween.push(j)
		}
	}
	return indexesBetween.every(ind => cells[ind].isEmpty! || cells[ind].isNullSequence!)
}

export function isEmptyColumn(cells: Cell[], width: number, height: number, x: number) {
	let isEmpty: boolean = true
	for (let i = 0; i < height; i++) {
		if (cells[i * width + x].isValueSequence) {
			isEmpty = false
			break
		}
	}
	return isEmpty
}

export function isDiagonal(cells: Cell[], ...chain: Cell[]): boolean {
	if (chain.length < 2) {
		return false
	}

	const sortedChain = chain.sort((a, b) => a.x - b.x)
	const first = sortedChain[0]
	const second = sortedChain[1]
	const direction = second.y < first.y ? -1 : 1

	if (chain.some(cell => Math.abs(first.x - cell.x) !== Math.abs(first.y - cell.y))) {
		return false
	}

	const width = Math.abs(Math.floor((second.index - first.index - direction * (second.y - first.y))) / (second.y - first.y))
	const indexesBetween: number[] = []

	for (let i = 1; i < sortedChain.length; i++) {
		const step = width * direction + 1
		for (let j = sortedChain[i - 1].index + step; j !== sortedChain[i].index; j += step) {
			indexesBetween.push(j)
		}
	}

	return indexesBetween.every(ind => cells[ind].isEmpty! || cells[ind].isNullSequence!)
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

	isCollapseRows: boolean
	isCollapseColumns: boolean
	collapseDirection?: CollapseDirection | null

	isMatchRules: (...cell: Cell[]) => boolean
	isMatchGeometry: (cells: Cell[], ...chain: Cell[]) => boolean
	isMatchApplyRule: (...cell: Cell[]) => boolean
}

export const Rules: IType<{}, Rules> = types
	.model('Rules', {
		targetSum: types.number,
		targetLength: types.number,
		collapseDirection: types.maybe(types.union(
			types.literal(CollapseDirection.ToCenter),
			types.literal(CollapseDirection.ToDeadPoint)
		)),
		isCollapseRows: types.optional(types.boolean, true),
		isCollapseColumns: types.optional(types.boolean, true)
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

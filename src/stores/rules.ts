import { types, IType } from 'mobx-state-tree'
import { Cell } from './board'
import {
	Size,
	getByCoordinate,
	getIndexByCoordinate2D,
	getNextIndex,
	Direction,
	Point,
	isHorizontal,
	isVertical
} from '../utils/navigation'
import { hasNumericSolution } from '../utils/numbers'

export enum CollapseDirection {
	ToTopLeft = 'toTopLeft',
	ToCenter = 'toCenter',
	ToDeadPoint = 'toDeadPoint'
}

export function isEmptyByDirection(vCells: Cell[], size: Size, startPoint: Point, dir: Direction) {
	let stepsLimit = 0

	if (isHorizontal(dir)) {
		stepsLimit = size.width
	} else if (isVertical(dir)) {
		stepsLimit = size.height
	} else {
		throw new Error('Only horizontal and vertical directions are allowed')
	}

	let isEmpty: boolean = true
	let index = getByCoordinate(vCells, startPoint, size)!.index
	let i = 0

	while (i < stepsLimit) {
		if (vCells[index].isValueSequence) {
			isEmpty = false
			break
		}
		index = getNextIndex(index, size, dir)!
		i++
	}

	return isEmpty
}

export function isEmptyBetweenCells(vCells: Cell[], sortedChain: Cell[], size: Size, step: number): boolean {
	const indexesBetween: number[] = []

	for (let i = 1; i < sortedChain.length; i++) {
		const prevIndex = getIndexByCoordinate2D(sortedChain[i - 1], size)
		const currentIndex = getIndexByCoordinate2D(sortedChain[i], size)
		for (let j = prevIndex + step; j !== currentIndex; j += step) {
			indexesBetween.push(j)
		}
	}

	return indexesBetween.every(ind => vCells[ind].isEmpty! || vCells[ind].isNullSequence!)
}

export function isRow(size: Size, vCells: Cell[], ...chain: Cell[]): boolean {
	const sortedChain = chain.sort((a, b) => a.x - b.x)
	const first = sortedChain[0]

	if (chain.length < 2 || chain.some(cell => cell.y !== first.y)) {
		return false
	}

	return isEmptyBetweenCells(vCells, sortedChain, size, 1)
}

export function isEmptyRow(vCells: Cell[], size: Size, y: number, z: number) {
	return isEmptyByDirection(vCells, size, {x: 0, y, z}, Direction.Right)
}

export function isColumn(size: Size, vCells: Cell[], ...chain: Cell[]): boolean {
	const sortedChain = chain.sort((a, b) => a.y - b.y)
	const first = sortedChain[0]

	if (chain.length < 2 || chain.some(cell => cell.x !== first.x)) {
		return false
	}

	return isEmptyBetweenCells(vCells, sortedChain, size, size.width)
}

export function isEmptyColumn(vCells: Cell[], size: Size, x: number, z: number) {
	return isEmptyByDirection(vCells, size, {x, y: 0, z}, Direction.Down)
}

export function isDiagonal(size: Size, vCells: Cell[], ...chain: Cell[]): boolean {
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

	return isEmptyBetweenCells(vCells, sortedChain, size, size.width * direction + 1)
}

export function isTargetSum(targetSum: number, ...chain: Cell[]): boolean {
	return targetSum === chain.reduce((acc: number, cell: Cell) => {
		return acc + (cell.sequenceValue!.value || 0)
	}, 0)
}

export function isTargetSumPossible(targetSum: number, ...chain: Cell[]): boolean {
	const sum = chain.reduce((acc: number, cell: Cell) => {
		return acc + (cell.sequenceValue!.value || 0)
	}, 0)

	if (targetSum === sum) {
		return true
	} else if (sum > targetSum) {
		return false
	}

	const diff = targetSum - sum
	// ToDo we need an alphabet here
	return hasNumericSolution(diff, chain.map(cell => cell.sequenceValue!.value!))
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

export interface RulesSnapshot {
	targetSum: number
	targetLength: number
	deadPointIndex: number | null

	isCollapseRows?: boolean
	isCollapsePartialRows?: boolean
	isCollapseColumns?: boolean
	isCollapsePartialColumns?: boolean
	collapseDirection?: CollapseDirection | null
}

export interface Rules extends RulesSnapshot {
	isMatchRules: (...cell: Cell[]) => boolean
	isMatchGeometry: (size: Size, vCells: Cell[], ...chain: Cell[]) => boolean
	isMatchApplyRule: (...cell: Cell[]) => boolean
}

export const Rules: IType<{}, Rules> = types
	.model('Rules', {
		targetSum: types.number,
		targetLength: types.number,
		deadPointIndex: types.maybe(types.number),
		collapseDirection: types.maybe(types.union(
			types.literal(CollapseDirection.ToCenter),
			types.literal(CollapseDirection.ToDeadPoint),
			types.literal(CollapseDirection.ToTopLeft)
		)),
		isCollapseRows: types.optional(types.boolean, true),
		isCollapsePartialRows: types.optional(types.boolean, false),
		isCollapseColumns: types.optional(types.boolean, true),
		isCollapsePartialColumns: types.optional(types.boolean, false),
	})
	.actions((self) => ({
		isMatchRules(...chain: Cell[]) {
			return (isTargetSumPossible(self.targetSum, ...chain) && isUniqueValues(...chain)) || isSameValue(...chain)
		},

		isMatchGeometry(size: Size, vCells: Cell[], ...chain: Cell[]) {
			return isRow(size, vCells, ...chain) || isColumn(size, vCells, ...chain) || isDiagonal(size, vCells, ...chain)
		},

		isMatchApplyRule(...chain: Cell[]) {
			return (isTargetSum(self.targetSum, ...chain) && isUniqueValues(...chain)) || isSameValue(...chain)
		}
	}))

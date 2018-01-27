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

export enum CollapseDirection {
	ToTopLeft = 'toTopLeft',
	ToCenter = 'toCenter',
	ToDeadPoint = 'toDeadPoint'
}

export function isEmptyByDirection(cells: Cell[], size: Size, startPoint: Point, dir: Direction) {
	let stepsLimit = 0

	if (isHorizontal(dir)) {
		stepsLimit = size.width
	} else if (isVertical(dir)) {
		stepsLimit = size.height
	} else {
		throw new Error('Only horizontal and vertical directions are allowed')
	}

	let isEmpty: boolean = true
	let index = getByCoordinate(cells, startPoint, size)!.index
	let i = 0

	while (i < stepsLimit) {
		if (cells[index].isValueSequence) {
			isEmpty = false
			break
		}
		index = getNextIndex(index, size, dir)!
		i++
	}

	return isEmpty
}

export function isRow(size: Size, cells: Cell[], ...chain: Cell[]): boolean {
	const sortedChain = chain.sort((a, b) => a.x - b.x)
	const first = sortedChain[0]

	if (chain.length < 2 || chain.some(cell => cell.y !== first.y)) {
		return false
	}

	const indexesBetween: number[] = []

	for (let i = 1; i < sortedChain.length; i++) {
		const prevIndex = getIndexByCoordinate2D(sortedChain[i - 1], size)
		const currentIndex = getIndexByCoordinate2D(sortedChain[i], size)
		for (let j = prevIndex + 1; j < currentIndex; j++) {
			indexesBetween.push(j)
		}
	}
	return indexesBetween.every(ind => cells[ind].isEmpty! || cells[ind].isNullSequence!)
}

export function isEmptyRow(cells: Cell[], size: Size, y: number, z: number) {
	return isEmptyByDirection(cells, size, {x: 0, y, z}, Direction.Right)
}

export function isColumn(size: Size, cells: Cell[], ...chain: Cell[]): boolean {
	const sortedChain = chain.sort((a, b) => a.y - b.y)
	const first = sortedChain[0]

	if (chain.length < 2 || chain.some(cell => cell.x !== first.x)) {
		return false
	}

	const indexesBetween: number[] = []

	for (let i = 1; i < sortedChain.length; i++) {
		const prevIndex = getIndexByCoordinate2D(sortedChain[i - 1], size)
		const currentIndex = getIndexByCoordinate2D(sortedChain[i], size)
		for (let j = prevIndex + size.width; j < currentIndex; j += size.width) {
			indexesBetween.push(j)
		}
	}
	return indexesBetween.every(ind => cells[ind].isEmpty! || cells[ind].isNullSequence!)
}

export function isEmptyColumn(cells: Cell[], size: Size, x: number, z: number) {
	return isEmptyByDirection(cells, size, {x, y: 0, z}, Direction.Down)
}

export function isDiagonal(size: Size, cells: Cell[], ...chain: Cell[]): boolean {
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

	const indexesBetween: number[] = []

	for (let i = 1; i < sortedChain.length; i++) {
		const step = size.width * direction + 1
		const prevIndex = getIndexByCoordinate2D(sortedChain[i - 1], size)
		const currentIndex = getIndexByCoordinate2D(sortedChain[i], size)
		for (let j = prevIndex + step; j !== currentIndex; j += step) {
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
	isMatchGeometry: (size: Size, cells: Cell[], ...chain: Cell[]) => boolean
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
			return isTargetSum(self.targetSum, ...chain) || isSameValue(...chain)
		},

		isMatchGeometry(size: Size, cells: Cell[], ...chain: Cell[]) {
			return isRow(size, cells, ...chain) || isColumn(size, cells, ...chain) || isDiagonal(size, cells, ...chain)
		},

		isMatchApplyRule(...chain: Cell[]) {
			return isTargetLength(self.targetLength, ...chain)
		}
	}))

import { types, IType } from 'mobx-state-tree'

import { Rules, isEmptyColumn, isEmptyRow } from './rules'
import { charMap } from '../utils/charMap'

export function randomN(from = 0, upto = 10, asInt = true) {
	const n = Math.random() * (upto - from) + from
	return asInt ? Math.floor(n) : n
}

export interface SequenceValue {
	key: number
	value: number | null
}

export const SequenceValue: IType<{}, SequenceValue> = types
	.model('SequenceValue', {
		key: types.identifier(types.number),
		value: types.union(types.number, types.null)
	})

export interface Cell {
	key: string
	index: number
	x: number
	y: number
	isChained?: boolean
	glyph?: string
	sequenceValue?: SequenceValue | null

	readonly isEmpty?: boolean
	readonly isNullSequence?: boolean
	readonly isValueSequence?: boolean
}

export const Cell: IType<{}, Cell> = types
	.model('Cell', {
		key: types.identifier(types.string),
		index: types.number,
		x: types.number,
		y: types.number,
		isChained: types.optional(types.boolean, false),
		glyph: types.optional(types.string, ''),
		sequenceValue: types.maybe(types.reference(SequenceValue))
	})
	.views((self) => ({
		get isEmpty() {
			return !self.sequenceValue
		},
		get isNullSequence() {
			return self.sequenceValue && self.sequenceValue.value === null
		},
		get isValueSequence() {
			return self.sequenceValue && self.sequenceValue.value !== null
		}
	}))

export enum BoardGeometryType {
	Box = 'box',
	Spiral = 'spiral'
}

export enum FinishResult {
	Win = 'win',
	Fail = 'fail'
}

export interface Board {
	initialSequenceLength: number
	width: number
	height: number
	geometryType: BoardGeometryType

	movesCount: number
	round: number
	finishResult?: FinishResult | null

	sequenceCounter: number
	sequence: Array<SequenceValue>
	cells: Array<Cell>
	chain: Array<Cell>
	cursor?: Cell | null
	rules: Rules

	generateCells: () => void
	getNextCursor: () => Cell | null
	clearSequence: () => void
	appendSequence: (fragment: Array<number | null>) => Array<SequenceValue>

	finish: (result: FinishResult) => void
	generateSequence: (lenth: number) => void
	resetSequenceTo: (sequence: Array<number | null>) => void
	replicateSequence: () => void
	arrangeSequence: (sequence: Array<SequenceValue>) => void
	generate: (seqLength?: number) => void
	newGame: (seqLength?: number) => void
	nextRound: () => void
	addToChain: (cell: Cell) => void
}

export const Board: IType<{}, Board> = types
	.model('Board', {
		initialSequenceLength: types.number,
		width: types.number,
		height: types.number,
		geometryType: types.union(types.literal(BoardGeometryType.Box), types.literal(BoardGeometryType.Spiral)),

		movesCount: types.number,
		round: types.number,
		finishResult: types.maybe(types.union(types.literal(FinishResult.Win), types.literal(FinishResult.Fail))),

		sequenceCounter: types.optional(types.number, 0),
		sequence: types.array(SequenceValue),
		cells: types.array(Cell),
		chain: types.array(types.reference(Cell)),
		cursor: types.maybe(types.reference(Cell)),
		rules: Rules
	})
	.actions((self) => ({
		generateCells() {
			self.cells.splice(0)

			let cellIndex = -1
			for (let y = 0; y < self.height; y++) {
				self.cells.push(...Array.from(Array(self.width)).map((_, x) => {
					const symbol = randomN()
					const chars = charMap[symbol]
					cellIndex++

					return {
						key: `${x}_${y}`,
						index: cellIndex,
						x,
						y,
						glyph: chars[randomN(0, chars.length)],
					}
				}))
			}

			if (self.geometryType === BoardGeometryType.Box) {
				self.cursor = self.cells[0]
			} else if (self.geometryType === BoardGeometryType.Spiral) {
				self.cursor = self.cells[Math.floor((self.height - 1) / 2) * self.width + Math.floor((self.width - 1) / 2)]
			} else {
				throw new Error(`Unknown geometry type for the board: ${self.geometryType}`)
			}
		},

		getNextCursor() {
			if (self.geometryType === BoardGeometryType.Box) {
				const nextIndex = self.cursor!.index + 1

				if (nextIndex >= self.cells.length) {
					return null
				}

				return self.cells[self.cursor!.index + 1]
			} else if (self.geometryType === BoardGeometryType.Spiral) {
				const hasAbove = (self.cursor!.y > 0) && !self.cells[self.cursor!.index - self.width].isEmpty!
				const hasBelow = (self.cursor!.y < self.height - 1) && !self.cells[self.cursor!.index + self.width].isEmpty!
				const hasLeft = (self.cursor!.x > 0) && !self.cells[self.cursor!.index - 1].isEmpty!
				const hasRight = (self.cursor!.x < self.width - 1) && !self.cells[self.cursor!.index + 1].isEmpty!

				let nextIndex = null

				if (hasAbove && !hasLeft) {
					// Try to move left
					if (self.cursor!.x > 0) {
						nextIndex = self.cursor!.index - 1
					}
				} else if (hasBelow && !hasRight) {
					// Try to move right
					if (self.cursor!.x < self.width - 1) {
						nextIndex = self.cursor!.index + 1
					}
				} else if (hasLeft && !hasBelow) {
					// Try to move down
					if (self.cursor!.y < self.height - 1) {
						nextIndex = self.cursor!.index + self.width
					}
				} else if (hasRight && !hasAbove) {
					// Try to move up
					if (self.cursor!.y > 0) {
						nextIndex = self.cursor!.index - self.width
					}
				} else if (!hasBelow && !hasAbove && !hasLeft && !hasRight) {
					// By default try to move right
					if (self.cursor!.x < self.width - 1) {
						nextIndex = self.cursor!.index + 1
					}
				}

				return nextIndex === null ? null : self.cells[nextIndex]
			} else {
				throw new Error(`Unknown geometry type for the board: ${self.geometryType}`)
			}
		},

		clearSequence() {
			self.sequence.splice(0)
		},

		appendSequence(fragment: Array<number | null>) {
			let seqCounter = self.sequenceCounter
			const sequenceFragment = fragment.map(v => {
				seqCounter++
				return {
					key: seqCounter,
					value: v
				}
			})
			self.sequence.push(...sequenceFragment)
			self.sequenceCounter = seqCounter

			return self.sequence.slice(-1 * sequenceFragment.length)
		},

		finish(result: FinishResult) {
			self.finishResult = result
		},

		copyRow(srcY: number, dstY: number) {
			const isClearDst = srcY < 0 || srcY >= self.height
			for (let i = 0; i < self.width; i++) {
				self.cells[dstY * self.width + i].sequenceValue = isClearDst
					? null
					: self.cells[srcY * self.width + i].sequenceValue
			}
		},

		copyColumn(srcX: number, dstX: number) {
			const isClearDst = srcX < 0 || srcX >= self.width
			for (let i = 0; i < self.height; i++) {
				self.cells[i * self.width + dstX].sequenceValue = isClearDst
					? null
					: self.cells[i * self.width + srcX].sequenceValue
			}
		}
	}))
	.actions((self) => ({
		generateSequence(length: number) {
			self.clearSequence()
			self.sequenceCounter = -1
			self.appendSequence(Array.from(Array(length)).map(_ => 8))
			//self.appendSequence(Array.from(Array(length)).map(_ => randomN()))
		},

		resetSequenceTo(sequence: Array<number | null>) {
			self.clearSequence()
			self.appendSequence(sequence)
		},

		replicateSequence() {
			return self.appendSequence(self.sequence.filter(sv => sv.value !== null).map(sv => sv.value))
		},

		arrangeSequence(sequenceFragment: Array<SequenceValue>) {
			for (const sv of sequenceFragment) {
				if (!self.cursor) {
					self.finish(FinishResult.Fail)
					break
				}
				self.cursor!.sequenceValue = sv
				self.cursor = self.getNextCursor()
			}
		},

		collapseChain(chain: Cell[]) {
			const yToCollapse: {[key: string]: number} = {}
			const xToCollapse: {[key: string]: number} = {}
			const isAboveMiddleFn = (y: number) => y < (self.height / 2)
			const isLeftToMiddleFn = (x: number) => x < (self.width / 2)

			chain.forEach(cell => {
				if (isEmptyRow(self.cells, self.width, cell.y)) {
					yToCollapse[cell.y.toString()] = cell.y
				}
				if (isEmptyColumn(self.cells, self.width, self.height, cell.x)) {
					xToCollapse[cell.x.toString()] = cell.x
				}
			})

			Object.keys(yToCollapse).forEach((initialY) => {
				const y = yToCollapse[initialY]
				const isAboveMiddle = isAboveMiddleFn(y)
				const direction = isAboveMiddle ? -1 : 1

				// Collapse row
				for (let i = y; i > 0 && i < self.height; i += direction) {
					self.copyRow(i + direction, i)
				}

				delete yToCollapse[initialY]
				Object.keys(yToCollapse)
					.filter(initialY => {
						return isAboveMiddleFn(yToCollapse[initialY]) === isAboveMiddle
					})
					.forEach((initialY) => {
						yToCollapse[initialY] -= direction
					})
			})

			Object.keys(xToCollapse).forEach((initialX) => {
				const x = xToCollapse[initialX]
				const isLeftToMiddle = isLeftToMiddleFn(x)
				const direction = isLeftToMiddle ? -1 : 1

				// Collapse row
				for (let i = x; i > 0 && i < self.height; i += direction) {
					self.copyColumn(i + direction, i)
				}

				delete xToCollapse[initialX]
				Object.keys(xToCollapse)
					.filter(initialX => {
						return isLeftToMiddleFn(xToCollapse[initialX]) === isLeftToMiddle
					})
					.forEach((initialX) => {
						xToCollapse[initialX] -= direction
					})
			})
		}
	}))
	.actions((self) => ({
		generate(seqLength?: number) {
			self.generateSequence(seqLength || self.initialSequenceLength)
			self.generateCells()
			self.arrangeSequence(self.sequence)
		},

		clearChain() {
			self.chain.forEach((cell: Cell) => {
				cell.isChained = false
				cell.sequenceValue!.value = null
			})

			self.collapseChain(self.chain)

			self.chain.splice(0)
		}
	}))
	.actions((self) => ({
		nextRound() {
			self.round++
			self.arrangeSequence(self.replicateSequence())
		},

		newGame(seqLength?: number) {
			self.round = 1
			self.generate(seqLength)
		},

		addToChain(cell: Cell) {
			if (cell.isEmpty) {
				return
			}

			if (self.chain.length && self.rules.isMatchRules(cell, ...self.chain) && self.rules.isMatchGeometry(self.cells, cell, ...self.chain)) {
				self.chain.push(cell)
			} else {
				self.chain.forEach((cell: Cell) => {
					cell.isChained = false
				})
				self.chain.splice(0)
				self.chain.push(cell)
			}

			cell.isChained = true

			if (self.rules.isMatchApplyRule(...self.chain)) {
				self.clearChain()
			}
		}
	}))

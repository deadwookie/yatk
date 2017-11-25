import { types, IType } from 'mobx-state-tree'

import { Rules, isEmptyColumn, isEmptyRow } from './rules'
import { CHARMAP } from '../utils/chars'

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
	score: number
	finishResult?: FinishResult | null

	sequenceCounter: number
	sequence: Array<SequenceValue>
	cells: Array<Cell>
	chain: Array<Cell>
	cursor?: Cell | null
	rules: Rules

	copyRow: (srcY: number, dstY: number) => void
	copyColumn: (srcX: number, dstX: number) => void
	getRow: (y: number) => Cell[] | null
	getColumn: (x: number) => Cell[] | null
 	generateCells: () => void
	getNextCursor: () => Cell | null
	getPrevCursor: () => Cell | null
	clearSequence: () => void
	appendSequence: (fragment: Array<number | null>) => Array<SequenceValue>
	removeFromSequence: (fragment: Array<SequenceValue>) => void

	finish: (result: FinishResult) => void
	generateSequence: (lenth: number) => void
	resetSequenceTo: (sequence: Array<number | null>) => void
	replicateSequence: () => void
	arrangeSequence: (sequence: Array<SequenceValue>) => void
	generate: (seqLength?: number) => void
	newGame: (seqLength?: number) => void
	nextRound: () => void
	processChain: () => void
	clearChain: () => void
	addToChain: (cell: Cell) => void
	removeFromChain: (cell: Cell) => void
}

export const Board: IType<{}, Board> = types
	.model('Board', {
		initialSequenceLength: types.number,
		width: types.number,
		height: types.number,
		geometryType: types.union(types.literal(BoardGeometryType.Box), types.literal(BoardGeometryType.Spiral)),

		movesCount: types.number,
		round: types.number,
		score: types.number,
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

			const cells: Cell[] = []
			let cellIndex = -1

			for (let y = 0; y < self.height; y++) {
				cells.push(...Array.from(Array(self.width)).map((_, x) => {
					const symbol = randomN()
					const chars = CHARMAP[symbol]
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

			self.cells.push(...cells)

			if (self.geometryType === BoardGeometryType.Box) {
				self.cursor = self.cells[0]
			} else if (self.geometryType === BoardGeometryType.Spiral) {
				self.cursor = self.cells[Math.floor((self.height - 1) / 2) * self.width + Math.floor((self.width - 1) / 2)]
			} else {
				throw new Error(`Unknown geometry type for the board: ${self.geometryType}`)
			}
		},

		getNextCursor(): Cell | null {
			if (self.geometryType === BoardGeometryType.Box) {
				const nextIndex = self.cursor!.index + 1

				if (nextIndex >= self.cells.length) {
					return null
				}

				return self.cells[nextIndex]
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

		getPrevCursor(): Cell | null {
			if (self.geometryType === BoardGeometryType.Box) {
				const prevIndex = self.cursor!.index - 1

				if (prevIndex < 0 || !self.cells[prevIndex].isEmpty) {
					return null
				}

				return self.cells[prevIndex]
			} else if (self.geometryType === BoardGeometryType.Spiral) {
				const hasAbove = self.cursor!.y > 0 && !self.cells[self.cursor!.index - self.width].isEmpty!
				const hasBelow = (self.cursor!.y < self.height - 1) && !self.cells[self.cursor!.index + self.width].isEmpty!
				const hasLeft = self.cursor!.x > 0 && !self.cells[self.cursor!.index - 1].isEmpty!
				const hasRight = (self.cursor!.x < self.width - 1) && !self.cells[self.cursor!.index + 1].isEmpty!

				const hasAboveRight = self.cursor!.y > 0 && (self.cursor!.x < self.width - 1)
					&& !self.cells[self.cursor!.index - self.width + 1].isEmpty!
				const hasAboveLeft = self.cursor!.y > 0 && self.cursor!.x > 0
					&& !self.cells[self.cursor!.index - self.width - 1].isEmpty!
				const hasBelowRight = (self.cursor!.y < self.height - 1) && (self.cursor!.x < self.width - 1)
					&& !self.cells[self.cursor!.index + self.width + 1].isEmpty!
				const hasBelowLeft = (self.cursor!.y < self.height - 1) && self.cursor!.x > 0
					&& !self.cells[self.cursor!.index + self.width - 1].isEmpty!

				let prevIndex = null

				if (hasAboveRight && !hasRight) {
					// Try to move right
					prevIndex = self.cursor!.index + 1
				} else if (hasBelowRight && !hasBelow) {
					// Try to move down
					prevIndex = self.cursor!.index + self.width
				} else if (hasBelowLeft && !hasLeft) {
					// Try to move left
					prevIndex = self.cursor!.index - 1
				} else if (hasAboveLeft && !hasAbove) {
					// Try to move up
					prevIndex = self.cursor!.index - self.width
				}

				return prevIndex === null ? null : self.cells[prevIndex]
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

		removeFromSequence(fragment: Array<SequenceValue>) {
			const keySet = new Set(fragment.map(sv => sv.key))
			const indexes: Array<number> = []

			self.sequence.forEach((sv, ind) => {
				if (keySet.has(sv.key)) {
					indexes.push(ind)
				}
			})

			const chains: Array<{index: number, count: number}> = indexes.sort((a, b) => a - b)
				.reduce((acc, val, index) => {
					if (index > 0 && (acc[acc.length - 1].index + acc[acc.length - 1].count) === val) {
						acc[acc.length - 1].count++
					} else {
						acc.push({index: val, count: 1})
					}

					return acc
				}, [] as Array<{index: number, count: number}>)

			let removedCount = 0
			for(const chain of chains) {
				self.sequence.splice(chain.index - removedCount, chain.count)
				removedCount += chain.count
			}
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
		},

		getRow(y: number): Cell[] | null {
			const cells: Cell[] = []

			if (y < 0 || y >= self.height) {
				return null
			}

			for (let i = 0; i < self.width; i++) {
				cells.push(self.cells[y * self.width + i])
			}

			return cells
		},

		getColumn(x: number): Cell[] | null {
			const cells: Cell[] = []

			if (x < 0 || x >= self.width) {
				return null
			}

			for (let i = 0; i < self.height; i++) {
				cells.push(self.cells[i * self.width + x])
			}

			return cells
		}
	}))
	.actions((self) => ({
		generateSequence(length: number) {
			self.clearSequence()
			self.sequenceCounter = -1
			//self.appendSequence(Array.from(Array(length)).map((_, ind) => ind % 2 === 0 ? 8 : 2))
			self.appendSequence(Array.from(Array(length)).map(_ => randomN()))
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
			const sequenceFragments: Array<SequenceValue> = []

			chain.forEach(cell => {
				if (isEmptyRow(self.cells, self.width, cell.y)) {
					yToCollapse[cell.y.toString()] = cell.y
				}
				if (isEmptyColumn(self.cells, self.width, self.height, cell.x)) {
					xToCollapse[cell.x.toString()] = cell.x
				}
			})

			if (self.rules.isCollapseRows) {
				Object.keys(yToCollapse).forEach((iY) => {
					const y = yToCollapse[iY]
					const isAboveMiddle = y < (self.height / 2)
					const direction = isAboveMiddle ? -1 : 1
					const isCursorOnCollapsed = self.cursor && self.cursor.y === y

					// Collect values to remove from sequence
					const row = self.getRow(y)
					if (row) {
						sequenceFragments.push(
							...row.filter(cell => !cell.isEmpty).map(cell => cell.sequenceValue!)
						)
					}

					// Collapse row
					for (let i = y; i > 0 && i < self.height; i += direction) {
						self.copyRow(i + direction, i)

						if (self.cursor && self.cursor.y === (i + direction)) {
							// Cursor is located on the source column
							self.cursor = self.cells[self.cursor.index - direction * self.width]
						}
					}

					// Move cursor
					if (isCursorOnCollapsed) {
						let prevCursor = self.getPrevCursor()

						if (!prevCursor) {
							/**
								* We cannot move, so check if the not empty value from the different was row copied
								* to the cursor position in that case try to move cursor one step ahead
								*/
							if (self.cursor && !self.cursor.isEmpty) {
								prevCursor = self.getNextCursor()
								if (prevCursor) {
									self.cursor = prevCursor
								}
							}
						} else {
							while (prevCursor) {
								self.cursor = prevCursor
								prevCursor = self.getPrevCursor()
							}
						}
					}

					delete yToCollapse[iY]
					Object.keys(yToCollapse)
						.filter(iY => isAboveMiddle ? yToCollapse[iY] < y : yToCollapse[iY] > y)
						.forEach(iY => yToCollapse[iY] -= direction)
				})
			}

			if (self.rules.isCollapseColumns) {
				Object.keys(xToCollapse).forEach((iX) => {
					const x = xToCollapse[iX]
					const isLeftToMiddle = x < (self.width / 2)
					const direction = isLeftToMiddle ? -1 : 1
					const isCursorOnCollapsed = self.cursor && self.cursor.x === x

					// Collect values to remove from sequence
					const column = self.getColumn(x)
					if (column) {
						sequenceFragments.push(
							...column.filter(cell => !cell.isEmpty).map(cell => cell.sequenceValue!)
						)
					}

					// Collapse column
					for (let i = x; i > 0 && i < self.height; i += direction) {
						self.copyColumn(i + direction, i)

						if (self.cursor && self.cursor.x === (i + direction)) {
							// Cursor is located on the source column
							self.cursor = self.cells[self.cursor.index - direction]
						}
					}

					// Move cursor
					if (isCursorOnCollapsed) {
						let prevCursor = self.getPrevCursor()

						if (!prevCursor) {
							/**
								* We cannot move, so check if the not empty value from the different was row copied
								* to the cursor position in that case try to move cursor one step ahead
								*/
							if (self.cursor && !self.cursor.isEmpty) {
								prevCursor = self.getNextCursor()
								if (prevCursor) {
									self.cursor = prevCursor
								}
							}
						} else {
							while (prevCursor) {
								self.cursor = prevCursor
								prevCursor = self.getPrevCursor()
							}
						}
					}

					delete xToCollapse[iX]
					Object.keys(xToCollapse)
						.filter(iX => isLeftToMiddle ? xToCollapse[iX] < x : xToCollapse[iX] > x)
						.forEach(iX => xToCollapse[iX] -= direction)
				})
			}

			if (sequenceFragments.length) {
				self.removeFromSequence(sequenceFragments)
			}
		},

		clearChain() {
			self.chain.forEach((cell: Cell) => {
				cell.isChained = false
			})

			self.chain.splice(0)
		}
	}))
	.actions((self) => ({
		generate(seqLength?: number) {
			self.generateSequence(seqLength || self.initialSequenceLength)
			self.generateCells()
			self.arrangeSequence(self.sequence)
		},

		processChain() {
			self.chain.forEach((cell: Cell) => {
				cell.sequenceValue!.value = null
			})

			if (self.rules.isCollapseRows || self.rules.isCollapseColumns) {
				self.collapseChain(self.chain)
			}

			self.clearChain()
			self.movesCount += 1

			if (!self.sequence.length) {
				self.finish(FinishResult.Win)
			}
		},

		updateScore() {
			const sortedChain = self.chain.sort((a, b) => a.x - b.x)
			const first = sortedChain[0]
			const last = sortedChain[sortedChain.length - 1]
			const dist = [Math.abs(first.x - last.x), Math.abs(first.y - last.y)]

			self.score += 10 + dist[0] + dist[1]
		}
	}))
	.actions((self) => ({
		nextRound() {
			self.round++
			self.score -= 100
			self.clearChain()
			self.arrangeSequence(self.replicateSequence())
		},

		newGame(seqLength?: number) {
			self.movesCount = 0
			self.round = 1
			self.score = 1000
			self.finishResult = null
			self.clearChain()
			self.generate(seqLength)
		},

		addToChain(cell: Cell) {
			if (cell.isEmpty || cell.isNullSequence || self.chain.indexOf(cell) !== -1) {
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
				self.updateScore()
				self.processChain()
			}
		},

		removeFromChain(cell: Cell) {
			if (cell.isChained) {
				self.chain.splice(self.chain.indexOf(cell), 1)
				cell.isChained = false
			}
		}
	}))

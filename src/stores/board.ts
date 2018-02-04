import { types, IType, IModelType, flow } from 'mobx-state-tree'
import { GameAnalytics, EGAProgressionStatus } from 'gameanalytics'

import { Rules, CollapseDirection, isEmptyColumn, isEmptyRow, RulesSnapshot } from './rules'
import { Behavior } from './behavior'
import { CHARMAP } from '../utils/chars'
import { delay } from '../utils/times'
import { Direction, getByCoordinate, getIndexByCoordinate2D, getNextIndex, canMove, isHorizontal, isVertical } from '../utils/navigation'

export function randomN(from = 0, upto = 10, asInt = true) {
	const n = Math.random() * (upto - from) + from
	return asInt ? Math.floor(n) : n
}

function getVisibleCellByCoordinate(board: Board, x: number, y: number, maxZ: number = board.depth): Cell | null {
	let cell = board.getCell(x, y, maxZ)


	while (cell && (cell.isEmpty || cell.isNullSequence)) {
		const nextIndex = getNextIndex(cell.index, board, Direction.Deep)
		cell = nextIndex === null ? null : board.cells[nextIndex]
	}

	return cell
}

export interface SequenceValueSnapshot {
	key: number
	value: number | null
}

export interface SequenceValue extends SequenceValueSnapshot {
}

export const SequenceValue: IType<{}, SequenceValue> = types
	.model('SequenceValue', {
		key: types.identifier(types.number),
		value: types.union(types.number, types.null)
	})

export interface CellSnapshot {
	key: string
	index: number
	index2D: number
	x: number
	y: number
	z: number
	isChained?: boolean
	glyph?: string
	sequenceValue?: SequenceValue | null
}

export interface Cell extends CellSnapshot {
	readonly isEmpty?: boolean
	readonly isNullSequence?: boolean
	readonly isValueSequence?: boolean
}

export const Cell: IModelType<{}, Cell> = types
	.model('Cell', {
		key: types.identifier(types.string),
		index: types.number,
		index2D: types.number,
		x: types.number,
		y: types.number,
		z: types.number,
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

export interface CellStackSnapshot {
	key: string
	stack: Cell[]
}

export interface CellStack extends CellStackSnapshot {
	readonly top: Cell
	readonly length: number
	pop: () => Cell | undefined
	push: (cell: Cell) => number
}

export const CellStack: IModelType<{}, CellStack> = types
	.model('CellStack', {
		key: types.string,
		stack: types.array(types.reference(Cell))
	})
	.views((self) => ({
		get length(): number {
			return self.stack.length
		},
		get top(): Cell {
			return self.stack[self.stack.length - 1]!
		}
	}))
	.actions((self) => ({
		pop(): Cell | undefined {
			return self.stack.length === 1 ? undefined : self.stack.pop()
		},
		push(cell: Cell) {
			return self.stack.push(cell)
		}
	}))

export enum BoardGeometryType {
	Box = 'box',
	Spiral = 'spiral',
	ZigZag = 'zig-zag'
}

export enum FinishResult {
	Win = 'win',
	Fail = 'fail'
}

export interface BoardSnapshot {
	_processingAsyncId?: number

	worldKey: string
	levelKey: string

	isDummySequence: boolean
	initialSequenceLength: number
	width: number
	height: number
	depth: number
	cellSizePx: number
	geometryType: BoardGeometryType

	movesCount: number
	round: number
	initialScore: number
	score: number
	finishResult?: FinishResult | null

	readonly currentStage: number
	readonly maxStage: number
	sequenceCounter: number
	sequence: Array<SequenceValue>
	cells: Array<Cell>
	chain: Array<Cell>
	cursor?: Cell | null
	deadPoint?: Cell | null
	rules: RulesSnapshot
	behavior: Behavior
	readonly visibilityStacks: Array<CellStack>
	readonly strain: Array<SequenceValue>
	readonly freeSpaceLeft: number
	readonly isProcessing: boolean
}

export interface Board extends BoardSnapshot {
	_stopProcessingAsync: (asyncId?: number) => void
	copyRow: (srcY: number, dstY: number) => void
	copyColumn: (srcX: number, dstX: number) => void
	getRow: (y: number) => Cell[] | null
	getColumn: (x: number) => Cell[] | null
	getCell: (x: number, y: number, z: number) => Cell | null
 	generateCells: () => void
	getNextCursor: () => Cell | null
	getPrevCursor: () => Cell | null
	getNextCursorDir: () => Direction | null
	getPrevCursorDir: () => Direction | null
	clearSequence: () => void
	appendSequence: (fragment: Array<number | null>) => Array<SequenceValue>
	removeFromSequence: (fragment: Array<SequenceValue>) => void

	finish: (result: FinishResult) => void
	generateSequence: (length: number, isDummy?: boolean) => void
	resetSequenceTo: (sequence: Array<number | null>) => void
	replicateSequence: () => void
	arrangeSequence: (sequence: Array<SequenceValue>) => void
	generate: (seqLength?: number, isDummy?: boolean) => void
	newGame: (seqLength?: number, score?: number) => void
	nextRound: () => void
	processChain: () => void
	clearChain: () => void
	addToChain: (cell: Cell) => void
	removeFromChain: (cell: Cell) => void
}

export const Board: IType<{}, Board> = types
	.model('Board', {
		_processingAsyncId: types.optional(types.number, -1),

		worldKey: types.string,
		levelKey: types.string,

		isDummySequence: types.boolean,
		initialSequenceLength: types.number,
		width: types.number,
		height: types.number,
		depth: types.number,
		cellSizePx: types.number,
		geometryType: types.union(types.literal(BoardGeometryType.Box), types.literal(BoardGeometryType.Spiral)),

		movesCount: types.number,
		round: types.number,
		initialScore: types.number,
		score: types.number,
		finishResult: types.maybe(types.union(types.literal(FinishResult.Win), types.literal(FinishResult.Fail))),

		sequenceCounter: types.optional(types.number, 0),
		sequence: types.array(SequenceValue),
		cells: types.array(Cell),
		visibilityStacks: types.optional(types.array(CellStack), []),
		chain: types.array(types.reference(Cell)),
		cursor: types.maybe(types.reference(Cell)),
		deadPoint: types.maybe(types.reference(Cell)),
		rules: Rules,
		behavior: Behavior
	})
	.views((self: any)=> ({
		get currentStage() {
			if (!self.cursor) {
				return self.depth - 1
			}
			let z = self.cursor.z
			if (self.cursor.x === 0 && self.cursor.y === 0 && z > 0) {
				z--
			}
			return z
		},
		get maxStage() {
			const lastCell = self.rules.deadPointIndex - 1
			const layerSize = self.width * self.height
			return Math.ceil(lastCell / layerSize)
		},
		get strain() {
			return self.sequence.filter((v: SequenceValue) => v.value !== null)
		},
		get freeSpaceLeft() {
			return self.rules.deadPointIndex - (self.cursor ? self.cursor.index : self.cells.length)
		},
		get isProcessing() {
			return self._processingAsyncId !== -1
		},
	}))
	.actions((self) => ({
		_stopProcessingAsync(asyncId?: number) {
			if (!asyncId || self._processingAsyncId === asyncId) {
				self._processingAsyncId = -1
			}
		},

		getNextCursorDir(): Direction | null {
			const next = getNextIndex.bind(null, self.cursor!.index, self.width)
			const can = canMove.bind(null, self.cursor!, self)

			if (self.geometryType === BoardGeometryType.Box) {
				const nextIndex = next(Direction.Right)

				if (nextIndex >= self.cells.length) {
					return null
				}

				return Direction.Right
			} else if (self.geometryType === BoardGeometryType.Spiral) {
				const canUp = can(Direction.Up)
				const canRight = can(Direction.Right)
				const canDown = can(Direction.Down)
				const canLeft = can(Direction.Left)
				const hasAbove = canUp && !self.cells[next(Direction.Up)].isEmpty!
				const hasBelow = canDown && !self.cells[next(Direction.Down)].isEmpty!
				const hasLeft = canLeft && !self.cells[next(Direction.Left)].isEmpty!
				const hasRight = canRight && !self.cells[next(Direction.Right)].isEmpty!

				let direction = null

				if (hasAbove && !hasLeft) {
					// Try to move left
					if (canLeft) {
						direction = Direction.Left
					}
				} else if (hasBelow && !hasRight) {
					// Try to move right
					if (canRight) {
						direction = Direction.Right
					}
				} else if (hasLeft && !hasBelow) {
					// Try to move down
					if (canDown) {
						direction = Direction.Down
					}
				} else if (hasRight && !hasAbove) {
					// Try to move up
					if (canUp) {
						direction = Direction.Up
					}
				} else if (!hasBelow && !hasAbove && !hasLeft && !hasRight) {
					// By default try to move right
					if (canRight) {
						direction = Direction.Right
					}
				}

				return direction
			} else {
				throw new Error(`Unknown geometry type for the board: ${self.geometryType}`)
			}
		},

		getPrevCursorDir(): Direction | null {
			const next = getNextIndex.bind(null, self.cursor!.index, self.width)
			const can = canMove.bind(null, self.cursor!, self)

			if (self.geometryType === BoardGeometryType.Box) {
				const prevIndex = next(Direction.Left)

				if (prevIndex < 0 || !self.cells[prevIndex].isEmpty) {
					return null
				}

				return Direction.Left
			} else if (self.geometryType === BoardGeometryType.Spiral) {
				const canUp = can(Direction.Up)
				const canRight = can(Direction.Right)
				const canDown = can(Direction.Down)
				const canLeft = can(Direction.Left)
				const canUpRight = can(Direction.UpRight)
				const canUpLeft = can(Direction.UpLeft)
				const canDownRight = can(Direction.DownRight)
				const canDownLeft = can(Direction.DownLeft)

				const hasAbove = canUp && !self.cells[next(Direction.Up)].isEmpty!
				const hasBelow = canDown && !self.cells[next(Direction.Down)].isEmpty!
				const hasLeft = canLeft && !self.cells[next(Direction.Left)].isEmpty!
				const hasRight = canRight && !self.cells[next(Direction.Right)].isEmpty!

				const hasAboveRight = canUpRight && !self.cells[next(Direction.UpRight)].isEmpty!
				const hasAboveLeft = canUpLeft && !self.cells[next(Direction.UpLeft)].isEmpty!
				const hasBelowRight = canDownRight && !self.cells[next(Direction.DownRight)].isEmpty!
				const hasBelowLeft = canDownLeft && !self.cells[next(Direction.DownLeft)].isEmpty!

				let direction = null

				if (hasAboveRight && !hasRight) {
					// Move right
					direction = Direction.Right
				} else if (hasBelowRight && !hasBelow) {
					// Move down
					direction = Direction.Down
				} else if (hasBelowLeft && !hasLeft) {
					// Move left
					direction = Direction.Left
				} else if (hasAboveLeft && !hasAbove) {
					// Move up
					direction = Direction.Up
				}

				return direction
			} else {
				throw new Error(`Unknown geometry type for the board: ${self.geometryType}`)
			}
		},

		generateCellStacks() {
			const stacks: CellStackSnapshot[] = []
			for (let y = 0; y < self.height; y++) {
				for (let x = 0; x < self.width; x++) {
					stacks.push({
						key: `stack_${x}_${y}`,
						// We can use 2D index because we only want cells from the first level
						stack: [self.cells[getIndexByCoordinate2D({x, y}, self)]]
					})
				}
			}

			self.visibilityStacks.splice(0, self.visibilityStacks.length, ...stacks)
		}
	}))
	.actions((self) => ({
		generateCells() {
			self.cells.splice(0)

			const cells: CellSnapshot[] = []
			let cellIndex = -1

			for (let z = 0; z < self.depth; z++) {
				let cellIndex2D = -1
				for (let y = 0; y < self.height; y++) {
					cells.push(...Array.from(Array(self.width)).map((_, x) => {
						const symbol = randomN()
						const chars = CHARMAP[symbol]
						cellIndex++
						cellIndex2D++
						return {
							key: `${x}_${y}_${z}`,
							index: cellIndex,
							index2D: cellIndex2D,
							x,
							y,
							z,
							glyph: chars[randomN(0, chars.length)],
						}
					}))
				}
			}

			self.cells.push(...cells)

			if (self.geometryType === BoardGeometryType.Box) {
				self.cursor = self.cells[0]
			} else if (self.geometryType === BoardGeometryType.Spiral) {
				self.cursor = self.cells[Math.floor((self.height - 1) / 2) * self.width + Math.floor((self.width - 1) / 2)]
			} else {
				throw new Error(`Unknown geometry type for the board: ${self.geometryType}`)
			}

			self.generateCellStacks()
		},

		getNextCursor(): Cell | null {
			const nextIndex = getNextIndex(self.cursor!.index, self, self.getNextCursorDir())
			return nextIndex === null ? null : self.cells[nextIndex]
		},

		getPrevCursor(): Cell | null {
			const prevIndex = getNextIndex(self.cursor!.index, self, self.getPrevCursorDir())
			return prevIndex === null ? null : self.cells[prevIndex]
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

			const statusEvent = result === FinishResult.Fail
				? EGAProgressionStatus.Fail
				: EGAProgressionStatus.Complete

			GameAnalytics.addProgressionEvent(statusEvent, self.worldKey, self.levelKey, self.round)
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
		},

		getCell(x: number, y: number, z: number): Cell | null {
			return getByCoordinate(self.cells, {x, y, z}, self)
		},

		findVisibleCell(x: number, y: number, z: number): Cell | null {
			return getVisibleCellByCoordinate(self as any as Board, x, y, z)
		},
	}))
	.actions((self) => ({
		collapseRows(yToCollapse: {[key: string]: number}): Array<SequenceValue> {
			const isCollapsePartialRows = self.rules.isCollapsePartialRows
			const sequenceFragments: Array<SequenceValue> = []
			let collapseToY = 0

			switch (self.rules.collapseDirection) {
				case CollapseDirection.ToCenter:
					collapseToY = (self.height / 2)
					break
				case CollapseDirection.ToDeadPoint:
					collapseToY = self.deadPoint ? self.deadPoint.y : 0
					break
				case CollapseDirection.ToTopLeft:
					collapseToY = 0
					break
			}

			Object.keys(yToCollapse).forEach((iY) => {
				const y = yToCollapse[iY]
				const isAboveCollapseY = y < collapseToY
				const collapseDir = isAboveCollapseY ? -1 : 1
				const isCursorOnCollapsed = self.cursor && self.cursor.y === y
				const isSkipCollapse = isCursorOnCollapsed && isHorizontal(self.getNextCursorDir())
					&& !isCollapsePartialRows

				if (isSkipCollapse) {
					delete yToCollapse[iY]
				} else {
					// Collect values to remove from sequence
					const row = self.getRow(y)
					if (row) {
						sequenceFragments.push(
							...row.filter(cell => !cell.isEmpty).map(cell => cell.sequenceValue!)
						)
					}

					// Collapse row
					for (let i = y; i > 0 && i < self.height; i += collapseDir) {
						self.copyRow(i + collapseDir, i)

						if (self.cursor && self.cursor.y === (i + collapseDir)) {
							// Cursor is located on the source column
							self.cursor = self.cells[self.cursor.index - collapseDir * self.width]
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
						.filter(iY => isAboveCollapseY ? yToCollapse[iY] < y : yToCollapse[iY] > y)
						.forEach(iY => yToCollapse[iY] -= collapseDir)
				}
			})

			return sequenceFragments
		},

		collapseColumns(xToCollapse: {[key: string]: number}): Array<SequenceValue> {
			const isCollapsePartialColumns = self.rules.isCollapsePartialColumns
			const sequenceFragments: Array<SequenceValue> = []
			let collapseToX = 0

			switch (self.rules.collapseDirection) {
				case CollapseDirection.ToCenter:
					collapseToX = (self.width / 2)
					break
				case CollapseDirection.ToDeadPoint:
					collapseToX = self.deadPoint ? self.deadPoint.x : 0
					break
				case CollapseDirection.ToTopLeft:
					collapseToX = 0
					break
			}

			Object.keys(xToCollapse).forEach((iX) => {
				const x = xToCollapse[iX]
				const isLeftToCollapseX = x < collapseToX
				const collapseDir = isLeftToCollapseX ? -1 : 1
				const isCursorOnCollapsed = self.cursor && self.cursor.x === x
				const isSkipCollapse = isCursorOnCollapsed && isVertical(self.getNextCursorDir())
					&& !isCollapsePartialColumns

				if (isSkipCollapse) {
					delete xToCollapse[iX]
				} else {
					// Collect values to remove from sequence
					const column = self.getColumn(x)
					if (column) {
						sequenceFragments.push(
							...column.filter(cell => !cell.isEmpty).map(cell => cell.sequenceValue!)
						)
					}

					// Collapse column
					for (let i = x; i > 0 && i < self.height; i += collapseDir) {
						self.copyColumn(i + collapseDir, i)

						if (self.cursor && self.cursor.x === (i + collapseDir)) {
							// Cursor is located on the source column
							self.cursor = self.cells[self.cursor.index - collapseDir]
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
						.filter(iX => isLeftToCollapseX ? xToCollapse[iX] < x : xToCollapse[iX] > x)
						.forEach(iX => xToCollapse[iX] -= collapseDir)
				}
			})

			return sequenceFragments
		},
	}))
	.actions((self) => ({
		generateSequence(length: number, isDummy?: boolean) {
			self.clearSequence()
			self.sequenceCounter = -1
			if (isDummy) {
				self.appendSequence(Array.from(Array(length)).map((_, ind) => ind % 2 === 0 ? 8 : 2))
			} else {
				self.appendSequence(Array.from(Array(length)).map(_ => randomN()))
			}
		},

		resetSequenceTo(sequence: Array<number | null>) {
			self.clearSequence()
			self.appendSequence(sequence)
		},

		replicateSequence() {
			return self.appendSequence(self.sequence.filter(sv => sv.value !== null).map(sv => sv.value))
		},

		arrangeSequence: flow(function* (sequenceFragment: Array<SequenceValue>) {
			const delayTime = self.behavior.seqArrangeStepDelayMs
			const asyncId = Date.now()
			self._processingAsyncId = asyncId
			for (const sv of sequenceFragment) {
				if (!self.cursor || self.cursor === self.deadPoint) {
					self.finish(FinishResult.Fail)
					break
				}
				self.cursor!.sequenceValue = sv
				self.visibilityStacks[self.cursor.index2D].push(self.cursor)
				yield delay(delayTime)

				if (self._processingAsyncId !== asyncId) {
					break
				}
				self.cursor = self.getNextCursor()
			}
			self._stopProcessingAsync(asyncId)
		}),

		arrangeDeadPoint() {
			if (self.rules.deadPointIndex !== null) {
				self.deadPoint = self.cells[self.rules.deadPointIndex]
			}
		},

		collapseChain(chain: Cell[]) {
			const yToCollapse: {[key: string]: number} = {}
			const xToCollapse: {[key: string]: number} = {}
			const sequenceFragments: Array<SequenceValue> = []

			chain.forEach(cell => {
				if (isEmptyRow(self.cells, self, cell.y, cell.z)) {
					yToCollapse[cell.y.toString()] = cell.y
				}
				if (isEmptyColumn(self.cells, self, cell.x, cell.z)) {
					xToCollapse[cell.x.toString()] = cell.x
				}
			})

			if (self.rules.isCollapseRows && self.rules.collapseDirection) {
				sequenceFragments.push(...self.collapseRows(yToCollapse))
			}

			if (self.rules.isCollapseColumns && self.rules.collapseDirection) {
				sequenceFragments.push(...self.collapseColumns(xToCollapse))
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
		generate(seqLength?: number, isDummy?: boolean) {
			self.generateSequence(seqLength || self.initialSequenceLength, isDummy)
			self.generateCells()
			self.arrangeSequence(self.sequence)
			self.arrangeDeadPoint()
		},

		processChain() {
			self.chain.forEach((cell: Cell) => {
				cell.sequenceValue!.value = null
				self.visibilityStacks[cell.index2D].pop()
			})

			if (self.rules.isCollapseRows || self.rules.isCollapseColumns) {
				self.collapseChain(self.chain)
			}

			self.clearChain()
			self.movesCount += 1

			if (!self.strain.length) {
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
			GameAnalytics.addProgressionEvent(EGAProgressionStatus.Complete, self.worldKey, self.levelKey, self.round)
			self._stopProcessingAsync()

			self.round++
			self.score -= 100
			self.clearChain()

			// we have to trigger start event before arrange seq because you can fail there. see arrangeSequence method
			GameAnalytics.addProgressionEvent(EGAProgressionStatus.Start, self.worldKey, self.levelKey, self.round)

			self.arrangeSequence(self.replicateSequence())
		},

		newGame(seqLength?: number, score?: number) {
			self._stopProcessingAsync()
			self.movesCount = 0
			self.round = 1
			self.score = score !== undefined ? score : self.initialScore
			self.finishResult = null
			self.clearChain()
			self.generate(seqLength, self.isDummySequence)

			GameAnalytics.addProgressionEvent(EGAProgressionStatus.Start, self.worldKey, self.levelKey, self.round)
		},

		addToChain(cell: Cell) {
			if (cell.isEmpty || cell.isNullSequence || self.chain.indexOf(cell) !== -1) {
				return
			}

			if (self.chain.length &&
				self.rules.isMatchRules(cell, ...self.chain) &&
				self.rules.isMatchGeometry(self, self.visibilityStacks.map(stack => stack.top), cell, ...self.chain)) {

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

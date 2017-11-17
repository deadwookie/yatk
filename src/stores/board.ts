import { types, IType } from 'mobx-state-tree'
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
		}
	}))

export enum BoardGeometryType {
	Box = 'box',
	Spiral = 'spiral'
}

export enum Direction {
	North = 'n',
	East = 'e',
	South = 's',
	West = 'w'
}

export function switchDirection(direction: Direction) {
	if (direction === Direction.North) return Direction.East
	if (direction === Direction.East) return Direction.South
	if (direction === Direction.South) return Direction.West
	if (direction === Direction.West) return Direction.North

	return Direction.East
}

export function isDirectionX(direction: Direction) {
	return direction === Direction.East || direction === Direction.West
}

export function isDirectionY(direction: Direction) {
	return direction === Direction.North || direction === Direction.South
}

export interface Board {
	initialSequenceLength: number
	width: number
	height: number
	geometryType: BoardGeometryType

	movesCount: number
	round: number

	sequenceCounter: number
	sequence: Array<SequenceValue>
	cells: Array<Cell>
	cursor?: Cell | null

	generateCells: () => void
	generate: (seqLength?: number) => void
	nextRound: () => void
}

export const Board: IType<{}, Board> = types
	.model('Board', {
		initialSequenceLength: types.number,
		width: types.number,
		height: types.number,
		geometryType: types.union(types.literal(BoardGeometryType.Box), types.literal(BoardGeometryType.Spiral)),

		movesCount: types.number,
		round: types.number,

		sequenceCounter: types.optional(types.number, 0),
		sequence: types.array(SequenceValue),
		cells: types.array(Cell),
		cursor: types.maybe(types.reference(Cell))
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

		moveCursor() {
			if (self.geometryType === BoardGeometryType.Box) {
				self.cursor = self.cells[self.cursor!.index + 1]
			} else if (self.geometryType === BoardGeometryType.Spiral) {
				
				/*let dims = {
					x: 0,
					y: 0,
					w: 0,
					h: 0,
					dir: Direction.East,
					len: 0,
					step: 0
				}

				for (let i = 0; i < self.maxSequenceLength; i++) {
					// seq.value[i] || undefined // #
					let currentDirection = dims.dir

					if (dims.step >= dims.len) {
						dims.step = 0
						dims.len = 0
					}

					// FIXME: start first step in better way
					if (!dims.w && !dims.h) {
						dims.x = 0
						dims.y = 0
						dims.w = 1
						dims.h = 1
					} else {
						if (dims.w <= dims.h) {
							if (dims.step) {
								// just "stepping" into direction: no dims update + calc coord only
							} else {
								dims.w += 1
								dims.len = dims.h
								dims.dir = switchDirection(dims.dir)
							}
						} else {
							if (dims.step) {
								// just "stepping" into direction: no dims update + calc coord only
							} else {
								dims.h += 1
								dims.len = dims.h
								dims.dir = switchDirection(dims.dir)
							}
						}

						dims.step += 1
						dims.x = isDirectionY(currentDirection) ? dims.x : dims.x + (1 * (currentDirection === Direction.East ? 1 : -1))
						dims.y = isDirectionX(currentDirection) ? dims.y : dims.y + (1 * (currentDirection === Direction.South ? 1 : -1))
					}

					// console.log(`index [${i}] | coords: ${dims.x}x${dims.y} | dims: ${dims.w}x${dims.h} | steps ${dims.step}of${dims.len} into ${dims.dir}`)

					self.cells.push({
						x: dims.x,
						y: dims.y,
						sequenceIndex: i < seqLen ? i : -1,
						glyph: i < seqLen ? '' : buildGlyphFromIndex(i),
						isChained: false
					})
				}*/
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
		}
	}))
	.actions((self) => ({
		generateSequence(length: number) {
			self.clearSequence()
			self.sequenceCounter = -1
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
			sequenceFragment.forEach(sv => {
				self.cursor!.sequenceValue = sv
				self.moveCursor()
			})
		},
	}))
	.actions((self) => ({
		generate(seqLength?: number) {
			self.round = 1
			self.generateSequence(seqLength || self.initialSequenceLength)
			self.generateCells()
			self.arrangeSequence(self.sequence)
		},

		nextRound() {
			self.round++
			self.arrangeSequence(self.replicateSequence())
		},

		// TODO: switch geometry
	}))

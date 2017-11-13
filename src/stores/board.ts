import { types, IType } from 'mobx-state-tree'

import { Sequence } from './sequence'

export interface Cell {
	x: number
	y: number
	isChained: boolean
	glyph?: string
	sequenceIndex?: number
}

export const Cell: IType<{}, Cell> = types
	.model('Cell', {
		x: types.number,
		y: types.number,
		isChained: types.optional(types.boolean, false),
		glyph: types.optional(types.string, ''),
		sequenceIndex: types.optional(types.number, -1)
	})

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
	geometry: BoardGeometryType
	maxSequenceLength: number
	movesCount: number
	sequence: Sequence
	cells: Cell[]

	generateCells: (seq: Sequence, geometryType: BoardGeometryType) => void
	generate: (length: number) => void
	nextRound: () => void
}

export const Board: IType<{}, Board> = types
	.model('Board', {
		geometry: types.union(types.literal(BoardGeometryType.Box), types.literal(BoardGeometryType.Spiral)),
		maxSequenceLength: types.number,
		movesCount: types.number,
		sequence: Sequence,
		cells: types.array(Cell)
	})
	.actions((self) => ({
		generateCells(seq: Sequence, geometryType: BoardGeometryType) {
			self.cells.splice(0)
			const width = Math.ceil(Math.sqrt(self.maxSequenceLength))
			const seqLen = self.sequence.values.length

			if (geometryType === BoardGeometryType.Box) {
				for (let i = 0; i < self.maxSequenceLength; i++) {
					const isNotFirstRow = (i + 1) > width
					const fullRowsCount = Math.floor(i / width) * width

					self.cells.push({
						x: isNotFirstRow ? i - fullRowsCount : i,
						y: Math.ceil((i + 1) / width) - 1,
						sequenceIndex: i,
						glyph: seq.values[i] ? '' : 's',
						isChained: false,
					})
				}
			} else if (geometryType === BoardGeometryType.Spiral) {
				let dims = {
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

					console.log(`index [${i}] | coords: ${dims.x}x${dims.y} | dims: ${dims.w}x${dims.h} | steps ${dims.step}of${dims.len} into ${dims.dir}`)

					self.cells.push({
						x: dims.x,
						y: dims.y,
						sequenceIndex: i < seqLen ? i : -1,
						glyph: i < seqLen ? '' : 's',
						isChained: false
					})
				}
			} else {
				throw new Error(`Unknown geometry type for the board: ${geometryType}`)
			}
		}
	}))
	.actions((self) => ({
		generate(length: number) {
			self.sequence.generate(length)
			self.generateCells(self.sequence, BoardGeometryType.Spiral)
		},

		nextRound() {
			self.sequence.replicate()
			self.generateCells(self.sequence, BoardGeometryType.Spiral)
		},
	}))

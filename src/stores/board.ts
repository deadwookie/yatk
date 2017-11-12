import { types, IType } from 'mobx-state-tree'

import { Sequence } from './sequence'

export interface Cell {
	x: number
	y: number
	isChained: boolean
	sequenceIndex: number
}

export const Cell: IType<{}, Cell> = types
	.model('Cell', {
		x: types.number,
		y: types.number,
		isChained: types.optional(types.boolean, false),
		sequenceIndex: types.number
	})

export enum BoardGeometryType {
	Box = 'box',
	Spiral = 'spiral'
}

export interface Board {
	geometry: BoardGeometryType
	width: number
	movesCount: number
	sequence: Sequence

	generateCells: (seq: Sequence, geometryType: BoardGeometryType) => void
	generate: (length: number) => void
}

export const Board: IType<{}, Board> = types
	.model('Board', {
		geometry: types.string,
		width: types.number,
		movesCount: types.number,
		sequence: Sequence,
		cells: types.array(Cell)
	})
	.actions((self) => ({
		generateCells(seq: Sequence, geometryType: BoardGeometryType) {
			self.cells.splice(0)

			if (geometryType === BoardGeometryType.Box) {
				seq.values.forEach((_val, index) => {
					const isNotFirstRow = (index + 1) > self.width
					const fullRowsCount = Math.floor(index / self.width) * self.width

					self.cells.push({
						x: isNotFirstRow ? index - fullRowsCount : index,
						y: Math.ceil((index + 1) / self.width) - 1,
						sequenceIndex: index,
						isChained: false,
					})
				})
			} else if (geometryType === BoardGeometryType.Spiral) {
				seq.values.forEach((_val, _index) => {

				})
			}

			// throw new Error(`Unknown geometry type for the board: ${geometryType}`)
		}
	}))
	.actions((self) => ({
		generate(length: number) {
			self.sequence.generate(length)
			self.generateCells(self.sequence, BoardGeometryType.Box)
		},

		nextRound() {
			self.sequence.replicate()
			self.generateCells(self.sequence, BoardGeometryType.Box)
		},
	}))

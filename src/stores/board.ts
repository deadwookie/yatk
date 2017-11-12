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
		isChained: types.boolean,
		sequenceIndex: types.number
	})

export enum BoardGeometryType {
	Box = 'box',
	Spiral = 'spiral'
}

export interface Board {
	movesCount: number
	sequence: Sequence

	generateCells: (seq: Sequence, geometryType: BoardGeometryType) => void
	generate: (length: number) => void
}

export const Board: IType<{}, Board> = types
	.model('Board', {
		movesCount: types.number,
		sequence: Sequence,
		cells: types.array(Cell)
	})
	.actions((self) => ({
		generateCells(seq: Sequence, geometryType: BoardGeometryType) {
			if (geometryType === BoardGeometryType.Box) {
				seq.values.forEach((val, index) => {

				})
			} else if (geometryType === BoardGeometryType.Spiral) {
				seq.values.forEach((val, index) => {

				})
			}

			throw new Error(`Unknown geometry type for the board: ${geometryType}`)
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

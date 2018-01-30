import { BoardGeometryType, BoardSnapshot } from '../stores/board'
import { CollapseDirection } from '../stores/rules'

const SIZE = 8

export const defaultBoard: Partial<BoardSnapshot> = {
	worldKey: 'cube',
	levelKey: 'intro',

	isDummySequence: false,
	initialSequenceLength: SIZE * SIZE * 2,
	width: SIZE,
	height: SIZE,
	depth: SIZE,
	cellSizePx: 50,
	geometryType: BoardGeometryType.Box,

	movesCount: 0,
	round: 1,
	initialScore: 0,
	score: 0,

	cells: [],
	chain: [],
	sequence: [],
	rules: {
		targetSum: 10,
		targetLength: 2,
		deadPointIndex: SIZE * SIZE * SIZE,
		collapseDirection: CollapseDirection.ToTopLeft,
		isCollapseRows: false,
		isCollapseColumns: false,
	},
	behavior: {
		seqArrangeStepDelayMs: 5
	}
}

export const simplifiedBoard: Partial<BoardSnapshot> = {
	/*width: 8,
	height: 8,
	depth: 8,
	rules: {
		deadPointIndex: 8 * 8 * 8,
	}*/
}


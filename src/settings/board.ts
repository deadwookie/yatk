import { BoardGeometryType, BoardSnapshot } from '../stores/board'
import { CollapseDirection } from '../stores/rules'

export const defaultBoard: Partial<BoardSnapshot> = {
	worldKey: 'spiral',
	levelKey: 'intro',
	initialSequenceLength: 40,
	width: 8,
	height: 8,
	depth: 8,
	cellSizePx: 50,
	geometryType: BoardGeometryType.Box,

	movesCount: 0,
	round: 1,
	score: 1000,

	cells: [],
	chain: [],
	sequence: [],
	rules: {
		targetSum: 10,
		targetLength: 2,
		deadPointIndex: 8 * 8 * 8,
		collapseDirection: CollapseDirection.ToTopLeft,
		isCollapseRows: true,
		isCollapseColumns: false,
	},
	behavior: {
		seqArrangeStepDelayMs: 15
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


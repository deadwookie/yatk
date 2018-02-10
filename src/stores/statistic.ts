//             SCORE   TIME    ROUND   CELLS   DEPTH
//  AVG        1234    2.5m      21      140     6

// ==BEST==
// by score:   1234    2.5m      21      140     6
// by time:    1234    2.5m      21      140     6
// by round:   1234    2.5m      21      140     6
// by cells:   1234    2.5m      21      140     6

// ==LAST 5 OF 37 WINS & 10 LOSES==
//  #2382...   1234    2.5m      21      140     6
//  #2382...   1234    2.5m      21      140     6
//  #2382...   1234    2.5m      21      140     6
//  #2382...   1234    2.5m      21      140     6
//  #2382...   1234    2.5m      21      140     6

import { types, IType, IModelType } from 'mobx-state-tree'
import { assign } from 'lodash'

export enum FinishResult {
	Win = 'win',
	Fail = 'fail'
}

export interface Game {
	sequenceId: string
	version: string
	score: number
	round: number
	depth: number
	cells?: number
	time?: number
	// TODO: add history records (like success chains)
	finishResult?: FinishResult | null
}

export const Game: IModelType<{}, Game> = types
	.model('Game', {
		sequenceId: types.identifier(types.string),
		version: types.string,
		score: types.number,
		round: types.number,
		depth: types.number,
		cells: types.optional(types.number, 0),
		time: types.optional(types.number, 0),
		finishResult: types.maybe(types.union(types.literal(FinishResult.Win), types.literal(FinishResult.Fail))),
	})

export interface StatisticSnapshot {
	games: Array<Game>
	currentGame?: Game | null

	readonly totalGames?: number
	readonly winTotal?: number
	readonly failTotal?: number
}

export interface Statistic extends StatisticSnapshot {
	bestByScore: () => Game | null
	bestByRound: () => Game | null
	bestByCells: () => Game | null
	bestByTime: () => Game | null

	avgResults: () => void
	allResults: () => void
	bestResults: () => void

	clearHistory: () => void
	createGame: (gameData: Game) => void
	updateGame: (gameData: Game) => void
	finishGame: () => void
}

export const Statistic: IType<{}, Statistic> = types
	.model('Statistic', {
		games: types.array(types.reference(Game)),
		currentGame: types.maybe(Game)
	})
	.views((self) => ({
		get totalGames() {
			return self.games.length
		},
		get winTotal() {
			return 0
		},
		get failTotal() {
			return 0
		}
	}))
	.actions((_self) => ({
		bestByScore() {
			return null
		},

		bestByRound() {
			return null
		},

		bestByCells() {
			return null
		},

		bestByTime() {
			return null
		}
	}))
	.actions((self) => ({
		bestResults() {
			console.table([
				self.bestByScore(),
				self.bestByRound(),
				self.bestByCells(),
				self.bestByTime()
			])
		},

		allResults() {
			console.table(self.games.map(g => g))
		},

		avgResults() {
			console.log('TODO')
		},

		clearHistory() {
			self.games.splice(0)
		},

		createGame(gameData: Game) {
			self.currentGame = gameData
		},

		updateGame(gameData: Game) {
			self.currentGame = assign(self.currentGame, gameData)
		},

		finishGame() {
			if (self.currentGame) {
				self.games.push(self.currentGame)
			}
			// self.currentGame = null
		}
	}))

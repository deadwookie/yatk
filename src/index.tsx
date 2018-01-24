import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as _ from 'lodash'

import { AppContainer } from 'react-hot-loader'
import { HashRouter } from 'react-router-dom'

import { GameAnalytics } from 'gameanalytics'

import pkg from '../package.json'
import './index.css'
import App from './components/app'
import { Store } from './stores'
import { BoardGeometryType } from './stores/board'
import { CollapseDirection } from './stores/rules'

const settingsDefault = {
	appVersion: pkg.version,
	board: {
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
}

const settingsSimplified = {
	board: {
		width: 8,
		height: 8,
		depth: 8,
		rules: {
			deadPointIndex: 8 * 8 * 8,
		}
	}
}

const isSimplified = window.innerWidth < 960 || window.innerHeight < 960

const settings = isSimplified ? _.merge(settingsDefault, settingsSimplified) : settingsDefault
export const store = Store.create(settings)

export function runApp() {
	ReactDOM.render(
		<AppContainer>
			<HashRouter>
				<App store={store} />
			</HashRouter>
		</AppContainer>,
		document.getElementById('main')
	)
}

document.addEventListener('DOMContentLoaded', runApp, false)

if (process.env.NODE_ENV !== 'development') {
	GameAnalytics.setEnabledInfoLog(true)
	GameAnalytics.setEnabledVerboseLog(true)
	GameAnalytics.configureBuild(`proto-spiral v${store.appVersion}`)
	GameAnalytics.initialize('b5694a96ea75b08afa06d7921a90e0f1', 'f8817a8de00e142df8a41ef2d6acc562851ff873')
}

// Hot Module Replacement API
if (module.hot) {
	module.hot.accept('./components/app', runApp);
}

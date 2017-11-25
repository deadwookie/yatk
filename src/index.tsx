import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { AppContainer } from 'react-hot-loader'
import { HashRouter } from 'react-router-dom'

import './index.css'
import App from './components/app'
import { Store } from './stores'
import { BoardGeometryType } from './stores/board'
import { CollapseDirection } from './stores/rules'


export const store = Store.create({
	appVersion: '0.0.1',
	board: {
		initialSequenceLength: 36,
		width: 16,
		height: 16,
		geometryType: BoardGeometryType.Spiral,

		movesCount: 0,
		round: 1,
		score: 1000,

		cells: [],
		chain: [],
		sequence: [],
		rules: {
			targetSum: 10,
			targetLength: 2,
			deadPointIndex: 30,
			collapseDirection: CollapseDirection.ToDeadPoint,
			isCollapseRows: true,
			isCollapseColumns: true,
		},
		behavior: {
			seqArrangeStepDelayMs: 15
		}
	}
})

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

// Hot Module Replacement API
if (module.hot) {
	module.hot.accept('./components/app', runApp);
}

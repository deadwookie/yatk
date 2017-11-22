import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { AppContainer } from 'react-hot-loader'

import './index.css'
import App from './components/app'
import { Store } from './stores'
import { BoardGeometryType } from './stores/board'


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
			isCollapseRows: true,
			isCollapseColumns: true,
		}
	}
})

export function runApp() {
	ReactDOM.render(
		<AppContainer>
			<App store={store} />
		</AppContainer>,
		document.getElementById('main')
	)
}

document.addEventListener('DOMContentLoaded', runApp, false)

// Hot Module Replacement API
if (module.hot) {
	module.hot.accept('./components/app', runApp);
}

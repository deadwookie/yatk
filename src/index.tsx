import * as React from 'react'
import * as ReactDOM from 'react-dom'

import './index.css'
import App from './components/app'
import { Store } from './stores'
import { BoardGeometryType } from './stores/board'


const store = Store.create({
	appVersion: '0.0.1',
	board: {
		initialSequenceLength: 16,
		width: 16,
		height: 16,
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
			isCollapseRows: false,
			isCollapseColumns: false,
		}
	}
})
export function runApp() {
	ReactDOM.render(
		<App store={store} />,
		document.getElementById('main')
	)
}

document.addEventListener('DOMContentLoaded', runApp, false)

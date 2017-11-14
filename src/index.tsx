import * as React from 'react'
import * as ReactDOM from 'react-dom'

import './index.css'
import App from './components/app'
import { Store } from './stores'
import { BoardGeometryType } from './stores/board'


const store = Store.create({
	appVersion: '0.0.1',
	board: {
		geometry: BoardGeometryType.Spiral,
		maxSequenceLength: 256,
		initialSequenceLength: 16,
		movesCount: 0,
		round: 1,
		cells: [],
		sequence: {
			values: []
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

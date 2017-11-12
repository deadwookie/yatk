import * as React from 'react'
import * as ReactDOM from 'react-dom'

import './index.css'
import App from './components/app'
import { Store } from './stores'


const store = Store.create({
	appVersion: '0.0.1',
	board: {
		sequence: {
			movesCount: 0,
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

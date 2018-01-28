import * as React from 'react'
import * as ReactDOM from 'react-dom'
import pkg from '../package.json'

import { AppContainer } from 'react-hot-loader'
import { HashRouter } from 'react-router-dom'

import { GameAnalytics } from 'gameanalytics'

import './index.css'
import App from './components/app'

export function runApp() {
	ReactDOM.render(
		<AppContainer>
			<HashRouter>
				<App />
			</HashRouter>
		</AppContainer>,
		document.getElementById('main')
	)
}

document.addEventListener('DOMContentLoaded', runApp, false)

if (process.env.NODE_ENV !== 'development') {
	GameAnalytics.setEnabledInfoLog(true)
	GameAnalytics.setEnabledVerboseLog(true)
	GameAnalytics.configureBuild(`proto-spiral v${pkg.version}`)
	GameAnalytics.initialize('b5694a96ea75b08afa06d7921a90e0f1', 'f8817a8de00e142df8a41ef2d6acc562851ff873')
}

// Hot Module Replacement API
if (module.hot) {
	module.hot.accept('./components/app', runApp);
}

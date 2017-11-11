import * as React from 'react'
import * as ReactDOM from 'react-dom'

// AppContainer is a necessary wrapper component for HMR
// We use require because TypeScript type warning
const { AppContainer } = require('react-hot-loader')

import './index.css'
import App from 'components/App'

const render = (Component: any) => {
	ReactDOM.render(
		<AppContainer>
			<Component/>
		</AppContainer>,
		document.getElementById('main')
	)
}

render(App)

// TypeScript declaration for module.hot
declare var module: { hot: any }
// Hot Module Replacement API
if (module.hot) {
	// If we receive a HMR request for our App container, just re-render
	module.hot.accept('./components/App', () => {
		// render(App)
		const NextApp = require('components/App').default
		render(NextApp)
	})
}

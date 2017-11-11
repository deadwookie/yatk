import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { Provider } from 'mobx-react'

import './index.css'
import App from './components/App'
import { Store } from './stores'


const store = Store.create({})
export function runApp() {
	ReactDOM.render(
		<Provider store={store}>
			<App />
		</Provider>,
		document.getElementById('main')
	)
}

document.addEventListener('DOMContentLoaded', runApp, false)

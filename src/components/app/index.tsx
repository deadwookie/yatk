import * as React from 'react'
import * as style from './index.css'
import Header from './header'
import Matrix from './matrix'
import Footer from './footer'

import { StoreInjectedProps } from '../../stores'

export namespace App {
	export interface Props extends StoreInjectedProps{}
	export interface State {}
}

export class App extends React.Component<App.Props, App.State> {
	render() {
		const store = this.props.store

		return (
			<div className={style.main}>
				<Header />
				<Matrix store={store} />
				<Footer store={store} />
			</div>
		)
	}
}

export default App

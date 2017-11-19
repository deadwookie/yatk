import * as React from 'react'
import * as cls from 'classnames'
import * as style from './index.css'
import Header from './header'
import Matrix from './matrix'
import Footer from './footer'

import { StoreInjectedProps } from '../../stores'

export enum Theme {
	MatrixGreen = 'matrix',
}

export namespace App {
	export interface Props extends StoreInjectedProps {
		theme?: Theme
	}
	export interface State {}
}

export class App extends React.Component<App.Props, App.State> {
	static defaultProps: Partial<App.Props> = {
		theme: Theme.MatrixGreen,
	}

	render() {
		const {store, theme} = this.props

		return (
			<div className={cls(style.main, `theme-${theme}`)}>
				<Header />
				<Matrix store={store} />
				<Footer store={store} />
			</div>
		)
	}
}

export default App

import * as React from 'react'
import * as cls from 'classnames'
import * as style from './index.css'
import { HashRouter as Router, Route } from 'react-router-dom'
import Header from './header'
import Matrix from './matrix'
import Footer from './footer'
import Rain from '../rain'

import { StoreInjectedProps } from '../../stores'

export enum Theme {
	MatrixGreen = 'matrix',
}

export namespace App {
	export interface Props extends StoreInjectedProps {
		theme?: Theme
	}
	export interface State {
		isRainPaused: boolean
	}
}

export class App extends React.Component<App.Props, App.State> {
	static defaultProps: Partial<App.Props> = {
		theme: Theme.MatrixGreen,
	}

	state: App.State = {
		isRainPaused: false
	}

	render() {
		const {store, theme} = this.props

		// <Header />
		// <Matrix store={store} />
		// <Footer store={store} />
		return (
			<div className={cls(style.main, `theme-${theme}`)}>
				<Header />
				<Router>
					<div>
						<Route exact path='/' render={() => {
							return <Matrix store={store} />
						}}/>
						<Route exact path='/faq' render={() => {
							return <div>FAQ: TODO</div>
						}}/>
						<Route exact path='/rain' render={() => {
							return (
								<div>
									<button onClick={() => this.setState(({ isRainPaused }) => ({ isRainPaused: !isRainPaused }))}>
										{this.state.isRainPaused ? 'play' : 'pause'}
									</button>
									<Rain
										key='same'
										windowWidth={800}
										windowHeight={600}
										dropWidth={50}
										dropHeight={50}
										isPaused={this.state.isRainPaused}
									/>
								</div>
							)
						}}/>
					</div>
				</Router>

				<Footer store={store} />
			</div>
		)
	}
}

export default App

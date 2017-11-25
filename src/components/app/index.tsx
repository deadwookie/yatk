import * as React from 'react'
import * as cls from 'classnames'
import * as style from './index.css'
import { HashRouter as Router, Route } from 'react-router-dom'
import Header from './header'
import Matrix from './matrix'
import Footer from './footer'
import Meter from '../meter'
import Rain from '../rain'

import autobind from '../../utils/autobind'
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

	meter?: Meter | null

	render() {
		const {store, theme} = this.props

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
									<div className={style.meter}>
										<Meter ref={this.refMeter} />
									</div>

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
										onBeforeUpdate={this.onBeforeRainDrop}
										onAfterUpdate={this.onAfterRainDrop}
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

	@autobind
	refMeter(ref: Meter | null) {
		this.meter = ref
	}

	@autobind
	onBeforeRainDrop(_dt: number) {
		if (this.meter) this.meter.begin()
	}

	@autobind
	onAfterRainDrop(_dt: number) {
		if (this.meter) this.meter.end()
	}
}

export default App

import * as dis from 'dis-gui'
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
	export interface State extends Rain.Sizes {
		isAppBlurred: boolean
		isRainPaused: boolean
	}
}

export class App extends React.Component<App.Props, App.State> {
	static defaultProps: Partial<App.Props> = {
		theme: Theme.MatrixGreen,
	}

	state: App.State = {
		isAppBlurred: false,
		isRainPaused: false,
		windowWidth: 800,
		windowHeight: 600,
		dropWidth: 50,
		dropHeight: 50,
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
									<div className={style.rain}>
										<Rain
											isPaused={!this.isRaining()}
											windowWidth={this.state.windowWidth}
											windowHeight={this.state.windowHeight}
											dropWidth={this.state.dropWidth}
											dropHeight={this.state.dropHeight}
											onBeforeUpdate={this.onBeforeRainDrop}
											onAfterUpdate={this.onAfterRainDrop}
										/>
									</div>

									<div className={style.controls}>
										{this.renderControls()}
									</div>
									<div className={style.meter}>
										<Meter ref={this.refMeter} />
									</div>
								</div>
							)
						}}/>
					</div>
				</Router>

				<Footer store={store} />
			</div>
		)
	}

	renderControls() {
		return (
			<dis.GUI>
				<dis.Folder label='Matrix' expanded>
					<dis.Button
						label={this.isRaining() ? '⏸ Pause' : '▶️ Play'}
						onClick={this.onToggleRain}
					/>
					<dis.Folder label='Window' expanded>
						<dis.Number
							label='Window Width'
							value={this.state.windowWidth}
							min={640}
							max={window.innerWidth}
							step={20}
							onFinishChange={this.onWindowWidthChange}
						/>
						<dis.Number
							label='Window Height'
							value={this.state.windowHeight}
							min={480}
							max={window.innerHeight}
							step={20}
							onFinishChange={this.onWindowHeightChange}
						/>
					</dis.Folder>
					<dis.Folder label='Drop' expanded>
						<dis.Number
							label='Drop Width'
							value={this.state.dropWidth}
							min={10}
							max={100}
							step={5}
							onFinishChange={this.onDropWidthChange}
						/>
						<dis.Number
							label='Drop Height'
							value={this.state.dropHeight}
							min={10}
							max={100}
							step={10}
							onFinishChange={this.onDropHeightChange}
						/>
					</dis.Folder>
				</dis.Folder>
			</dis.GUI>
		)
	}

	componentDidMount() {
		window.addEventListener('blur', this.onWindowBlur)
		window.addEventListener('focus', this.onWindowFocus)
	}

	componentWillUnmount() {
		window.removeEventListener('blur', this.onWindowBlur)
		window.removeEventListener('focus', this.onWindowFocus)
	}

	isRaining() {
		return !this.state.isAppBlurred && !this.state.isRainPaused
	}

	@autobind
	onToggleRain() {
		this.setState(({ isRainPaused }) => ({ isRainPaused: !isRainPaused }))
	}

	@autobind
	onWindowWidthChange(windowWidth: number) {
		this.setState({ windowWidth })
	}

	@autobind
	onWindowHeightChange(windowHeight: number) {
		this.setState({ windowHeight })
	}

	@autobind
	onDropWidthChange(dropWidth: number) {
		this.setState({ dropWidth })
	}

	@autobind
	onDropHeightChange(dropHeight: number) {
		this.setState({ dropHeight })
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

	@autobind
	onWindowBlur() {
		this.setState({ isAppBlurred: true })
	}

	@autobind
	onWindowFocus() {
		this.setState({ isAppBlurred: false })
	}
}

export default App

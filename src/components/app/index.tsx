import * as dis from 'dis-gui'
import * as React from 'react'
import * as cls from 'classnames'
import * as style from './index.css'
import { HashRouter as Router, Route } from 'react-router-dom'
import { observer, inject, Provider } from 'mobx-react'
import Header from './header'
import Footer from './footer'
import Matrix from '../matrix'
import Meter from '../meter'
import Rain from '../rain'

import autobind from '../../utils/autobind'
import { StoreInjectedProps, AppStore } from '../../stores'
import { buildSettings } from '../../settings/app'

export enum Theme {
	MatrixGreen = 'matrix',
}

export namespace App {
	export interface Props {
		theme?: Theme
	}
	export interface State extends Rain.Sizes {
		isAppBlurred: boolean
		isRainPausedOnBlur: boolean
		isRainPaused: boolean
		pace: Rain.Props['pace']
	}
}

@inject('appStore') 
@observer
export class App extends React.Component<App.Props & StoreInjectedProps, App.State> {
	static defaultProps: Partial<App.Props> = {
		theme: Theme.MatrixGreen,
	}

	state: App.State = {
		isAppBlurred: false,
		isRainPausedOnBlur: true,
		isRainPaused: false,
		pace: Rain.defaultProps.pace,
		windowWidth: 800,
		windowHeight: 600,
		dropWidth: 50,
		dropHeight: 50,
	}

	meter?: Meter | null

	render() {
		const { theme } = this.props

		return (
			<div className={cls(style.main, `theme-${theme}`)}>
				<Header />
				<Router>
					<div>
						<Route exact path='/' render={() => {
							return <Matrix />
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
											pace={this.state.pace}
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

				<Footer />
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
					<dis.Checkbox
						label='Pause on Blur'
						checked={this.state.isRainPausedOnBlur}
						onChange={this.onToggleBlurMode}
					/>
					<dis.Number
						label='Pace'
						value={this.state.pace!}
						min={.01}
						max={5}
						step={.25}
						decimals={2}
						onFinishChange={this.onPaceChange}
					/>
					<dis.Folder label='Window'>
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
					<dis.Folder label='Drop'>
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
							step={5}
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
		const { isAppBlurred, isRainPausedOnBlur, isRainPaused } = this.state
		return (isRainPausedOnBlur ? !isAppBlurred : true) && !isRainPaused
	}

	@autobind
	onToggleRain() {
		this.setState(({ isRainPaused }) => ({ isRainPaused: !isRainPaused }))
	}

	@autobind
	onToggleBlurMode(isRainPausedOnBlur: boolean) {
		this.setState({ isRainPausedOnBlur })
	}

	@autobind
	onPaceChange(pace: number) {
		this.setState({ pace })
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

export function appStoreWrap<P extends App.Props = App.Props>(
	WrappedComponent: new () => React.Component<P, any>
) {
	return class extends React.Component<P, any> {
		appStore: AppStore

		componentWillMount() {
			this.appStore = AppStore.create(buildSettings(window.innerWidth, window.innerHeight))
		}

		render() {
			return (
				<Provider appStore={this.appStore}>
					<WrappedComponent {...this.props} />
				</Provider>
			)
		}
	}
}

export default appStoreWrap(App) as React.ComponentClass<App.Props>

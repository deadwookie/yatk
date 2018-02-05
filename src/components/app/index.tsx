import * as React from 'react'
import * as cls from 'classnames'
import * as style from './index.css'
import { HashRouter as Router, Route } from 'react-router-dom'
import { observer, inject, Provider } from 'mobx-react'
import Header from './header'
import Footer from './footer'
import Matrix from '../matrix'

import { StoreInjectedProps, AppStore } from '../../stores'
import { buildSettings } from '../../settings/app'

export enum Theme {
	MatrixGreen = 'matrix',
}

export namespace App {
	export interface Props {
		theme?: Theme
	}
	export interface State {}
}

@inject('appStore')
@observer
export class App extends React.Component<App.Props & StoreInjectedProps, App.State> {
	static defaultProps: Partial<App.Props> = {
		theme: Theme.MatrixGreen,
	}

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
					</div>
				</Router>

				<Footer />
			</div>
		)
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

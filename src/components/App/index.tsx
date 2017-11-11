import * as React from 'react'
import * as style from './index.css'
import Header from './header'

export namespace App {
	export interface Props {}
	export interface State {}
}

export class App extends React.Component<App.Props, App.State> {
	render() {
		return (
			<div className={style.main}>
				<Header />
				<section className={style.content}>Matrix!</section>
			</div>
		)
	}
}

export default App

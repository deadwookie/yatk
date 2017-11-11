import * as React from 'react'
import * as style from './index.css'

export namespace App {
	export interface Props {}
	export interface State {}
}

export class App extends React.Component<App.Props, App.State> {
	render() {
		return (
			<div className={style.main}>
				<span>Ha!</span>
			</div>
		)
	}
}

export default App

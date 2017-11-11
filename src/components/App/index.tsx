import * as React from 'react'
import * as style from './index.css'

export namespace App {
	export interface Props {}
	export interface State {}
}

export class App extends React.Component<App.Props, App.State> {

	// renderDevTool() {
	// 	if (process.env.NODE_ENV !== 'production') {
	// 		const DevTools = require('mobx-react-devtools').default
	// 		return (<DevTools />)
	// 	}
	//
	// 	return undefined
	// }

	render() {
		return (
			<div className={style.main}>
				{this.props.children}
				{/*this.renderDevTool()*/}
			</div>
		)
	}
}

export default App

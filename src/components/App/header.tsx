import * as React from 'react'
import * as style from './header.css'

export namespace Header {
	export interface Props {}
	export interface State {}
}

export class Header extends React.Component<Header.Props, Header.State> {
	render() {
		return (
			<header className={style.main}>
				<span className={style.logo}>√1Ⓡи$</span>
				<h1 className={style.title}>Virus: The Game</h1>
			</header>
		)
	}
}

export default Header

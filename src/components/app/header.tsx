import * as React from 'react'
import * as cls from './header.css'

export namespace Header {
	export interface Props {}
	export interface State {}
}

export class Header extends React.Component<Header.Props, Header.State> {
	render() {
		const title = '√1Ⓡи$'
		const slogan = 'Virus: The Game'

		return (
			<header className={cls.main}>
				<span className={cls.logo} title={title}>{title}</span>
				<h1 className={cls.title}>{slogan}</h1>
			</header>
		)
	}
}

export default Header

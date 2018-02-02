import * as React from 'react'
import * as join from 'classnames'

import * as cls from './particle.css'

import autobind from '../../utils/autobind'

export namespace Particle {
	export interface Props {
		x: number
		y: number
		onDone: () => void
	}
	export interface State {
		classNames: { [className: string]: boolean }
	}
}

export class Particle extends React.PureComponent<Particle.Props, Particle.State> {
	state: Particle.State = {
		classNames: {},
	}

	componentDidMount() {
		setTimeout(_ => this.setState(({ classNames }) => ({
			classNames: {
				...classNames,
				[cls.blow]: true,
			}
		})), 10)
	}

	render() {
		const { x, y, children } = this.props

		const className = join(cls.main, this.state.classNames)
		const styles: React.CSSProperties = {
			left: x,
			top: y,
		}

		return (
			<div className={className} style={styles} onTransitionEnd={this.onTransitionEnd}>
				{children}
			</div>
		)
	}

	@autobind
	onTransitionEnd() {
		this.props.onDone()
	}
}

export default Particle

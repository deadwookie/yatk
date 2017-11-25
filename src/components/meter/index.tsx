import Stats from 'stats.js'
import * as React from 'react'

import * as cls from './index.css'
import autobind from '../../utils/autobind'

export enum Mode {
	FPS = 0,
}

export namespace Meter {
	export interface Props {
		mode?: Mode
		isPaused?: boolean
	}
	export interface State {
	}
}

export class Meter extends React.Component<Meter.Props, Meter.State> {
	static defaultProps: Partial<Meter.Props> = {
		mode: Mode.FPS,
		isPaused: false,
	}

	$holder?: Element | null
	stats = this.setupStats()

	render() {
		return (
			<div className={cls.main} ref={this.refHolder} />
		)
	}

	componentWillReceiveProps(props: Meter.Props) {
		if (props.mode !== this.props.mode) {
			this.setupStats(this.stats, props)
		}
	}

	componentDidMount() {
		this.$holder!.appendChild(this.stats.dom)
	}

	begin() {
		if (this.props.isPaused) return

		this.stats.begin()
	}

	end() {
		if (this.props.isPaused) return

		this.stats.end()
	}

	@autobind
	protected refHolder($el: Element | null) {
		this.$holder = $el
	}

	protected setupStats(stats = new Stats(), props: Meter.Props = this.props) {
		stats.showPanel(props.mode!)
		return stats
	}
}

export default Meter

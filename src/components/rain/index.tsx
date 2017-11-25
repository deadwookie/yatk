import * as React from 'react'
import * as join from 'classnames'
import * as cls from './index.css'

import autobind from '../../utils/autobind'
import { generateNaturals, random } from '../../utils/numbers'
import { getGlyph } from '../../utils/chars'

export namespace Rain {
	export interface Drop {
		idx: number
		glyph: string
		char: number
	}
	export interface Stream {
		idx: number
		durationMs: number
		dropsOdd: Drop[]
		dropsEven: Drop[]
	}
	export interface Sizes {
		windowWidth: number
		windowHeight: number
		dropWidth: number
		dropHeight: number
	}

	export interface Animation {
		isPaused?: boolean
		onBeforeUpdate?: AnimationCb
		onAfterUpdate?: AnimationCb
	}
	export type AnimationCb = (dt: number) => void

	export interface Props extends Sizes, Animation {
	}
	export interface State {
		streams: Stream[]
	}
}

export class Rain extends React.Component<Rain.Props, Rain.State> {
	static defaultProps: Partial<Rain.Props> = {
		isPaused: false,
	}

	state: Rain.State = {
		streams: this.generateStreams(),
	}

	raf?: number | null
	initTime?: number | null
	prevTime?: number | null

	generateStreams(props: Rain.Sizes = this.props): Rain.Stream[] {
		const { windowWidth, windowHeight, dropWidth, dropHeight } = props
		const rows = Math.ceil(windowHeight / dropHeight)
		const cols = Math.ceil(windowWidth / dropWidth)
		const min = 3
		const half = rows > 7 ? Math.floor(rows / 2) : min

		return Array.from(Array(cols)).map<Rain.Stream>((_, idx) => ({
			idx,
			durationMs: random(1e3, 2.2e3),
			dropsOdd: this.generateDrops(idx, idx % 2 ? min : half , rows - 1),
			dropsEven: this.generateDrops(idx, idx % 2 ? half : min, rows - 1),
		}))
	}

	protected generateDrops(_streamIdx: number, minLength: number = 3, maxLength: number = 10): Rain.Drop[] {
		const length = random(minLength, maxLength + 1)
		return generateNaturals(length).map((char, idx) => ({
			idx,
			char,
			glyph: getGlyph(char, .3),
		}))
	}

	componentWillReceiveProps(props: Rain.Props) {
		const { isPaused } = props

		if (isPaused !== this.props.isPaused) {
			isPaused ? this.stop() : this.play()
		}

		const sizeProps = ['windowWidth', 'windowHeight', 'dropWidth', 'dropHeight']
		if (sizeProps.some((key: keyof Rain.Props) => props[key] !== this.props[key])) {
			this.setState({
				streams: this.generateStreams(props),
			})
		}
	}

	componentDidMount() {
		this.play()
	}

	componentWillUnmount() {
		this.stop()
	}

	play() {
		if (!this.raf) {
			this.raf = requestAnimationFrame(this.tick)
		}
	}

	stop() {
		if (this.raf) {
			cancelAnimationFrame(this.raf)
			this.raf = null
			this.prevTime = null
		}
	}

	@autobind
	async tick(time: number) {
		const { onBeforeUpdate, onAfterUpdate } = this.props

		// console.log(time)
		if (!this.initTime) this.initTime = time

		const dt = this.prevTime ? (time - this.prevTime) / 1e3 : 0

		if (onBeforeUpdate) await onBeforeUpdate(dt)

		await this.update(dt)

		if (onAfterUpdate) await onAfterUpdate(dt)

		this.prevTime = time
		this.raf = requestAnimationFrame(this.tick)
	}

	update(_dt: number) {
	}

	render() {
		const { windowWidth, windowHeight} = this.props

		const windowStyle = {
			width: `${windowWidth}px`,
			height: `${windowHeight}px`,
		}

		return (
			<article className={cls.main} style={windowStyle}>
				{this.renderStreams()}
			</article>
		)
	}

	renderStreams() {
		const { streams } = this.state
		const { dropWidth, isPaused } = this.props
		const baseStyle = {
			width: `${dropWidth}px`,
			animationName: cls.fallThrough,
			animationIterationCount: 'infinite',
			animationTimingFunction: 'linear',
			animationPlayState: isPaused ? 'paused' : 'running',
		}

		const res: React.ReactElement<any>[] = []

		for (const { idx, dropsOdd, dropsEven, durationMs } of streams) {
			const left = `${idx * dropWidth}px`
			const animationDuration = `${durationMs}ms`
			const delay = random(1e2, 2e3)

			res.push(
				<ul key={`odd-${idx}`}
					className={join(cls.stream, cls.odd)}
					style={{
						...baseStyle,
						left,
						animationDuration,
						animationDelay: `${delay}ms`,
					}}
				>
					{this.renderDrops(dropsOdd)}
				</ul>,
				<ul key={`even-${idx}`}
					className={join(cls.stream, cls.even)}
					style={{
						...baseStyle,
						left,
						animationDuration,
						animationDelay: `${delay + durationMs / 2}ms`,
					}}
				>
					{this.renderDrops(dropsEven)}
				</ul>,
			)
		}

		return res
	}

	renderDrops(drops: Rain.Drop[]) {
		const { dropWidth, dropHeight } = this.props
		const style = {
			width: `${dropWidth}px`,
			height: `${dropHeight}px`,
			fontSize: `${Math.min(dropWidth, dropHeight)}px`,
		}

		return drops.map(({ idx, glyph }) => (
			<li key={`drop-${idx}`} className={cls.drop} style={style}>
				<span className={cls.symbol}>
					{glyph}
				</span>
			</li>
		))
	}
}

export default Rain

import * as React from 'react'
import * as join from 'classnames'
import * as cls from './index.css'

import autobind from '../../utils/autobind'
import { generateNaturals, random } from '../../utils/numbers'
import { getGlyph } from '../../utils/chars'

export namespace Rain {
	export interface StreamPos {
		idx: number
		top: number
		// isReversed?: boolean
		$odd: Element | null
		$even: Element | null
	}

	export type StreamPositions = StreamPos[]

	export interface Drop {
		idx: number
		glyph: string
		char: number
	}
	export interface Stream {
		idx: number
		delay: number
		speed: number
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
		pace?: number
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
		pace: 1,
		isPaused: false,
	}

	state: Rain.State = {
		streams: this.generateStreams(),
	}

	raf?: number | null
	initTime?: number | null
	prevTime?: number | null
	positions: Rain.StreamPositions = []

	generateStreams(props: Rain.Props = this.props): Rain.Stream[] {
		const { windowWidth, windowHeight, dropWidth, dropHeight, pace = 1 } = props
		const rows = Math.ceil(windowHeight / dropHeight)
		const cols = Math.ceil(windowWidth / dropWidth)
		const min = 3
		const half = rows > 7 ? Math.floor(rows / 2) : min
		const fragments = 1e3

		return Array.from(Array(cols)).map((_, idx): Rain.Stream => ({
			idx,
			delay: random(0, 1 * fragments),
			speed: pace * random(.5 * fragments, 1.5 * fragments) / fragments,
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

		const sizeProps = [
			'windowWidth',
			'windowHeight',
			'dropWidth',
			'dropHeight',
			'pace',
		]
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

	update(dt: number) {
		const { windowHeight } = this.props
		const { streams } = this.state

		for (const { idx, $even, $odd, top: prevTop } of this.positions) {
			const stream = streams[idx]
			if (!stream) continue

			let top = prevTop + dt * stream.speed
			if (top >= 1) top = -1

			// const isReversed = top >= 0
			const evenCoeff = top >= 0 ? 1 : -1
			const yOdd = windowHeight * top
			const yEven = yOdd - evenCoeff * windowHeight

			if ($odd) {
				(($odd as any).style as React.CSSProperties).transform = `translateY(${yOdd}px)`
			}
			if ($even) {
				(($even as any).style as React.CSSProperties).transform = `translateY(${yEven}px)`
			}

			// keep the actual position
			this.positions[idx].top = top
		}
	}

	render() {
		const { windowWidth, windowHeight, isPaused } = this.props

		const windowStyle = {
			width: `${windowWidth}px`,
			height: `${windowHeight}px`,
		}

		return (
			<article className={join(cls.main, isPaused && cls.paused)} style={windowStyle}>
				{this.renderStreams()}
			</article>
		)
	}

	renderStreams() {
		const { streams } = this.state
		const { dropWidth } = this.props
		const baseStyle = {
			width: `${dropWidth}px`,
		}

		return streams.reduce<React.ReactElement<any>[]>((res, { dropsOdd, dropsEven }, idx) => {
			const left = `${idx * dropWidth}px`

			return res.concat(
				<ul key={`odd-${idx}`}
					ref={$el => this.refStream(idx, 'odd', $el)}
					className={join(cls.stream, cls.odd)}
					style={{
						...baseStyle,
						left,
					}}
				>
					{this.renderDrops(dropsOdd)}
				</ul>,
				<ul key={`even-${idx}`}
					ref={$el => this.refStream(idx, 'even', $el)}
					className={join(cls.stream, cls.even)}
					style={{
						...baseStyle,
						left,
					}}
				>
					{this.renderDrops(dropsEven)}
				</ul>,
			)
		}, [])
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

	@autobind
	refStream(idx: number, dir: 'odd' | 'even', $el: Element | null) {
		if (!this.positions[idx]) {
			this.positions[idx] = {
				idx,
				top: -1,
				$odd: null,
				$even: null,
			}
		}

		this.positions[idx][dir === 'odd' ? '$odd' : '$even'] = $el
	}
}

export default Rain

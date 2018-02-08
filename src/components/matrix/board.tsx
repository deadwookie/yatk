import * as React from 'react'
import * as join from 'classnames'
// import { findDOMNode } from 'react-dom'
import { inject, observer } from 'mobx-react'

import * as cls from './index.css'

import { autobind } from '../../utils/decorators'
// import { throttle } from '../../utils/decorators'
import { StoreInjectedProps } from '../../stores'
import { Cell, CellStack, FinishResult } from '../../stores/board'
import CellElement from './cell'
import Particle from './particle'

export namespace Board {
	export interface Props {}
	export interface State {
		blowing: Cell[]
	}
}

@observer
export class Board extends React.Component<Board.Props & StoreInjectedProps, Board.State> {
	state: Board.State = {
		blowing: [],
	}
	$board: Element | null

	componentDidMount() {
		this.props.appStore.board.newGame()

		// window.addEventListener('resize', this.scaleBoard)
		// this.scaleBoard()
	}

	// componentWillUnmount() {
	// 	window.removeEventListener('resize', this.scaleBoard)
	// }

	// @autobind
	// @throttle(200)
	// protected scaleBoard() {
	// 	if (!this.$board) return

	// 	const { width, height, cellSizePx } = this.props.appStore.board
	// 	const winWidth = window.innerWidth
	// 	const winHeight = window.innerHeight

	// 	// We need to keep ratio, so lookin' for a smallest dimension
	// 	const zoom = Math.min(
	// 		width * cellSizePx > winWidth ? winWidth / (width * cellSizePx) : 1,
	// 		height * cellSizePx > winHeight ? winHeight / (height * cellSizePx) : 1,
	// 	)

	// 	;((findDOMNode(this.$board) as any).style as React.CSSProperties).transform = `scale(${zoom})`
	// }

	render() {
		const { width, height } = this.props.appStore.board
		const styles = {
			'--xn': width,
			'--yn': height,
		}

		return (
			<div className={cls.board} style={styles} ref={this.refBoard}>
				{this.renderCells()}
				{this.renderBlowing()}
				{this.renderCursor()}
				{this.renderAlerts()}
			</div>
		)
	}

	renderCells() {
		const { appStore } = this.props

		return appStore.board.visibilityStacks.map((stack: CellStack) => {
			const topCell = stack.top
			return (
				<CellElement
					key={'box-cell-' + stack.key}
					stack={stack}
					isCursor={topCell === appStore.board.cursor}
					isDeadPoint={topCell === appStore.board.deadPoint}
				/>
			)
		})
	}

	renderBlowing() {
		const { board } = this.props.appStore
		if (!board.blowingCells.length) {
			return null
		}

		return board.blowingCells.map((cell) => (
			<Particle
				key={`blowing-${cell.key}`}
				x={cell.x}
				y={cell.y}
				onDone={() => board.unBlowCell(cell)}
			>
				{cell.glyph}
			</Particle>
		))
	}

	renderCursor() {
		const { board } = this.props.appStore
		if (board.finishResult) {
			// We don't need it at the end
			return null
		}

		const cursor = board.cursor && board.cells[board.cursor.index - 1]
		if (!cursor) {
			return null
		}

		const className = join({
			[cls.cursor]: true,
			[cls.isActive]: board.isProcessing,
		})

		const styles = {
			'--x': cursor.x,
			'--y': cursor.y,
		}

		return (
			<div className={className} style={styles} />
		)
	}

	// TODO: support different alerts/messages
	renderAlerts() {
		const { board } = this.props.appStore

		if (!board.finishResult) {
			return null
		}

		return (
			<aside className={cls.alert}>
				<p className={cls.message}>{board.finishResult === FinishResult.Win ? 'You Win' : 'Game Over'}</p>
			</aside>
		)
	}

	@autobind
	refBoard($el: Element | null) {
		this.$board = $el
	}
}

export default inject('appStore')(Board) as React.ComponentClass<Board.Props>

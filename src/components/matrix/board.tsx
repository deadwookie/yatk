import * as React from 'react'
import * as join from 'classnames'
import { findDOMNode } from 'react-dom'
import { inject, observer } from 'mobx-react'

import * as style from './board.css'

import { autobind, throttle } from '../../utils/decorators'
import { StoreInjectedProps } from '../../stores'
import { Cell, FinishResult } from '../../stores/board'
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

		window.addEventListener('resize', this.scaleBoard)
		this.scaleBoard()
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.scaleBoard)
	}

	@autobind
	@throttle(200)
	protected scaleBoard() {
		if (!this.$board) return

		const { width, height, cellSizePx } = this.props.appStore.board
		const winWidth = window.innerWidth
		const winHeight = window.innerHeight

		// We need to keep ratio, so lookin' for a smallest dimension
		const zoom = Math.min(
			width * cellSizePx > winWidth ? winWidth / (width * cellSizePx) : 1,
			height * cellSizePx > winHeight ? winHeight / (height * cellSizePx) : 1,
		)

		;((findDOMNode(this.$board) as any).style as React.CSSProperties).transform = `scale(${zoom})`
	}

	render() {
		const { board } = this.props.appStore

		return (
			<div className={style.board} ref={this.refBoard} style={{ width: board.width * board.cellSizePx, height: board.height * board.cellSizePx }}>
				{this.renderCells()}
				{this.renderBlowing()}
				{this.renderCursor()}
				{this.renderAlerts()}
			</div>
		)
	}

	renderCells() {
		const { appStore } = this.props

		return appStore.board.visibleCells.map((cell: Cell) => {
			return (
				<CellElement
					key={'box-cell-' + cell.key}
					cell={cell}
					isCursor={cell === appStore.board.cursor}
					isDeadPoint={cell === appStore.board.deadPoint}
					onBlow={this.onCellIsGonnaBlow}
				/>
			)
		})
	}

	renderBlowing() {
		const { blowing } = this.state
		if (!blowing.length) {
			return null
		}

		const { cellSizePx } = this.props.appStore.board

		return blowing.map((cell) => (
			<Particle
				key={`blowing-${cell.key}`}
				x={cellSizePx * cell.x}
				y={cellSizePx * cell.y}
				onDone={() => this.onCellHasBeenBlown(cell)}
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

		const cls = join({
			[style.cursor]: true,
			[style.isActive]: board.isProcessing,
		})

		const styles = {
			left: cursor.x * board.cellSizePx,
			top: cursor.y * board.cellSizePx,
		}

		return (
			<div className={cls} style={styles} />
		)
	}

	// TODO: support different alerts/messages
	renderAlerts() {
		const { board } = this.props.appStore

		if (!board.finishResult) {
			return null
		}

		return (
			<aside className={style.alert}>
				<p className={style.message}>{board.finishResult === FinishResult.Win ? 'You Win' : 'Game Over'}</p>
			</aside>
		)
	}

	@autobind
	refBoard($el: Element | null) {
		this.$board = $el
	}

	@autobind
	onCellIsGonnaBlow(cell: Cell) {
		this.setState(({blowing}) => {
			return !~blowing.indexOf(cell) ? { blowing: [cell].concat(blowing) } : undefined
		})
	}

	@autobind
	onCellHasBeenBlown(cell: Cell) {
		this.setState(({blowing}) => ({
			blowing: blowing.filter(c => c !== cell),
		}))
	}
}

export default inject('appStore')(Board) as React.ComponentClass<Board.Props>

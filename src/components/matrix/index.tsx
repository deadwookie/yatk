import * as React from 'react'
import * as join from 'classnames'
import { findDOMNode } from 'react-dom'
import { inject, observer } from 'mobx-react'

import * as style from './index.css'

import { autobind, throttle } from '../../utils/decorators'
import { StoreInjectedProps } from '../../stores'
import { Cell, FinishResult } from '../../stores/board'
import CellElement from './cell'

export namespace Matrix {
	export interface Props {}
	export interface State {}
}

@observer
export class Matrix extends React.Component<Matrix.Props & StoreInjectedProps, Matrix.State> {
	$board: Element | null

	componentDidMount() {
		this.props.appStore.board.newGame()

		// window.addEventListener('resize', this.scaleBoard)
		// this.scaleBoard()
	}

	// componentWillUnmount() {
	// 	window.removeEventListener('resize', this.scaleBoard)
	// }

	@autobind
	@throttle(200)
	protected scaleBoard() {
		if (!this.$board) return

		const { width, height, cellSizePx } = this.props.appStore.board
		const { innerWidth, innerHeight } = window

		// We need to keep ratio, so lookin' for a smallest dimension
		const zoom = Math.min(
			width * cellSizePx > innerWidth ? innerWidth / (width * cellSizePx) : 1,
			height * cellSizePx > innerHeight ? innerHeight / (height * cellSizePx) : 1,
		)

		;((findDOMNode(this.$board) as any).style as React.CSSProperties).transform = `scale(${zoom})`
	}

	render() {
		const { board } = this.props.appStore

		const isGonnaLoose = board.strain.length > board.freeSpaceLeft

		return (
			<section className={style.main}>
				<header>
					<dl className={style.info}>
						<dt className={style.term}>Depth:</dt>
						<dd className={style.desc}>{board.currentStage + 1}/{board.maxStage}</dd>
						<dt className={style.term}>Infected:</dt>
						<dd className={style.desc}>{board.strain.length} cells</dd>
						<dt className={join(style.term, isGonnaLoose && style.warn)}>Rest:</dt>
						<dd className={join(style.desc, isGonnaLoose && style.warn)}>{board.freeSpaceLeft} cells</dd>
					</dl>
				</header>
				<div className={style.board} ref={this.refBoard} style={{ width: board.width * board.cellSizePx, height: board.height * board.cellSizePx }}>
					{this.renderCells()}
					{this.renderCursor()}
					{this.renderAlerts()}
				</div>
				<nav className={style.actions}>
					<button onClick={this.onNextRoundClick}>Next Round</button>
				</nav>
				<footer>
					<dl className={style.info}>
						<dt className={style.term}>Round</dt>
						<dd className={style.desc}>#{board.round}</dd>
						<dt className={style.term}>Score:</dt>
						<dd className={style.desc}>{board.score} points</dd>
						<dd className={style.desc}>{board.movesCount * 2} cells cleared</dd>
					</dl>
					<button onClick={this.onRestartClick}>New Game</button>
				</footer>

				{this.renderOverlay()}
			</section>
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
				/>
			)
		})
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

	renderOverlay() {
		const { board } = this.props.appStore

		if (!board.isProcessing) {
			return null
		}

		return (
			<div className={style.freezeOverlay}/>
		)
	}

	@autobind
	onRestartClick() {
		this.props.appStore.board.newGame()
	}

	@autobind
	onNextRoundClick() {
		this.props.appStore.board.nextRound()
	}

	@autobind
	refBoard($el: Element | null) {
		this.$board = $el
	}
}

export default inject('appStore')(Matrix) as React.ComponentClass<Matrix.Props>

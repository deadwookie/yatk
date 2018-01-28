import * as React from 'react'
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

		return (
			<section className={style.main}>
				<header>
					<dl className={style.info}>
						<dt className={style.term}>Round</dt>
						<dd className={style.desc}>#{board.round}</dd>
						<dt className={style.term}>Depth:</dt>
						<dd className={style.desc}>{board.currentStage + 1}</dd>
						<dt className={style.term}>Score:</dt>
						<dd className={style.desc}>{board.score} points</dd>
					</dl>
				</header>
				<nav className={style.actions}>
					<button onClick={this.onNextRoundClick}>Next Round</button>
				</nav>
				<div className={style.board} ref={this.refBoard} style={{ width: board.width * board.cellSizePx, height: board.height * board.cellSizePx }}>
					{this.renderCells()}
					{this.renderAlerts()}
				</div>
				<footer>
					<dl className={style.info}>
						<dt className={style.term}>Moves:</dt>
						<dd className={style.desc}>{board.movesCount}</dd>
						<dt className={style.term}>Sequence length:</dt>
						<dd className={style.desc}>{board.sequence.filter(v => v.value !== null).length}</dd>
					</dl>
					<button onClick={this.onRestartClick}>New Game</button>
				</footer>
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

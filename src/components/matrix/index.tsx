import * as React from 'react'
import { findDOMNode } from 'react-dom'
import { observer } from 'mobx-react'

import * as style from './index.css'

import { autobind, throttle } from '../../utils/decorators'
import { StoreInjectedProps } from '../../stores'
import { Cell, FinishResult } from '../../stores/board'
import { CellElement } from './cell'

export namespace Matrix {
	export interface Props extends StoreInjectedProps {}
	export interface State {}
}

@observer
export class Matrix extends React.Component<Matrix.Props, Matrix.State> {
	$board: Element | null

	componentDidMount() {
		this.props.store.board.newGame()

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

		const { width, height, cellSizePx } = this.props.store.board
		const { innerWidth, innerHeight } = window

		// We need to keep ratio, so lookin' for a smallest dimension
		const zoom = Math.min(
			width * cellSizePx > innerWidth ? innerWidth / (width * cellSizePx) : 1,
			height * cellSizePx > innerHeight ? innerHeight / (height * cellSizePx) : 1,
		)

		;((findDOMNode(this.$board) as any).style as React.CSSProperties).transform = `scale(${zoom})`
	}

	render() {
		const { board } = this.props.store

		return (
			<section className={style.main}>
				<header>
					<dl className={style.info}>
						<dt className={style.term}>Score:</dt>
						<dd className={style.desc}>{board.score} points</dd>
						<dt className={style.term}>Round</dt>
						<dd className={style.desc}>#{board.round}</dd>
						<dt className={style.term}>Moves:</dt>
						<dd className={style.desc}>{board.movesCount}</dd>
						<dt className={style.term}>Sequence length:</dt>
						<dd className={style.desc}>{board.sequence.filter(v => v.value !== null).length}</dd>
						<dt className={style.term}><a onClick={this.onRestartClick}>New Game</a></dt>
					</dl>
				</header>
				<div className={style.board} ref={this.refBoard}>
					{this.renderCells()}
					{this.renderAlerts()}
				</div>
			</section>
		)
	}

	renderCells() {
		const { store } = this.props

		if (store.board.cells.length) {
			return store.board.cells.map((cell: Cell) => {
				return (
					<CellElement
						key={'box-cell-' + cell.key}
						store={store}
						cell={cell}
						isCursor={cell === store.board.cursor}
						isDeadPoint={cell === store.board.deadPoint}
					/>
				)
			})
		}

		return null
	}

	// TODO: support different alerts/messages
	renderAlerts() {
		const { board } = this.props.store

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
		this.props.store.board.newGame()
	}

	@autobind
	onNextRoundClick() {
		this.props.store.board.nextRound()
	}

	@autobind
	refBoard($el: Element | null) {
		this.$board = $el
	}
}

export default Matrix

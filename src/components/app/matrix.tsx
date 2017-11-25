import * as React from 'react'
import { observer } from 'mobx-react'
import { Link } from 'react-router-dom'

import * as style from './matrix.css'

import autobind from '../../utils/autobind'
import { StoreInjectedProps } from '../../stores'
import { Cell, FinishResult } from '../../stores/board'
import { CellElement } from './cell'

export namespace Matrix {
	export interface Props extends StoreInjectedProps {}
	export interface State {}
}

@observer
export class Matrix extends React.Component<Matrix.Props, Matrix.State> {
	componentDidMount() {
		this.props.store.board.generate()
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
						<dd className={style.desc}>{board.sequence.length}</dd>
						<dt className={style.term}><a onClick={this.onRestartClick}>New Game</a></dt>
						<dd className={style.desc}></dd>
						<dt className={style.term}><Link to='/faq'>FAQ</Link></dt>
					</dl>
				</header>
				<div className={style.board}>
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
						isEndCursor={cell === store.board.endCursor}
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
}

export default Matrix

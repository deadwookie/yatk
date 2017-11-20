import * as React from 'react'
import { observer } from 'mobx-react'

import * as style from './matrix.css'

import autobind from '../../utils/autobind'
import { StoreInjectedProps } from '../../stores'
import { Cell } from '../../stores/board'
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
					<div className={style.actions}>
						<button className={style.action} onClick={this.onRestartClick}>Restart</button>
						<button className={style.action} onClick={this.onNextRoundClick}>Next round</button>
					</div>
					<dl className={style.info}>
						<dt className={style.term}>Score:</dt>
						<dd className={style.desc}>{board.score} points</dd>
						<dt className={style.term}>Round</dt>
						<dd className={style.desc}>#{board.round}</dd>
						<dt className={style.term}>Moves:</dt>
						<dd className={style.desc}>{board.movesCount}</dd>
						<dt className={style.term}>Sequence length:</dt>
						<dd className={style.desc}>{board.sequence.length}</dd>
					</dl>
				</header>
				<div className={style.board}>
					{this.renderCells()}
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
					/>
				)
			})
		}

		return null
	}

	@autobind
	onRestartClick() {
		this.props.store.board.newGame(this.props.store.board.initialSequenceLength)
	}

	@autobind
	onNextRoundClick() {
		this.props.store.board.nextRound()
	}
}

export default Matrix

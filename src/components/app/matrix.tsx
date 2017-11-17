import * as React from 'react'
import { observer } from 'mobx-react'

import * as style from './matrix.css'

import autobind from '../../utils/autobind'
import { StoreInjectedProps } from '../../stores'

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
			<section className={style.content}>
				<header>
					<div className={style.actions}>
						<button onClick={this.onRestartClick}>Restart</button>
						<button onClick={this.onNextRoundClick}>Next round</button>
					</div>
					<dl className={style.info}>
						<dt>Round #</dt>
						<dd>{board.round}</dd>
						<dt>Moves:</dt>
						<dd>{board.movesCount}</dd>
						<dt>Sequence length:</dt>
						<dd>{board.sequence.length}</dd>
					</dl>
				</header>
				<div className={style.board}>
					{this.renderCells()}
				</div>
			</section>
		)
	}

	renderCells() {
		if (this.props.store.board.cells.length) {
			return this.props.store.board.cells.map((cell) => {
				const positionStyle = {
					left: cell.x * 50,
					top: cell.y * 50,
				}

				const value = cell.sequenceValue ? cell.sequenceValue.value : cell.glyph
				return (
					<div className={style.cell} key={'box-cell-' + cell.key} style={positionStyle}>{value}</div>
				)
			})
		}

		return null
	}

	@autobind
	onRestartClick() {
		this.props.store.board.generate(this.props.store.board.initialSequenceLength)
	}

	@autobind
	onNextRoundClick() {
		this.props.store.board.nextRound()
	}
}

export default Matrix

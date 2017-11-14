import * as React from 'react'
import { observer } from 'mobx-react'

import * as style from './matrix.css'

import autobind from '../../utils/autobind'
import { StoreInjectedProps } from '../../stores'
import { BoardGeometryType } from '../../stores/board'

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
						<dd>{board.sequence.values.length}</dd>
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
			if (this.props.store.board.geometry === BoardGeometryType.Box) {
				return this.renderCellsBox()
			} else if (this.props.store.board.geometry === BoardGeometryType.Spiral) {
				return this.renderCellsSpiral()
			}
		}

		return null
	}

	renderCellsBox() {
		return this.props.store.board.cells.map((cell, idx) => {
			const positionStyle = {
				left: cell.x * 50,
				top: cell.y * 50,
			}
			return (
				<div className={style.cell} key={'box-cell-' + idx} style={positionStyle}>{cell.glyph || cell.sequenceIndex}</div>
			)
		})
	}

	renderCellsSpiral() {
		const {x: minX, y: minY} = this.props.store.board.cells.reduce((acc, cell) => {
			if (!acc || ((cell.x < acc.x && cell.y <= acc.y) || (cell.y < acc.y && cell.x <= acc.x))) {
				acc = cell
			}

			return acc
		})

		// console.log(minX, minY)

		return this.props.store.board.cells.map((cell, idx) => {
			const positionStyle = {
				left: (cell.x - minX) * 50,
				top: (cell.y - minY) * 50,
			}
			return (
				<div className={style.cell} key={'spiral-cell-' + idx} style={positionStyle}>{cell.glyph || cell.sequenceIndex}</div>
			)
		})
	}

	@autobind
	onRestartClick() {
		this.props.store.board.generate(32)
	}

	@autobind
	onNextRoundClick() {
		this.props.store.board.nextRound()
	}
}

export default Matrix

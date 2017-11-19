import * as React from 'react'
import { observer } from 'mobx-react'

import * as style from './cell.css'

import autobind from '../../utils/autobind'
import { StoreInjectedProps } from '../../stores'
import { Cell } from '../../stores/board'

export namespace CellElement {
	export interface Props extends StoreInjectedProps {
		cell: Cell
	}
	export interface State {}
}

@observer
export class CellElement extends React.Component<CellElement.Props, CellElement.State> {

	render() {
		const { cell } = this.props

		const positionStyle = {
			left: cell.x * 50,
			top: cell.y * 50,
			color: cell.isChained ? 'red' : 'black'
		}

		const value = cell.sequenceValue ? cell.sequenceValue.value : cell.glyph
		return (
			<div
				className={style.cell}
				style={positionStyle}
				onClick={this.onCellClick}>
				{value}
			</div>
		)
	}

	@autobind
	onCellClick() {
		this.props.store.board.addToChain(this.props.cell)
	}
}

export default CellElement

import * as React from 'react'
import * as join from 'classnames'
import { observer } from 'mobx-react'

import * as cls from './cell.css'

import autobind from '../../utils/autobind'
import { StoreInjectedProps } from '../../stores'
import { Cell } from '../../stores/board'

export namespace CellElement {
	export interface Props extends StoreInjectedProps {
		cell: Cell
		isCursor: boolean
		isDeadPoint: boolean
	}
	export interface State {}
}

@observer
export class CellElement extends React.Component<CellElement.Props, CellElement.State> {
	render() {
		const { cell, store } = this.props
		const { cellSizePx, currentStage } = this.props.store.board
		
		const positionStyle: React.CSSProperties = {
			opacity: (cell.z + 1) / (currentStage + 1),
			left: cell.x * cellSizePx,
			top: cell.y * cellSizePx,
		}

		const className = join({
			[cls.main]: true,
			[cls.isChar]: cell.isValueSequence,
			[cls.isClear]: cell.isNullSequence,
			[cls.isEmpty]: cell.isEmpty,
			[cls.isActive]: cell.isChained,
			[cls.isCursor]: this.props.isCursor,
			[cls.isDeadPoint]: this.props.isDeadPoint,
		})

		const z = cell.z + 1
		const value = cell.sequenceValue
			? (cell.sequenceValue.value === null ? '•' : cell.sequenceValue.value)
			: cell.glyph

		return (
			<div
				className={className}
				style={positionStyle}
				onClick={this.onCellClick}
			>
				<span className={cls.symbol} data-value={value}>
					{value}
				</span>
				<small className={cls.depth}>{z}</small>
			</div>
		)
	}

	@autobind
	onCellClick() {
		if (this.props.isCursor) {
			this.props.store.board.nextRound()
		} else {
			if (this.props.cell.isChained) {
				this.props.store.board.removeFromChain(this.props.cell)
			} else {
				this.props.store.board.addToChain(this.props.cell)
			}
		}
	}
}

export default CellElement

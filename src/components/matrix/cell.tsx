import * as React from 'react'
import * as join from 'classnames'
import { inject, observer } from 'mobx-react'

import * as cls from './cell.css'

import autobind from '../../utils/autobind'
import { StoreInjectedProps } from '../../stores'
import { Cell } from '../../stores/board'

export namespace CellElement {
	export interface Props {
		cell: Cell
		isCursor: boolean
		isDeadPoint: boolean
	}
	export interface State {}
}

@observer
export class CellElement extends React.Component<CellElement.Props & StoreInjectedProps, CellElement.State> {
	render() {
		const { cell, appStore } = this.props
		const { cellSizePx, currentStage } = appStore.board

		const isEmpty = cell.isEmpty || cell.isNullSequence

		const className = join({
			[cls.main]: true,
			// [cls.isChar]: cell.isValueSequence,
			// [cls.isClear]: cell.isNullSequence,
			// [cls.isEmpty]: cell.isEmpty,
			[cls.isEmpty]: isEmpty,
			[cls.isChar]: !isEmpty,
			[cls.isActive]: cell.isChained,
			[cls.isCursor]: this.props.isCursor,
			[cls.isDeadPoint]: this.props.isDeadPoint,
		})

		const ratio = 1 - ( (currentStage - cell.z) / 10 / 1.5 )
		const blur = Math.min(currentStage - cell.z, 4)

		const styles: React.CSSProperties = {
			left: cell.x * cellSizePx,
			top: cell.y * cellSizePx,
			// opacity: (cell.z + 1) / (currentStage + 1),
			filter: !isEmpty && blur > 0 ? `blur(${blur}px)` : undefined,
			transform: !isEmpty && ratio < 1 ? `scale(${ratio}, ${ratio})` : undefined,
		}

		const value = cell.sequenceValue && cell.sequenceValue.value !== null ? cell.sequenceValue.value : cell.glyph
		// const value = cell.sequenceValue
		// 	? (cell.sequenceValue.value === null ? '•' : cell.sequenceValue.value)
		// 	: cell.glyph

		return (
			<div
				className={className}
				style={styles}
				onClick={this.onCellClick}
			>
				<span className={cls.symbol} data-value={value}>
					{value}
				</span>
				{/* <small className={cls.depth}>{cell.z + 1}</small> */}
			</div>
		)
	}

	@autobind
	onCellClick() {
		if (this.props.isCursor) {
			this.props.appStore.board.nextRound()
		} else {
			if (this.props.cell.isChained) {
				this.props.appStore.board.removeFromChain(this.props.cell)
			} else {
				this.props.appStore.board.addToChain(this.props.cell)
			}
		}
	}
}

export default inject('appStore')(CellElement) as React.ComponentClass<CellElement.Props>

import * as React from 'react'
import * as join from 'classnames'
import { inject, observer } from 'mobx-react'
import { onPatch } from 'mobx-state-tree'

import * as cls from './cell.css'

import autobind from '../../utils/autobind'
import { StoreInjectedProps } from '../../stores'
import { Cell } from '../../stores/board'

export namespace CellElement {
	export interface Props {
		cell: Cell
		isCursor: boolean
		isDeadPoint: boolean
		onBlow?: (cell: Cell) => void
	}
	export interface State {}
}

@observer
export class CellElement extends React.Component<CellElement.Props & StoreInjectedProps, CellElement.State> {
	componentDidMount() {
		const { cell, onBlow } = this.props
		if (onBlow) {
			// TODO: is it proper place? should i unsubscribe onUnmount?
			if (cell.sequenceValue) {
				onPatch(cell.sequenceValue as any, (ch) => ch.path === '/value' && ch.value === null && onBlow(cell))
			}
		}
	}

	render() {
		const { cell, appStore } = this.props
		const { cellSizePx, currentStage, maxStage } = appStore.board

		const isNotLast = Boolean(
			cell.isValueSequence && cell.z > 0 && appStore.board.findVisibleCell(cell.x, cell.y, cell.z - 1)
		)

		const className = join({
			[cls.main]: true,
			[cls.isChar]: cell.isValueSequence,
			[cls.isClear]: cell.isNullSequence,
			[cls.isEmpty]: cell.isEmpty,
			[cls.isActive]: cell.isChained,
			[cls.isCursor]: this.props.isCursor,
			[cls.isDeadPoint]: this.props.isDeadPoint,
			[cls.isNotLast]: isNotLast,
		})

		const opacity = cell.isValueSequence && cell.z !== currentStage
			? ((cell.z + maxStage - currentStage) / maxStage).toFixed(3)
			: undefined

		const styles: React.CSSProperties = {
			left: cell.x * cellSizePx,
			top: cell.y * cellSizePx,
			opacity: opacity ? Number(opacity) : undefined,
		}

		const value = cell.isValueSequence ? cell.sequenceValue!.value : '•'
		// const value = cell.sequenceValue
		// 	? (cell.isNullSequence ? '•' : cell.sequenceValue.value)
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

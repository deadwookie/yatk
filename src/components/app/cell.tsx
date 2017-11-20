import * as React from 'react'
import * as cls from 'classnames'
import { observer } from 'mobx-react'

import * as style from './cell.css'

import autobind from '../../utils/autobind'
import { random } from '../../utils/numbers'
import { StoreInjectedProps } from '../../stores'
import { Cell } from '../../stores/board'

export namespace CellElement {
	export interface Props extends StoreInjectedProps {
		cell: Cell
		isCursor: boolean
	}
	export interface State {}
}

@observer
export class CellElement extends React.Component<CellElement.Props, CellElement.State> {
	private randomAnimationDelay: number | string = random(0, 5).toFixed(3)

	render() {
		const { cell } = this.props

		const positionStyle = {
			left: cell.x * 50,
			top: cell.y * 50,
		}

		const className = cls({
			[style.main]: true,
			[style.isChar]: cell.isValueSequence,
			[style.isClear]: cell.isNullSequence,
			[style.isEmpty]: cell.isEmpty,
			[style.isActive]: cell.isChained,
			[style.isCursor]: this.props.isCursor,
		})

		const value = cell.sequenceValue
			? (cell.sequenceValue.value === null ? '•' : cell.sequenceValue.value)
			: cell.glyph
		return (
			<div
				className={className}
				style={positionStyle}
				onClick={this.onCellClick}
			>
				<span className={style.symbol} style={{animationDelay: `${this.randomAnimationDelay}s`}}>
					{value}
				</span>
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

import * as React from 'react'
import * as join from 'classnames'
import { inject, observer } from 'mobx-react'

import * as cls from './index.css'

import { StoreInjectedProps } from '../../stores'
import { Cell, CellStack } from '../../stores/board'
import { FinishResult } from '../../stores/statistic'
import CellElement from './cell'
import Particle from './particle'

export namespace Board {
	export interface Props {}
	export interface State {
		blowing: Cell[]
	}
}

@observer
export class Board extends React.Component<Board.Props & StoreInjectedProps, Board.State> {
	state: Board.State = {
		blowing: [],
	}

	componentDidMount() {
		this.props.appStore.board.newGame()
	}


	render() {
		return (
			<div className={cls.board}>
				{this.renderCells()}
				{this.renderBlowing()}
				{this.renderCursor()}
				{this.renderAlerts()}
			</div>
		)
	}

	renderCells() {
		const { appStore } = this.props

		return appStore.board.visibilityStacks.map((stack: CellStack) => {
			const topCell = stack.top
			return (
				<CellElement
					key={'box-cell-' + stack.key}
					stack={stack}
					isCursor={topCell === appStore.board.cursor}
					isDeadPoint={topCell === appStore.board.deadPoint}
				/>
			)
		})
	}

	renderBlowing() {
		const { board } = this.props.appStore
		if (!board.blowingCells.length) {
			return null
		}

		return board.blowingCells.map((cell) => (
			<Particle
				key={`blowing-${cell.key}`}
				x={cell.x}
				y={cell.y}
				onDone={() => board.unBlowCell(cell)}
			>
				{cell.glyph}
			</Particle>
		))
	}

	renderCursor() {
		const { board } = this.props.appStore
		if (board.finishResult) {
			// We don't need it at the end
			return null
		}

		const cursor = board.cursor && board.cells[board.cursor.index - 1]
		if (!cursor) {
			return null
		}

		const className = join({
			[cls.cursor]: true,
			[cls.isActive]: board.isProcessing,
		})

		const styles = {
			'--x': cursor.x,
			'--y': cursor.y,
		}

		return (
			<div className={className} style={styles} />
		)
	}

	// TODO: support different alerts/messages
	renderAlerts() {
		const { board } = this.props.appStore

		if (!board.finishResult) {
			return null
		}

		return (
			<aside className={cls.alert}>
				<p className={cls.message}>{board.finishResult === FinishResult.Win ? 'You Win' : 'Game Over'}</p>
			</aside>
		)
	}
}

export default inject('appStore')(Board) as React.ComponentClass<Board.Props>

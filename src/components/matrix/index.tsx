import * as React from 'react'
import { inject, observer } from 'mobx-react'

import * as style from './index.css'

import { autobind } from '../../utils/decorators'
import { StoreInjectedProps } from '../../stores'
import StrainInfo from './strain-info'
import ScoreInfo from './score-info'
import Board from './board'

export namespace Matrix {
	export interface Props {}
	export interface State {}
}

@observer
export class Matrix extends React.Component<Matrix.Props & StoreInjectedProps, Matrix.State> {
	render() {
		const { board } = this.props.appStore
		const isGameFinished = !!board.finishResult

		return (
			<section className={style.main}>
				<StrainInfo />
				<Board />
				<ScoreInfo />
				<nav className={style.actions}>
					<button onClick={this.onNextRoundClick} disabled={isGameFinished}>Next Round</button>
				</nav>
				<footer>
					<a onClick={this.onRestartClick}>New Game</a>
				</footer>
				{board.isProcessing ? <div className={style.freezeOverlay}/> : null}
			</section>
		)
	}

	@autobind
	onRestartClick() {
		this.props.appStore.board.newGame()
	}

	@autobind
	onNextRoundClick() {
		this.props.appStore.board.nextRound()
	}
}

export default inject('appStore')(Matrix) as React.ComponentClass<Matrix.Props>

import * as React from 'react'
import { inject, observer } from 'mobx-react'

import * as style from './index.css'

import { autobind } from '../../utils/decorators'
import { StoreInjectedProps } from '../../stores'
import StrainInfo from './strain-info'
import ScoreInfo from './score-info'
import Board from './board'

export namespace Matrix {
	export interface Props {
		sequenceId?: string
	}
	export interface State {}
}

@observer
export class Matrix extends React.Component<Matrix.Props & StoreInjectedProps, Matrix.State> {

	componentDidMount() {
		const { appStore, sequenceId } = this.props
		if (sequenceId) {
			appStore.board.newGame(sequenceId)
		} else {
			appStore.board.newGame()
		}
	}

	render() {
		const { board } = this.props.appStore
		const isGameFinished = !!board.finishResult

		const styles = {
			'--xn': board.width,
			'--yn': board.height,
		}

		return (
			<section style={styles} className={style.main}>
				<StrainInfo />
				<Board />
				<ScoreInfo />
				<nav className={style.actions}>
					<button onClick={this.onApplyRulesClick} disabled={isGameFinished}>Annihilate</button>
				</nav>
				<nav className={style.actions}>
					<button onClick={this.onNextRoundClick} disabled={isGameFinished}>Next Round</button>
				</nav>
				<footer>
					<a onClick={this.onRestartClick}>New Game</a> |
					<a onClick={this.onShowSeqIdClick}>Show seqId</a> |
					<a onClick={this.onShowStatsClick}>Show stats</a>
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
	onApplyRulesClick() {
		this.props.appStore.board.applyRules()
	}

	@autobind
	onNextRoundClick() {
		this.props.appStore.board.nextRound()
	}

	@autobind
	onShowSeqIdClick() {
		console.log(this.props.appStore.board.sequenceId)
	}

	@autobind
	onShowStatsClick() {
		console.log(this.props.appStore.board.debugStats())
	}
}

export default inject('appStore')(Matrix) as React.ComponentClass<Matrix.Props>

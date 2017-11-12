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
		this.props.store.board.generate(16)
	}

	render() {
		return (
			<section className={style.content}>
				<header>
					<div className={style.actions}>
						<button onClick={this.onRestartClick}>Restart</button>
						<button onClick={this.onNextRoundClick}>Next round</button>
					</div>
					<dl>
						<dt>Sequence length</dt>
						<dd>{this.props.store.board.sequence.values.length}</dd>
						<dt>Moves</dt>
						<dd>{this.props.store.board.movesCount}</dd>
					</dl>
				</header>
				<article>
					<span className={style.logo}>Matrix: {this.props.store.board.sequence.values.join(', ')}</span>
				</article>
			</section>
		)
	}

	@autobind
	onRestartClick() {
		this.props.store.board.generate(16)
	}

	@autobind
	onNextRoundClick() {
		this.props.store.board.nextRound()
	}
}

export default Matrix

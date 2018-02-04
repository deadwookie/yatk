import * as React from 'react'
import { inject, observer } from 'mobx-react'

import * as style from './index.css'

import { StoreInjectedProps } from '../../stores'

export namespace ScoreInfo {
	export interface Props {}
	export interface State {}
}

@observer
export class ScoreInfo extends React.Component<ScoreInfo.Props & StoreInjectedProps, ScoreInfo.State> {
	render() {
		const { board } = this.props.appStore

		return (
			<dl className={style.info}>
				<dt className={style.term}>Round</dt>
				<dd className={style.desc}>#{board.round}</dd>
				<dt className={style.term}>Score:</dt>
				<dd className={style.desc}>{board.score} points</dd>
				<dd className={style.desc}>{board.movesCount * 2} cells cleared</dd>
			</dl>
		)
	}
}

export default inject('appStore')(ScoreInfo) as React.ComponentClass<ScoreInfo.Props>

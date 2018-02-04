import * as React from 'react'
import * as join from 'classnames'
import { inject, observer } from 'mobx-react'

import * as style from './index.css'

import { StoreInjectedProps } from '../../stores'

export namespace StrainInfo {
	export interface Props {}
	export interface State {}
}

@observer
export class StrainInfo extends React.Component<StrainInfo.Props & StoreInjectedProps, StrainInfo.State> {
	render() {
		const { board } = this.props.appStore

		const isGonnaLoose = board.strain.length > board.freeSpaceLeft

		return (
			<dl className={style.info}>
				<dt className={style.term}>Depth:</dt>
				<dd className={style.desc}>{board.currentStage + 1}/{board.maxStage}</dd>
				<dt className={style.term}>Infected:</dt>
				<dd className={style.desc}>{board.strain.length} cells</dd>
				<dt className={join(style.term, isGonnaLoose && style.warn)}>Rest:</dt>
				<dd className={join(style.desc, isGonnaLoose && style.warn)}>{board.freeSpaceLeft} cells</dd>
			</dl>
		)
	}
}

export default inject('appStore')(StrainInfo) as React.ComponentClass<StrainInfo.Props>

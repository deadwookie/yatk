import * as React from 'react'
import * as style from './footer.css'
import { observer, inject } from 'mobx-react'

import { StoreInjectedProps } from '../../stores'

export namespace Footer {
	export interface Props {}
	export interface State {}
}

@observer
export class Footer extends React.Component<Footer.Props & StoreInjectedProps, Footer.State> {
	render() {
		return (
			<footer className={style.main}>
				<p>v{this.props.store.appVersion}</p>
			</footer>
		)
	}
}

export default inject('store')(Footer) as React.ComponentClass<Footer.Props>


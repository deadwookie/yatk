import * as React from 'react'
import * as style from './footer.css'
import { inject, observer } from 'mobx-react'

import { StoreInjectedProps } from '../../stores'

export namespace Footer {
	export interface Props {

	}
	export interface State {}
}

@observer
export class Footer extends React.Component<Footer.Props & StoreInjectedProps, Footer.State> {
	render() {
		return (
			<footer className={style.main}>
				<p>v{this.props.appStore.appVersion}</p>
			</footer>
		)
	}
}

export default inject('appStore')(Footer) as React.ComponentClass<Footer.Props>

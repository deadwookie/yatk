import * as React from 'react'
import * as style from './footer.css'
import { observer } from 'mobx-react'

import { StoreInjectedProps } from '../../stores'

export namespace Footer {
	export interface Props extends StoreInjectedProps {

	}
	export interface State {}
}

@observer
export class Footer extends React.Component<Footer.Props, Footer.State> {
	render() {
		return (
			<footer className={style.footer}>
				<p>{this.props.store.appVersion}</p>
			</footer>
		)
	}
}

export default Footer

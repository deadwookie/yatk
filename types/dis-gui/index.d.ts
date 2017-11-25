// https://github.com/wwwtyro/dis-gui

import { PureComponent as Component } from 'react'

export namespace GUI {
	export interface Expandable {
		expanded?: boolean
	}
	export interface Element {
		label: string
	}
	export type ChangeCb<T> = (value: T) => void

	export interface Props {
	}
}
export class GUI extends Component<GUI.Props, object> { }

export namespace Folder {
	export interface Props extends GUI.Element, GUI.Expandable {
	}
}
export class Folder extends Component<Folder.Props, object> { }

export namespace Number {
	export interface Props extends GUI.Element {
		value: number
		min?: number
		max?: number
		step?: number
		decimals?: number

		onChange?: ChangeCb<number>
		onFinishChange?: ChangeCb<number>
	}
}
export class Number extends Component<Number.Props, object> { }

export namespace Button {
	export interface Props extends GUI.Element {
		onClick?: () => void
	}
}
export class Button extends Component<Button.Props, object> { }



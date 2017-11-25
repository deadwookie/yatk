// https://github.com/wwwtyro/dis-gui

import { PureComponent } from 'react'

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
export class GUI extends PureComponent<GUI.Props, object> { }

export namespace Folder {
	export interface Props extends GUI.Element, GUI.Expandable {
	}
}
export class Folder extends PureComponent<Folder.Props, object> { }

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
export class Number extends PureComponent<Number.Props, object> { }

export namespace Button {
	export interface Props extends GUI.Element {
		onClick?: () => void
	}
}
export class Button extends PureComponent<Button.Props, object> { }



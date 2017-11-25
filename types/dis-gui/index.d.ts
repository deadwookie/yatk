// https://github.com/wwwtyro/dis-gui

import { PureComponent as Component } from 'react'

export namespace GUI {
	export interface Expandable {
		expanded?: boolean
	}
	export interface Changable<T> {
		onChange?: ChangeCb<T>
		onFinishChange?: ChangeCb<T>
	}
	export interface Labeled {
		label: string
	}
	export type ChangeCb<T> = (value: T) => void

	export interface Props {
	}
}
export class GUI extends Component<GUI.Props, object> { }

export namespace Folder {
	export interface Props extends GUI.Labeled, GUI.Expandable {
	}
}
export class Folder extends Component<Folder.Props, object> { }

export namespace Number {
	export interface Props extends GUI.Labeled, GUI.Changable<number> {
		value: number
		min?: number
		max?: number
		step?: number
		decimals?: number
	}
}
export class Number extends Component<Number.Props, object> { }

export namespace Button {
	export interface Props extends GUI.Labeled {
		onClick?: () => void
	}
}
export class Button extends Component<Button.Props, object> { }

export namespace Checkbox {
	export interface Props extends GUI.Labeled, GUI.Changable<boolean> {
		checked: boolean
	}
}
export class Checkbox extends Component<Checkbox.Props, object> { }



import pkg from '../../package.json'

import { defaultBoard } from './board'

export const settingsDefault = {
	appVersion: pkg.version,
	board: defaultBoard
}

export function buildSettings(_width: number, _height: number) {
	return settingsDefault
}

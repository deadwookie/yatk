import * as _ from 'lodash'
import pkg from '../../package.json'

import { defaultBoard, simplifiedBoard } from './board'

export const settingsDefault = {
	appVersion: pkg.version,
	board: defaultBoard
}

const settingsSimplified = {
	board: simplifiedBoard
}

export function buildSettings(width: number, height: number) {
	const isSimplified = width < 960 || height < 960
	const settings = isSimplified ? _.merge(settingsDefault, settingsSimplified) : settingsDefault
	return settings
}

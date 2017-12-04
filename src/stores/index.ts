import { types } from 'mobx-state-tree'

import { Board } from './board'

export const Store = types.model('Store', {
	appVersion: types.string,
	board: Board
})

export type Store = typeof Store.Type

export interface StoreInjectedProps {
	store: Store,
	// TODO: review router store/better way
	router?: any
}

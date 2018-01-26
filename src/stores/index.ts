import { types } from 'mobx-state-tree'

import { Board } from './board'

export const AppStore = types.model('Store', {
	appVersion: types.string,
	board: Board
})

export type AppStore = typeof AppStore.Type

export interface StoreInjectedProps {
	appStore: AppStore
}

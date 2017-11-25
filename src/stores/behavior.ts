import { types, IType } from 'mobx-state-tree'

export interface Behavior {
	seqArrangeStepDelayMs: number
}

export const Behavior: IType<{}, Behavior> = types
	.model('Behavior', {
		seqArrangeStepDelayMs: types.number
	})

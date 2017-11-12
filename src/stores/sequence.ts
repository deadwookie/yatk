import { types, IType } from 'mobx-state-tree'

export interface Sequence {
	values: Array<number | null>
	replicate: () => void
	generate: (length: number) => void
}
export const Sequence: IType<{}, Sequence> = types
	.model('Sequence', {
		values: types.array(types.union(types.number, types.null))
	})
	.actions((self) => ({
		clear() {
			self.values.splice(0)
		}
	}))
	.actions((self) => ({
		replicate() {
			self.values.push(...self.values.filter(v => v !== null))
		},

		generate(length: number) {
			self.clear()
			self.values.push(...[...Array(length)].map(() => Math.min(9, Math.floor(Math.random() * 10))))
		},

		resetTo(sequence: Array<number | null>) {
			self.clear()
			self.values.push(...sequence)
		},

		removeByIndexes(indexes: Array<number>) {
			const chains: Array<{index: number, count: number}> = indexes.reduce((acc, val, index) => {
				if (index > 0 && (acc[acc.length - 1].index + acc[acc.length - 1].count) === val) {
					acc[acc.length - 1].count++
				} else {
					acc.push({index: val, count: 1})
				}

				return acc
			}, [] as Array<{index: number, count: number}>)

			let removedCount = 0
			for(const chain of chains) {
				self.values.splice(chain.index - removedCount, chain.count)
				removedCount += chain.count
			}
		}
	}))

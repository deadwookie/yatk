import { random } from './numbers'

export type Char = string | number
export interface CharMapOfGlyphs {
	[char: string]: string[]
}

export const CHARMAP: CharMapOfGlyphs = {
	// see https://www.omniglot.com/language/numbers/japanese.htm
	// http://www.sljfaq.org/afaq/jikkan-juunishi.html
	0: ['零', /*'〇',*/   '癸', '虚'],
	1: ['壱', '壹', '一', '甲'],
	2: ['弐', '貳', '二', '乙'],
	3: ['参', '參', '三', '丙'],
	4: ['四', '肆', '丁'],
	5: ['五', '伍', '戊'],
	6: ['六', '陸', '己'],
	7: ['七', '柒', '庚'],
	8: ['八', '捌', '辛'],
	9: ['九', '玖', '壬'],
}

export function getGlyph(char: Char = random(), charAsGlyphChance: number = 0): string {
	if (char == null || !Array.isArray(CHARMAP[char])) {
		throw new Error(`CHARMAP does not include "${char}" chars`)
	}

	if (charAsGlyphChance >= 1 || charAsGlyphChance > 0 && Math.random() >= 1 - charAsGlyphChance) {
		return String(char)
	}

	const chars = CHARMAP[char]
	return chars[random(0, chars.length)]
}

export enum Direction {
	Up = 'up',
	UpRight = 'upRight',
	Right = 'right',
	DownRight = 'downRight',
	Down = 'down',
	DownLeft = 'downLeft',
	Left = 'left',
	UpLeft = 'upLeft'
}

export interface Point {
	x: number
	y: number
}

export interface Size {
	width: number
	height: number
}

export function getNextIndex(baseIndex: number, width: number, dir: Direction | null): number | null {
	let nextIndex = null

	switch (dir) {
		case Direction.Right:
			nextIndex = baseIndex + 1
			break
		case Direction.Down:
			nextIndex = baseIndex + width
			break
		case Direction.Left:
			nextIndex = baseIndex - 1
			break
		case Direction.Up:
			nextIndex = baseIndex - width
			break
		case Direction.UpRight:
			nextIndex = baseIndex - width + 1
			break
		case Direction.DownRight:
			nextIndex = baseIndex + width + 1
			break
		case Direction.UpLeft:
			nextIndex = baseIndex - width - 1
			break
		case Direction.DownLeft:
			nextIndex = baseIndex + width - 1
			break
	}

	return nextIndex
}

export function canMove(cursor: Point, size: Size, dir: Direction): boolean {
	switch (dir) {
		case Direction.Right:
			return cursor.x < size.width - 1
		case Direction.Down:
			return cursor.y < size.height - 1
		case Direction.Left:
			return cursor.x > 0
		case Direction.Up:
			return cursor.y > 0
		case Direction.UpRight:
			return cursor.y > 0 && (cursor.x < size.width - 1)
		case Direction.DownRight:
			return (cursor.y < size.height - 1) && (cursor.x < size.width - 1)
		case Direction.UpLeft:
			return cursor.y > 0 && cursor.x > 0
		case Direction.DownLeft:
			return (cursor.y < size.height - 1) && cursor.x > 0
	}

	return false
}

export function isHorizontal(dir: Direction | null): boolean {
	return !!dir && (dir === Direction.Right || dir === Direction.Left)
}

export function isVertical(dir: Direction | null): boolean {
	return !!dir && (dir === Direction.Up || dir === Direction.Down)
}

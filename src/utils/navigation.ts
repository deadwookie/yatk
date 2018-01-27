export enum Direction {
	Up = 'up',
	UpRight = 'upRight',
	Right = 'right',
	DownRight = 'downRight',
	Down = 'down',
	DownLeft = 'downLeft',
	Left = 'left',
	UpLeft = 'upLeft',
	Deep = 'deep',
	High = 'high'
}

export interface Point2D {
	x: number
	y: number
}

export interface Point extends Point2D {
	z: number
}

export interface Size2D {
	width: number
	height: number
}

export interface Size extends Size2D {
	depth: number
}

export function getIndexByCoordinate2D(point: Point2D, size: Size2D): number {
	return point.y * size.width + point.x
}

export function getIndexByCoordinate(point: Point, size: Size): number {
	return point.z * size.width * size.height + point.y * size.width + point.x
}

export function getByCoordinate<T>(points: T[], point: Point, size: Size): T | null {
	return points[getIndexByCoordinate(point, size)] || null
}

export function getNextIndex(baseIndex: number, size: Size, dir: Direction | null): number | null {
	let nextIndex = null

	switch (dir) {
		case Direction.Right:
			nextIndex = baseIndex + 1
			break
		case Direction.Down:
			nextIndex = baseIndex + size.width
			break
		case Direction.Left:
			nextIndex = baseIndex - 1
			break
		case Direction.Up:
			nextIndex = baseIndex - size.width
			break
		case Direction.Deep:
			nextIndex = baseIndex - size.width * size.height
			break
		case Direction.High:
			nextIndex = baseIndex + size.width * size.height
			break
		case Direction.UpRight:
			nextIndex = getNextIndex(getNextIndex(baseIndex, size, Direction.Up)!, size, Direction.Right)
			break
		case Direction.DownRight:
			nextIndex = getNextIndex(getNextIndex(baseIndex, size, Direction.Down)!, size, Direction.Right)
			break
		case Direction.UpLeft:
			nextIndex = getNextIndex(getNextIndex(baseIndex, size, Direction.Up)!, size, Direction.Left)
			break
		case Direction.DownLeft:
			nextIndex = getNextIndex(getNextIndex(baseIndex, size, Direction.Down)!, size, Direction.Left)
			break
	}

	return nextIndex
}

export function canMove(cursor: Point, size: Size, dir: Direction): boolean {
	switch (dir) {
		case Direction.Right:
			return cursor.x < size.width - 1
		case Direction.Down:
			return (cursor.y < size.height - 1) || (cursor.z < size.depth - 1)
		case Direction.Left:
			return cursor.x > 0
		case Direction.Up:
			return cursor.y > 0 || cursor.z > 0
		case Direction.Deep:
			return cursor.z > 0
		case Direction.High:
			return cursor.z	< size.depth - 1
		case Direction.UpRight:
			return canMove(cursor, size, Direction.Up) && canMove(cursor, size, Direction.Right)
		case Direction.DownRight:
			return canMove(cursor, size, Direction.Down) && canMove(cursor, size, Direction.Right)
		case Direction.UpLeft:
			return canMove(cursor, size, Direction.Up) && canMove(cursor, size, Direction.Left)
		case Direction.DownLeft:
			return canMove(cursor, size, Direction.Down) && canMove(cursor, size, Direction.Left)
	}

	return false
}

export function isHorizontal(dir: Direction | null): boolean {
	return !!dir && (dir === Direction.Right || dir === Direction.Left)
}

export function isVertical(dir: Direction | null): boolean {
	return !!dir && (dir === Direction.Up || dir === Direction.Down)
}

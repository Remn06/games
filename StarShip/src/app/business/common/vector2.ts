import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class Vector2 {

	@Expose()
	public x: number;
	@Expose()
	public y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public subtract(value: Vector2): Vector2 {
		return new Vector2(this.x - value.x, this.y - value.y);
	}

	public add(value: Vector2): Vector2 {
		return new Vector2(this.x + value.x, this.y + value.y);
	}
}

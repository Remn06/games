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
}

import { Exclude, Expose, Type } from 'class-transformer';
import { Vector2 } from '../common/vector2';
import { GameObject } from './game-object';

@Exclude()
export class Transform {

	@Expose()
	@Type(() => Vector2)
	private positionValue: Vector2 = null;

	@Expose()
	private rotationValue: number = null;

	@Expose()
	public width: number = null;

	@Expose()
	public height: number = null;


	public gameObject: GameObject = null;

}

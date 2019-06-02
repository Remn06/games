import { Exclude, Expose, Type } from 'class-transformer';
import { Vector2 } from '../common/vector2';
import { GameObject } from './game-object';

@Exclude()
export class Transform {

	@Expose()
	@Type(() => Vector2)
	private positionValue: Vector2 = null;

	@Expose()
	@Type(() => Vector2)
	private localPositionValue: Vector2 = null;

	@Expose()
	private rotationValue: number = null;

	@Expose()
	public width: number = null;

	@Expose()
	public height: number = null;

	public gameObject: GameObject = null;

	public static Instantiate(position: Vector2, rotation: number, width: number, height: number): Transform {
		const t = new Transform();
		t.positionValue = position;
		t.localPositionValue = new Vector2(0, 0);
		t.rotationValue = rotation;
		t.width = width;
		t.height = height;
		return t;
	}

	public get position(): Vector2 {
		return this.positionValue;
	}

	public set position(value: Vector2) {
		this.positionValue = value;
		this.recalcChildrenPosition();
	}

	public get localPosition(): Vector2 {
		return this.localPositionValue;
	}

	public set localPosition(value: Vector2) {

		this.localPositionValue = value;
		const parentPos = this.gameObject.parent.transform.position;

		this.positionValue = new Vector2(parentPos.x + value.x, parentPos.y + value.y);

		this.recalcChildrenPosition();
	}

	public get rotation(): number {
		return this.rotationValue;
	}

	public set rotation(value: number) {
		this.rotationValue = value;
	}

	private recalcChildrenPosition() {
		// recalc world position by setting its current local position.
		this.gameObject.children.forEach((ch: GameObject) => {
			ch.transform.localPosition = ch.transform.localPosition;
		});
	}
}

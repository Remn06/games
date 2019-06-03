import { Exclude, Expose, Type } from 'class-transformer';
import { Vector2 } from '../common/vector2';
import { GameObject } from './game-object';
import { VMath } from '../common/v-math';

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
	private localRotationValue: number = null;

	@Expose()
	public width: number = null;

	@Expose()
	public height: number = null;

	public gameObject: GameObject = null;

	public static instantiate(position: Vector2, rotation: number, width: number, height: number): Transform {
		const t = new Transform();
		t.positionValue = position;
		t.localPositionValue = new Vector2(0, 0);
		t.rotationValue = rotation;
		t.localRotationValue = rotation;
		t.width = width;
		t.height = height;
		return t;
	}

	public static instantiateChild(
			parentPosition: Vector2,
			localPosition: Vector2,
			rotation: number,
			width: number,
			height: number): Transform {
		const t = new Transform();
		t.positionValue = parentPosition.add(localPosition);
		t.localPositionValue = localPosition;
		t.rotationValue = rotation;
		t.localRotationValue = rotation;
		t.width = width;
		t.height = height;
		return t;
	}


	public get position(): Vector2 {
		return this.positionValue;
	}

	public set position(value: Vector2) {
		this.positionValue = value;
		const parentPos = this.parentPosition;
		this.localPositionValue = this.positionValue.subtract(parentPos);
		this.recalculateChildPosition();
	}

	public get localPosition(): Vector2 {
		return this.localPositionValue;
	}

	public set localPosition(value: Vector2) {

		this.localPositionValue = value;
		const parentPos = this.parentPosition;

		this.positionValue = new Vector2(parentPos.x + value.x, parentPos.y + value.y);

		this.recalculateChildPosition();
	}

	public get rotation(): number {
		return this.rotationValue;
	}

	public set rotation(value: number) {
		this.rotationValue = value + this.localRotationValue;
		this.recalculateChildRotation(value);
	}

	private get parentPosition(): Vector2 {
		return this.gameObject.parent != null
			? this.gameObject.parent.transform.position
			: Vector2.zero;
	}

	private get parentRotation(): number {
		return this.gameObject.parent != null
			? this.gameObject.parent.transform.rotation
			: 0;
	}

	private recalculateChildPosition() {
		// recalculate world position by setting its current local position.
		this.gameObject.children.forEach((ch: GameObject) => {
			ch.transform.localPosition = ch.transform.localPosition;
		});
	}

	private recalculateChildRotation(value: number) {
		this.gameObject.children.forEach((ch: GameObject) => {
			const anchor = new Vector2(this.width / 2, this.height / 2);
			let newLocalPosition = VMath.rotate(ch.transform.localPositionValue.subtract(anchor), value);
			newLocalPosition = newLocalPosition.add(anchor);
			ch.transform.positionValue = ch.transform.parentPosition.add(newLocalPosition);
			ch.transform.rotation = value;
		});
	}

}

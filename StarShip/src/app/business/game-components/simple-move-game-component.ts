import { GameComponent } from './base/game-component';
import { Timer } from '../common/Timer';
import { Vector2 } from '../common/vector2';
import { Exclude, Expose, Type } from 'class-transformer';
import { VMath } from '../common/v-math';
import { ComponentsRegistry } from './base/components-registry';

@Exclude()
export class SimpleMoveGameComponent extends GameComponent {

	@Expose()
	public speed = null;

	@Expose()
	public rotation = null;

	@Expose()
	@Type(() => Vector2)
	public direction: Vector2 = null;

	start(): void {
	}

	draw(): void {
	}

	update(): void {
		const position = this.gameObject.transform.position;

		this.gameObject.transform.rotation += this.rotation * Timer.delta;
		const direction = VMath.rotate(new Vector2(1, 0), this.gameObject.transform.rotation);
		this.gameObject.transform.position = VMath.add(position, VMath.multiply(direction, this.speed * Timer.delta));
	}

	destroy(): void {
	}
}





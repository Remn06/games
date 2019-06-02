import { Exclude, Expose } from 'class-transformer';
import { GameComponent } from './base/game-component';
import { Timer } from '../common/Timer';
import { Vector2 } from '../common/vector2';

@Exclude()
export class ShiftRightComponent extends GameComponent {

	@Expose()
	public speed = null;

	start(): void {
	}

	draw(): void {
	}

	update(): void {
		const x = this.gameObject.transform.position.x + this.speed * Timer.delta;
		const y = this.gameObject.transform.position.y;
		this.gameObject.transform.position = new Vector2(x, y);
	}

	destroy(): void {
	}
}

